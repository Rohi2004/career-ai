const Resume = require('../models/Resume');

// @desc    Get user's resume
// @route   GET /api/resumes/me
// @access  Private
const getMyResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ user_id: req.user.id });

    if (!resume) {
      // Return 200 with null or empty object so the frontend knows to create one
      return res.status(200).json({ success: true, data: null });
    }

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a resume
// @route   POST /api/resumes
// @access  Private
const createResume = async (req, res, next) => {
  try {
    // Check if user already has a resume
    const existingResume = await Resume.findOne({ user_id: req.user.id });

    if (existingResume) {
      res.status(400);
      throw new Error('Resume already exists for this user. Use PUT to update.');
    }

    const resume = await Resume.create({
      user_id: req.user.id,
      personalInfo: req.body.personalInfo || {},
      summary: req.body.summary || '',
      education: req.body.education || [],
      experience: req.body.experience || [],
      skills: req.body.skills || [],
      projects: req.body.projects || [],
    });

    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user's resume
// @route   PUT /api/resumes/me
// @access  Private
const updateMyResume = async (req, res, next) => {
  try {
    let resume = await Resume.findOne({ user_id: req.user.id });

    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    // Update fields
    resume = await Resume.findOneAndUpdate(
      { user_id: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user's resume
// @route   DELETE /api/resumes/me
// @access  Private
const deleteMyResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ user_id: req.user.id });

    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    await resume.remove();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyResume,
  createResume,
  updateMyResume,
  deleteMyResume,
};
