const { improveSummary, calculateJobMatch } = require('../services/aiService');

// @desc    Improve professional summary
// @route   POST /api/ai/improve-summary
// @access  Private
const improveResumeSummary = async (req, res, next) => {
  try {
    const { currentSummary, skills, experience } = req.body;

    if (!currentSummary && !skills && !experience) {
      res.status(400);
      throw new Error('Please provide at least some current summary, skills, or experience to improve.');
    }

    const aiResult = await improveSummary(currentSummary, skills, experience);

    res.status(200).json({
      success: true,
      data: aiResult
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze resume against job description
// @route   POST /api/ai/job-match
// @access  Private
const getJobMatch = async (req, res, next) => {
  try {
    const { resumeData, jobDescription, requiredSkills } = req.body;

    if (!resumeData || !jobDescription) {
      res.status(400);
      throw new Error('Both Resume Data and Job Description are required for match analysis.');
    }

    const matchResult = await calculateJobMatch(resumeData, jobDescription, requiredSkills);

    res.status(200).json({
      success: true,
      data: matchResult
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  improveResumeSummary,
  getJobMatch
};
