const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const { authenticate, requireCourseOwner, requireEnrollment } = require('../middlewares/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Get assignments for a course
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

    const assignments = await Assignment.getAssignmentsByCourse(req.params.courseId);

    res.json({
      success: true,
      assignments
    });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single assignment
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid assignment ID')
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

    const assignment = await Assignment.findById(req.params.id)
      .populate('course', 'title teacher')
      .populate('submissions.student', 'name email')
      .populate('submissions.gradedBy', 'name');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check permissions
    const isOwner = assignment.course.teacher.toString() === req.user._id.toString();
    const isEnrolled = await Course.findOne({
      _id: assignment.course._id,
      'enrolledStudents.student': req.user._id
    });

    if (!isOwner && !isEnrolled && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // If student, only show their own submission
    if (req.user.role === 'student' && !isOwner) {
      const studentSubmission = assignment.submissions.find(
        sub => sub.student._id.toString() === req.user._id.toString()
      );
      assignment.submissions = studentSubmission ? [studentSubmission] : [];
    }

    res.json({
      success: true,
      assignment
    });
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create assignment (Teacher only - course owner)
router.post('/', [
  body('course').isMongoId().withMessage('Invalid course ID'),
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('deadline').isISO8601().withMessage('Valid deadline is required'),
  body('maxPoints').isInt({ min: 1, max: 100 }).withMessage('Max points must be 1-100'),
  body('instructions').optional().trim().isLength({ max: 2000 }).withMessage('Instructions too long')
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

    const { course, deadline, ...assignmentData } = req.body;

    // Validate deadline is in the future
    if (new Date(deadline) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Deadline must be in the future'
      });
    }

    const assignment = new Assignment({
      ...assignmentData,
      course,
      deadline: new Date(deadline)
    });

    await assignment.save();

    // Update course assignment count
    await Course.findByIdAndUpdate(course, { $inc: { totalAssignments: 1 } });

    await assignment.populate('course', 'title');

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      assignment
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update assignment (Teacher only - course owner)
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid assignment ID'),
  body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('deadline').optional().isISO8601().withMessage('Valid deadline is required'),
  body('maxPoints').optional().isInt({ min: 1, max: 100 }).withMessage('Max points must be 1-100'),
  body('instructions').optional().trim().isLength({ max: 2000 }).withMessage('Instructions too long'),
  body('status').optional().isIn(['active', 'closed']).withMessage('Invalid status')
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

    const assignment = await Assignment.findById(req.params.id).populate('course', 'teacher');
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check ownership
    if (assignment.course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Validate deadline if being updated
    if (req.body.deadline && new Date(req.body.deadline) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Deadline must be in the future'
      });
    }

    Object.assign(assignment, req.body);
    await assignment.save();

    res.json({
      success: true,
      message: 'Assignment updated successfully',
      assignment
    });
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete assignment (Teacher only - course owner)
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid assignment ID')
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

    const assignment = await Assignment.findById(req.params.id).populate('course', 'teacher');
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check ownership
    if (assignment.course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update course assignment count
    await Course.findByIdAndUpdate(assignment.course._id, { $inc: { totalAssignments: -1 } });

    await Assignment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Submit assignment (Student only)
router.post('/:id/submit', [
  param('id').isMongoId().withMessage('Invalid assignment ID'),
  body('files').optional().isArray().withMessage('Files must be an array'),
  body('files.*.name').optional().trim().isLength({ min: 1 }).withMessage('File name is required'),
  body('files.*.url').optional().trim().isLength({ min: 1 }).withMessage('File URL is required')
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

    const assignment = await Assignment.findById(req.params.id).populate('course', 'teacher');
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if assignment is still active
    if (assignment.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Assignment is no longer accepting submissions'
      });
    }

    // Check if student is enrolled
    const isEnrolled = await Course.findOne({
      _id: assignment.course._id,
      'enrolledStudents.student': req.user._id
    });

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to submit assignments'
      });
    }

    const { files = [] } = req.body;
    const submissionDate = new Date();

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      sub => sub.student.toString() === req.user._id.toString()
    );

    if (existingSubmission) {
      // Update existing submission
      existingSubmission.files = files;
      existingSubmission.submittedAt = submissionDate;
      existingSubmission.status = assignment.isLateSubmission(submissionDate) ? 'late' : 'submitted';
    } else {
      // Create new submission
      assignment.submissions.push({
        student: req.user._id,
        submittedAt: submissionDate,
        files,
        status: assignment.isLateSubmission(submissionDate) ? 'late' : 'submitted'
      });
    }

    await assignment.save();

    res.json({
      success: true,
      message: 'Assignment submitted successfully'
    });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Grade submission (Teacher only - course owner)
router.put('/:id/submissions/:studentId/grade', [
  param('id').isMongoId().withMessage('Invalid assignment ID'),
  param('studentId').isMongoId().withMessage('Invalid student ID'),
  body('grade').isFloat({ min: 0, max: 100 }).withMessage('Grade must be 0-100'),
  body('feedback').optional().trim().isLength({ max: 500 }).withMessage('Feedback too long')
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

    const { id, studentId } = req.params;
    const { grade, feedback } = req.body;

    const assignment = await Assignment.findById(id).populate('course', 'teacher');
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check ownership
    if (assignment.course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Find submission
    const submission = assignment.submissions.find(
      sub => sub.student.toString() === studentId
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Update submission
    submission.grade = grade;
    submission.feedback = feedback;
    submission.gradedAt = new Date();
    submission.gradedBy = req.user._id;
    submission.status = 'graded';

    await assignment.save();

    res.json({
      success: true,
      message: 'Submission graded successfully'
    });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

