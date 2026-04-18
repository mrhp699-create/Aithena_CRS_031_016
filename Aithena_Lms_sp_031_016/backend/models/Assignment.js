const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true,
    maxlength: [100, 'Title must be less than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Assignment description is required'],
    maxlength: [1000, 'Description must be less than 1000 characters']
  },
  instructions: {
    type: String,
    maxlength: [2000, 'Instructions must be less than 2000 characters']
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  maxPoints: {
    type: Number,
    required: [true, 'Maximum points is required'],
    min: 1,
    max: 100
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    files: [{
      name: String,
      url: String,
      type: String
    }],
    grade: {
      type: Number,
      min: 0,
      max: 100
    },
    feedback: {
      type: String,
      maxlength: [500, 'Feedback must be less than 500 characters']
    },
    gradedAt: Date,
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'late'],
      default: 'submitted'
    }
  }],
  allowLateSubmission: {
    type: Boolean,
    default: false
  },
  latePenalty: {
    type: Number, // percentage
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
assignmentSchema.index({ course: 1 });
assignmentSchema.index({ deadline: 1 });
assignmentSchema.index({ status: 1 });

// Virtual for submission count
assignmentSchema.virtual('submissionCount').get(function() {
  return this.submissions.length;
});

// Virtual for average grade
assignmentSchema.virtual('averageGrade').get(function() {
  const gradedSubmissions = this.submissions.filter(sub => sub.grade !== undefined);
  if (gradedSubmissions.length === 0) return 0;

  const totalGrade = gradedSubmissions.reduce((sum, sub) => sum + sub.grade, 0);
  return Math.round((totalGrade / gradedSubmissions.length) * 100) / 100;
});

// Virtual for on-time submissions
assignmentSchema.virtual('onTimeSubmissions').get(function() {
  return this.submissions.filter(sub =>
    sub.status !== 'late' && new Date(sub.submittedAt) <= new Date(this.deadline)
  ).length;
});

// Method to check if submission is late
assignmentSchema.methods.isLateSubmission = function(submissionDate) {
  return new Date(submissionDate) > new Date(this.deadline);
};

// Method to calculate late penalty
assignmentSchema.methods.calculateLatePenalty = function(submissionDate) {
  if (!this.allowLateSubmission || !this.isLateSubmission(submissionDate)) {
    return 0;
  }

  // Simple late penalty calculation (could be made more complex)
  const daysLate = Math.ceil((new Date(submissionDate) - new Date(this.deadline)) / (1000 * 60 * 60 * 24));
  return Math.min(this.latePenalty * daysLate, 100); // Max 100% penalty
};

// Static method to get assignments by course
assignmentSchema.statics.getAssignmentsByCourse = function(courseId) {
  return this.find({ course: courseId })
    .populate('submissions.student', 'name email')
    .populate('submissions.gradedBy', 'name')
    .sort({ deadline: 1 });
};

module.exports = mongoose.model('Assignment', assignmentSchema);

