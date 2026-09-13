const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.route('/')
  .get(getJobs)
  // Admin only routes
  .post(protect, authorize('admin'), createJob);

router.route('/:id')
  // Public
  .get(getJobById)
  // Admin only
  .put(protect, authorize('admin'), updateJob)
  .delete(protect, authorize('admin'), deleteJob);

module.exports = router;
