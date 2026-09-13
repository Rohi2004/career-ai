const express = require('express');
const router = express.Router();
const {
  improveResumeSummary,
  getJobMatch
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.route('/improve-summary')
  .post(protect, improveResumeSummary);

router.route('/job-match')
  .post(protect, getJobMatch);

module.exports = router;
