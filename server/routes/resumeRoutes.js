const express = require('express');
const router = express.Router();
const {
  getMyResume,
  createResume,
  updateMyResume,
  deleteMyResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/me')
  .get(protect, getMyResume)
  .put(protect, updateMyResume)
  .delete(protect, deleteMyResume);

router.route('/')
  .post(protect, createResume);

module.exports = router;
