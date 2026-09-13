const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Job',
    },
    coverMessage: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    applied_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true, // This will automatically add createdAt (appliedAt) and updatedAt
  }
);

module.exports = mongoose.model('Application', applicationSchema);
