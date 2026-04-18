const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Course = require('../models/Course');
const User = require('../models/User');
const {
  authenticate,
  requireTeacher,
  requireStudent,
  requireEnrollment,
  requireCourseOwner
} = require('../middlewares/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Get all courses (public - for browsing)
router.get('/public', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, level, search } = req.query;

    const query = { status: 'published' };

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('teacher', 'name email profileImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCourses: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get public courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get courses created by teacher
router.get('/my-courses', requireTeacher, async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user._id })
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      courses
    });
  } catch (error) {
    console.error('Get my courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get enrolled courses for student
router.get('/enrolled', requireStudent, async (req, res) => {
  try {
    const courses = await Course.find({
      'enrolledStudents.student': req.user._id
    })
      .populate('teacher', 'name email profileImage')
      .sort({ 'enrolledStudents.enrolledAt': -1 });

    // Add enrollment info to each course
    const coursesWithProgress = courses.map(course => {
      const enrollment = course.enrolledStudents.find(
        e => e.student.toString() === req.user._id.toString()
      );
      return {
        ...course.toObject(),
        enrollment: {
          enrolledAt: enrollment.enrolledAt,
          progress: enrollment.progress
        }
      };
    });

    res.json({
      success: true,
      courses: coursesWithProgress
    });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single course
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid course ID')
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

    const course = await Course.findById(req.params.id)
      .populate('teacher', 'name email profileImage')
      .populate('enrolledStudents.student', 'name email profileImage');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user can view this course
    const isOwner = course.teacher._id.toString() === req.user._id.toString();
    const isEnrolled = course.enrolledStudents.some(
      e => e.student._id.toString() === req.user._id.toString()
    );

    if (course.status !== 'published' && !isOwner && req.user.role !== 'admin') {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Add user-specific info
    const courseData = {
      ...course.toObject(),
      isOwner,
      isEnrolled,
      canEnroll: !isOwner && !isEnrolled && course.status === 'published'
    };

    res.json({
      success: true,
      course: courseData
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create course (Teacher only)
router.post('/', requireTeacher, [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('category').isIn(['programming', 'design', 'business', 'science', 'language', 'other']).withMessage('Invalid category'),
  body('level').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid level'),
  body('duration').isInt({ min: 1, max: 1000 }).withMessage('Duration must be 1-1000 hours'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be non-negative')
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

    const courseData = {
      ...req.body,
      teacher: req.user._id,
      status: 'draft'
    };

    const course = new Course(courseData);
    await course.save();

    // Add course to teacher's createdCourses
    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdCourses: course._id }
    });

    await course.populate('teacher', 'name email');

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update course (Teacher only - owner)
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid course ID'),
  requireCourseOwner,
  body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('category').optional().isIn(['programming', 'design', 'business', 'science', 'language', 'other']).withMessage('Invalid category'),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid level'),
  body('duration').optional().isInt({ min: 1, max: 1000 }).withMessage('Duration must be 1-1000 hours'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be non-negative'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status')
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

    const updates = req.body;
    Object.assign(req.course, updates);
    await req.course.save();

    await req.course.populate('teacher', 'name email');

    res.json({
      success: true,
      message: 'Course updated successfully',
      course: req.course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete course (Teacher only - owner)
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid course ID'),
  requireCourseOwner
], async (req, res) => {
  try {
    // Remove course from all enrolled students
    await User.updateMany(
      { enrolledCourses: req.course._id },
      { $pull: { enrolledCourses: req.course._id } }
    );

    // Remove course from teacher's createdCourses
    await User.findByIdAndUpdate(req.course.teacher, {
      $pull: { createdCourses: req.course._id }
    });

    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Enroll in course (Student only)
router.post('/:id/enroll', [
  param('id').isMongoId().withMessage('Invalid course ID'),
  requireStudent
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

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Course is not available for enrollment'
      });
    }

    // Check if already enrolled
    const isEnrolled = course.enrolledStudents.some(
      e => e.student.toString() === req.user._id.toString()
    );

    if (isEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Add student to course
    course.enrolledStudents.push({
      student: req.user._id,
      enrolledAt: new Date(),
      progress: 0
    });

    await course.save();

    // Add course to student's enrolledCourses
    await User.findByIdAndUpdate(req.user._id, {
      $push: { enrolledCourses: course._id }
    });

    res.json({
      success: true,
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Unenroll from course (Student only)
router.post('/:id/unenroll', [
  param('id').isMongoId().withMessage('Invalid course ID'),
  requireStudent
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

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Remove student from course
    course.enrolledStudents = course.enrolledStudents.filter(
      e => e.student.toString() !== req.user._id.toString()
    );

    await course.save();

    // Remove course from student's enrolledCourses
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { enrolledCourses: course._id }
    });

    res.json({
      success: true,
      message: 'Successfully unenrolled from course'
    });
  } catch (error) {
    console.error('Unenroll course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

