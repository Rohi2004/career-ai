const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    jobType: { type: String, default: 'Full-time' },
    experienceLevel: { type: String },
    salaryRange: { type: String },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    requiredSkills: [{ type: String }],
    preferredSkills: [{ type: String }],
    qualifications: [{ type: String }],
    applicationDeadline: { type: Date },
    status: {
      type: String,
      enum: ['Active', 'Closed', 'Draft'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
