const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const { authenticate, requireCourseOwner, requireEnrollment } = require('../middlewares/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Get quizzes for a course
router.get('/course/:courseId', [
  param('courseId').isMongoId().withMessage('Invalid course ID'),
  requireEnrollment
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const quizzes = await Quiz.getQuizzesByCourse(req.params.courseId);

    // For students, hide questions and answers
    if (req.user.role === 'student') {
      quizzes.forEach(quiz => {
        quiz.questions = undefined;
        quiz.attempts = quiz.attempts.filter(
          attempt => attempt.student.toString() === req.user._id.toString()
        );
      });
    }

    res.json({
      success: true,
      quizzes
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single quiz
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid quiz ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const quiz = await Quiz.findById(req.params.id)
      .populate('course', 'title teacher')
      .populate('attempts.student', 'name email');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check permissions
    const isOwner = quiz.course.teacher.toString() === req.user._id.toString();
    const isEnrolled = await Course.findOne({
      _id: quiz.course._id,
      'enrolledStudents.student': req.user._id
    });

    if (!isOwner && !isEnrolled && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // For students, hide questions and show only their attempts
    if (req.user.role === 'student' && !isOwner) {
      quiz.questions = undefined;
      quiz.attempts = quiz.attempts.filter(
        attempt => attempt.student.toString() === req.user._id.toString()
      );
    }

    res.json({
      success: true,
      quiz
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create quiz (Teacher only - course owner)
router.post('/', [
  body('course').isMongoId().withMessage('Invalid course ID'),
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description too long'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
  body('questions.*.question').trim().isLength({ min: 5 }).withMessage('Question text is required'),
  body('questions.*.options').isArray({ min: 2, max: 6 }).withMessage('2-6 options required'),
  body('questions.*.correctAnswer').isInt({ min: 0, max: 5 }).withMessage('Valid correct answer required'),
  body('questions.*.points').optional().isInt({ min: 1, max: 10 }).withMessage('Points must be 1-10'),
  body('timeLimit').optional().isInt({ min: 0 }).withMessage('Time limit must be non-negative'),
  body('passingScore').optional().isInt({ min: 0, max: 100 }).withMessage('Passing score must be 0-100'),
  body('maxAttempts').optional().isInt({ min: 1, max: 10 }).withMessage('Max attempts must be 1-10')
], requireCourseOwner, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { course, questions, ...quizData } = req.body;

    // Validate questions structure
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (q.correctAnswer >= q.options.length) {
        return res.status(400).json({
          success: false,
          message: `Question ${i + 1}: Correct answer index is out of range`
        });
      }
    }

    const quiz = new Quiz({
      ...quizData,
      course,
      questions,
      status: 'draft'
    });

    await quiz.save();

    // Update course quiz count
    await Course.findByIdAndUpdate(course, { $inc: { totalQuizzes: 1 } });

    await quiz.populate('course', 'title');

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update quiz (Teacher only - course owner)
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid quiz ID'),
  body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description too long'),
  body('questions').optional().isArray({ min: 1 }).withMessage('At least one question is required'),
  body('timeLimit').optional().isInt({ min: 0 }).withMessage('Time limit must be non-negative'),
  body('passingScore').optional().isInt({ min: 0, max: 100 }).withMessage('Passing score must be 0-100'),
  body('maxAttempts').optional().isInt({ min: 1, max: 10 }).withMessage('Max attempts must be 1-10'),
  body('status').optional().isIn(['draft', 'published', 'closed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const quiz = await Quiz.findById(req.params.id).populate('course', 'teacher');
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check ownership
    if (quiz.course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Validate questions if being updated
    if (req.body.questions) {
      for (let i = 0; i < req.body.questions.length; i++) {
        const q = req.body.questions[i];
        if (q.correctAnswer >= q.options.length) {
          return res.status(400).json({
            success: false,
            message: `Question ${i + 1}: Correct answer index is out of range`
          });
        }
      }
    }

    Object.assign(quiz, req.body);
    await quiz.save();

    res.json({
      success: true,
      message: 'Quiz updated successfully',
      quiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete quiz (Teacher only - course owner)
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid quiz ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const quiz = await Quiz.findById(req.params.id).populate('course', 'teacher');
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check ownership
    if (quiz.course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update course quiz count
    await Course.findByIdAndUpdate(quiz.course._id, { $inc: { totalQuizzes: -1 } });

    await Quiz.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Start quiz attempt (Student only)
router.post('/:id/attempt', [
  param('id').isMongoId().withMessage('Invalid quiz ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const quiz = await Quiz.findById(req.params.id).populate('course', 'teacher');
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if student is enrolled
    const isEnrolled = await Course.findOne({
      _id: quiz.course._id,
      'enrolledStudents.student': req.user._id
    });

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to take quizzes'
      });
    }

    // Check if quiz is published
    if (quiz.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Quiz is not available'
      });
    }

    // Check if student can attempt
    if (!quiz.canStudentAttempt(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Maximum attempts reached'
      });
    }

    const attemptNumber = quiz.attempts.filter(
      attempt => attempt.student.toString() === req.user._id.toString()
    ).length + 1;

    // Create new attempt
    quiz.attempts.push({
      student: req.user._id,
      attemptNumber,
      startedAt: new Date()
    });

    await quiz.save();

    // Return quiz with questions (but shuffle if needed)
    let questions = [...quiz.questions];
    if (quiz.shuffleQuestions) {
      questions = questions.sort(() => Math.random() - 0.5);
    }

    if (quiz.shuffleOptions) {
      questions = questions.map(q => ({
        ...q.toObject(),
        options: [...q.options].sort(() => Math.random() - 0.5)
      }));
    }

    res.json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        questions,
        attemptNumber
      }
    });
  } catch (error) {
    console.error('Start quiz attempt error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Submit quiz attempt (Student only)
router.post('/:id/submit', [
  param('id').isMongoId().withMessage('Invalid quiz ID'),
  body('answers').isArray().withMessage('Answers array is required'),
  body('timeSpent').optional().isInt({ min: 0 }).withMessage('Time spent must be non-negative')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { answers, timeSpent = 0 } = req.body;

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Find the latest attempt for this student
    const attempts = quiz.attempts.filter(
      attempt => attempt.student.toString() === req.user._id.toString()
    );

    if (attempts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active attempt found'
      });
    }

    const currentAttempt = attempts[attempts.length - 1];

    if (currentAttempt.completedAt) {
      return res.status(400).json({
        success: false,
        message: 'Attempt already completed'
      });
    }

    // Grade the attempt
    const result = quiz.gradeAttempt(answers, timeSpent);

    // Update attempt
    currentAttempt.answers = result.answers;
    currentAttempt.score = result.score;
    currentAttempt.percentage = result.percentage;
    currentAttempt.passed = result.passed;
    currentAttempt.completedAt = new Date();
    currentAttempt.timeSpent = timeSpent;

    await quiz.save();

    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      result: {
        score: result.score,
        percentage: result.percentage,
        passed: result.passed,
        totalPoints: quiz.totalPoints
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

