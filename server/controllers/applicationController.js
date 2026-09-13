const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private
const applyForJob = async (req, res, next) => {
  try {
    const { job_id, jobId, coverMessage } = req.body;
    
    const finalJobId = job_id || jobId;

    // Validate job exists
    const job = await Job.findById(finalJobId);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({
      user_id: req.user.id,
      job_id: finalJobId
    });

    if (existingApplication) {
      res.status(400);
      throw new Error('You have already applied for this job');
    }

    const application = await Application.create({
      user_id: req.user.id,
      job_id: finalJobId,
      coverMessage: coverMessage || '',
      status: 'Applied',
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/me
// @access  Private
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user_id: req.user.id })
      .populate('job_id', 'title company location status')
      .sort({ applied_at: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job_id')
      .populate('user_id', 'name email');

    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }

    // Make sure user owns application or is admin
    if (application.user_id._id.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to access this application');
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    let application = await Application.findById(req.params.id);

    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }

    application.status = status;
    await application.save();

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus
};
