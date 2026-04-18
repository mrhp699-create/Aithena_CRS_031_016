const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  title: {
    type: String,
    required: [true, 'Lecture title is required'],
    trim: true,
    maxlength: [100, 'Title must be less than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description must be less than 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Lecture content is required']
  },
  ttsText: {
    type: String,
    default: '' // Text that will be converted to speech
  },
  order: {
    type: Number,
    required: [true, 'Lecture order is required'],
    min: 1
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  resources: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'video', 'image', 'link', 'document']
    }
  }],
  isPreview: {
    type: Boolean,
    default: false // If true, students can view without enrollment
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  lastViewedBy: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
lectureSchema.index({ course: 1, order: 1 });
lectureSchema.index({ status: 1 });

// Virtual for formatted duration
lectureSchema.virtual('formattedDuration').get(function() {
  if (this.duration < 60) {
    return `${this.duration} min`;
  }
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
});

// Static method to get lectures by course
lectureSchema.statics.getLecturesByCourse = function(courseId, includePreview = false) {
  const query = { course: courseId };
  if (!includePreview) {
    query.status = 'published';
  }
  return this.find(query).sort({ order: 1 });
};

// Method to mark as viewed by student
lectureSchema.methods.markAsViewed = function(studentId) {
  const existingView = this.lastViewedBy.find(view => view.student.toString() === studentId.toString());

  if (existingView) {
    existingView.viewedAt = new Date();
  } else {
    this.lastViewedBy.push({ student: studentId });
    this.views += 1;
  }

  return this.save();
};

module.exports = mongoose.model('Lecture', lectureSchema);

