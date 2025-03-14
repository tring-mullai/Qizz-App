const { submitScore: submitScoreModel, getScoresByUser } = require('../models/scoreModel');

const submitScore = async (req, res) => {
  const { examId, score, answers, examTitle } = req.body;
  const userId = req.user.id;

  if(!answers || typeof answers != "object")
  {
    return res.status(400).json({success:false,message:"Invalid answers format"});
  }

  try {
    

    const newScore = await submitScoreModel(userId, examId, examTitle, score, answers);
    res.json({ success: true, data: newScore });
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getScores = async (req, res) => {
  const userId = req.user.id;

  try {
    const scores = await getScoresByUser(userId);
    res.json({ success: true, data: scores });
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { submitScore, getScores };