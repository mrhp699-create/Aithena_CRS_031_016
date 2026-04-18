const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title must be less than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [1000, 'Description must be less than 1000 characters']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher is required']
  },
  enrolledStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['programming', 'design', 'business', 'science', 'language', 'other']
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: {
    type: Number, // in hours
    required: [true, 'Duration is required'],
    min: 1
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  thumbnail: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  totalLectures: {
    type: Number,
    default: 0
  },
  totalAssignments: {
    type: Number,
    default: 0
  },
  totalQuizzes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
courseSchema.index({ teacher: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ title: 'text', description: 'text' }); // Text search

// Virtual for enrollment count
courseSchema.virtual('enrollmentCount').get(function() {
  return this.enrolledStudents.length;
});

// Virtual for average progress
courseSchema.virtual('averageProgress').get(function() {
  if (this.enrolledStudents.length === 0) return 0;
  const totalProgress = this.enrolledStudents.reduce((sum, enrollment) => sum + enrollment.progress, 0);
  return Math.round(totalProgress / this.enrolledStudents.length);
});

// Static method to get courses by teacher
courseSchema.statics.getCoursesByTeacher = function(teacherId) {
  return this.find({ teacher: teacherId }).populate('teacher', 'name email');
};

// Static method to get enrolled courses by student
courseSchema.statics.getEnrolledCourses = function(studentId) {
  return this.find({ 'enrolledStudents.student': studentId })
    .populate('teacher', 'name email')
    .populate('enrolledStudents.student', 'name email');
};

module.exports = mongoose.model('Course', courseSchema);

