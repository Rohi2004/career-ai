const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true, // One resume per user
    },
    personalInfo: {
      firstName: String,
      lastName: String,
      title: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      portfolio: String,
    },
    summary: { type: String },
    experience: [
      {
        title: String,
        company: String,
        location: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        description: String,
      }
    ],
    education: [
      {
        degree: String,
        institution: String,
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        grade: String,
        description: String,
      }
    ],
    skills: [
      {
        name: String,
        category: String, // Technical, Soft, Tools
      }
    ],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
        githubUrl: String,
        liveUrl: String,
        startDate: Date,
        endDate: Date,
      }
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', resumeSchema);
