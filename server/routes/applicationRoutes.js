const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, applyForJob);

router.route('/me')
  .get(protect, getMyApplications);

router.route('/:id')
  .get(protect, getApplicationById);

router.route('/:id/status')
  .put(protect, authorize('admin'), updateApplicationStatus);

module.exports = router;
