const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Lecture = require('../models/Lecture');
const Course = require('../models/Course');
const { authenticate, requireCourseOwner, requireEnrollment } = require('../middlewares/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Get lectures for a course
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

    const { courseId } = req.params;
    const { includePreview = false } = req.query;

    const lectures = await Lecture.getLecturesByCourse(courseId, includePreview)
      .sort({ order: 1 });

    res.json({
      success: true,
      lectures
    });
  } catch (error) {
    console.error('Get lectures error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single lecture
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid lecture ID')
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

    const lecture = await Lecture.findById(req.params.id)
      .populate('course', 'title teacher status');

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Check permissions
    const isOwner = lecture.course.teacher.toString() === req.user._id.toString();
    const isEnrolled = await Course.findOne({
      _id: lecture.course._id,
      'enrolledStudents.student': req.user._id
    });

    if (!isOwner && !isEnrolled && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Mark as viewed if student
    if (isEnrolled && req.user.role === 'student') {
      await lecture.markAsViewed(req.user._id);
    }

    res.json({
      success: true,
      lecture
    });
  } catch (error) {
    console.error('Get lecture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create lecture (Teacher only - course owner)
router.post('/', [
  body('course').isMongoId().withMessage('Invalid course ID'),
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content is required'),
  body('order').isInt({ min: 1 }).withMessage('Order must be a positive integer'),
  body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be positive'),
  body('ttsText').optional().trim().isLength({ max: 5000 }).withMessage('TTS text too long')
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

    const { course, title, content, order, duration, ttsText, isPreview } = req.body;

    // Check if order already exists for this course
    const existingLecture = await Lecture.findOne({ course, order });
    if (existingLecture) {
      return res.status(400).json({
        success: false,
        message: 'A lecture with this order already exists'
      });
    }

    const lecture = new Lecture({
      course,
      title,
      content,
      order,
      duration,
      ttsText: ttsText || content.substring(0, 5000), // Use content as TTS text if not provided
      isPreview: isPreview || false
    });

    await lecture.save();

    // Update course lecture count
    await Course.findByIdAndUpdate(course, { $inc: { totalLectures: 1 } });

    res.status(201).json({
      success: true,
      message: 'Lecture created successfully',
      lecture
    });
  } catch (error) {
    console.error('Create lecture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update lecture (Teacher only - course owner)
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid lecture ID'),
  body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('content').optional().trim().isLength({ min: 10 }).withMessage('Content is required'),
  body('order').optional().isInt({ min: 1 }).withMessage('Order must be a positive integer'),
  body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be positive'),
  body('ttsText').optional().trim().isLength({ max: 5000 }).withMessage('TTS text too long'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Invalid status')
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

    const lecture = await Lecture.findById(req.params.id).populate('course', 'teacher');
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Check ownership
    if (lecture.course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if new order conflicts (if order is being changed)
    if (req.body.order && req.body.order !== lecture.order) {
      const existingLecture = await Lecture.findOne({
        course: lecture.course._id,
        order: req.body.order,
        _id: { $ne: lecture._id }
      });
      if (existingLecture) {
        return res.status(400).json({
          success: false,
          message: 'A lecture with this order already exists'
        });
      }
    }

    Object.assign(lecture, req.body);
    await lecture.save();

    res.json({
      success: true,
      message: 'Lecture updated successfully',
      lecture
    });
  } catch (error) {
    console.error('Update lecture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete lecture (Teacher only - course owner)
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid lecture ID')
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

    const lecture = await Lecture.findById(req.params.id).populate('course', 'teacher');
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Check ownership
    if (lecture.course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update course lecture count
    await Course.findByIdAndUpdate(lecture.course._id, { $inc: { totalLectures: -1 } });

    await Lecture.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Lecture deleted successfully'
    });
  } catch (error) {
    console.error('Delete lecture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Reorder lectures (Teacher only - course owner)
router.put('/course/:courseId/reorder', [
  param('courseId').isMongoId().withMessage('Invalid course ID'),
  body('lectures').isArray().withMessage('Lectures array is required'),
  body('lectures.*.id').isMongoId().withMessage('Invalid lecture ID'),
  body('lectures.*.order').isInt({ min: 1 }).withMessage('Order must be positive')
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

    const { courseId } = req.params;
    const { lectures } = req.body;

    // Update all lectures in batch
    const updatePromises = lectures.map(({ id, order }) =>
      Lecture.findByIdAndUpdate(id, { order })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Lectures reordered successfully'
    });
  } catch (error) {
    console.error('Reorder lectures error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

