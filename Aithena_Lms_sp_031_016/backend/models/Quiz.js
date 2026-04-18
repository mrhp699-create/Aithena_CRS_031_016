const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required']
  },
  options: [{
    type: String,
    required: [true, 'Options are required'],
    validate: {
      validator: function(options) {
        return options.length >= 2 && options.length <= 6;
      },
      message: 'Questions must have between 2 and 6 options'
    }
  }],
  correctAnswer: {
    type: Number, // Index of correct option (0-based)
    required: [true, 'Correct answer is required'],
    validate: {
      validator: function(value) {
        return value >= 0 && value < this.options.length;
      },
      message: 'Correct answer index must be valid'
    }
  },
  points: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  explanation: {
    type: String,
    maxlength: [300, 'Explanation must be less than 300 characters']
  }
});

const quizSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
    maxlength: [100, 'Title must be less than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description must be less than 500 characters']
  },
  questions: [questionSchema],
  timeLimit: {
    type: Number, // in minutes, 0 means no limit
    default: 0,
    min: 0
  },
  passingScore: {
    type: Number, // percentage
    default: 60,
    min: 0,
    max: 100
  },
  maxAttempts: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  shuffleQuestions: {
    type: Boolean,
    default: false
  },
  shuffleOptions: {
    type: Boolean,
    default: false
  },
  showResults: {
    type: Boolean,
    default: true
  },
  attempts: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    attemptNumber: {
      type: Number,
      required: true
    },
    answers: [{
      questionIndex: Number,
      selectedOption: Number,
      isCorrect: Boolean,
      points: Number
    }],
    score: {
      type: Number,
      min: 0
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100
    },
    passed: {
      type: Boolean,
      default: false
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date,
    timeSpent: Number // in minutes
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'closed'],
    default: 'draft'
  },
  totalPoints: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
quizSchema.index({ course: 1 });
quizSchema.index({ status: 1 });

// Pre-save middleware to calculate total points
quizSchema.pre('save', function(next) {
  this.totalPoints = this.questions.reduce((sum, question) => sum + question.points, 0);
  next();
});

// Virtual for total questions
quizSchema.virtual('totalQuestions').get(function() {
  return this.questions.length;
});

// Virtual for average score
quizSchema.virtual('averageScore').get(function() {
  if (this.attempts.length === 0) return 0;
  const totalScore = this.attempts.reduce((sum, attempt) => sum + attempt.score, 0);
  return Math.round((totalScore / this.attempts.length) * 100) / 100;
});

// Virtual for pass rate
quizSchema.virtual('passRate').get(function() {
  if (this.attempts.length === 0) return 0;
  const passedAttempts = this.attempts.filter(attempt => attempt.passed).length;
  return Math.round((passedAttempts / this.attempts.length) * 100);
});

// Method to grade answers
quizSchema.methods.gradeAttempt = function(answers, timeSpent) {
  let totalScore = 0;
  const gradedAnswers = [];

  answers.forEach((answer, index) => {
    const question = this.questions[index];
    const isCorrect = answer.selectedOption === question.correctAnswer;
    const points = isCorrect ? question.points : 0;

    totalScore += points;

    gradedAnswers.push({
      questionIndex: index,
      selectedOption: answer.selectedOption,
      isCorrect,
      points
    });
  });

  const percentage = this.totalPoints > 0 ? (totalScore / this.totalPoints) * 100 : 0;
  const passed = percentage >= this.passingScore;

  return {
    answers: gradedAnswers,
    score: totalScore,
    percentage: Math.round(percentage * 100) / 100,
    passed,
    timeSpent
  };
};

// Method to check if student can attempt quiz
quizSchema.methods.canStudentAttempt = function(studentId) {
  if (this.status !== 'published') return false;

  const studentAttempts = this.attempts.filter(attempt =>
    attempt.student.toString() === studentId.toString()
  );

  return studentAttempts.length < this.maxAttempts;
};

// Static method to get quizzes by course
quizSchema.statics.getQuizzesByCourse = function(courseId) {
  return this.find({ course: courseId })
    .populate('attempts.student', 'name email')
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Quiz', quizSchema);

