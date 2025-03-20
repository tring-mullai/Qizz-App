const express = require('express');
const { submitScore, getScores } = require('../DB/controllers/scoreController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/scores', authMiddleware, submitScore);
router.get('/scores', authMiddleware, getScores);

module.exports = router;