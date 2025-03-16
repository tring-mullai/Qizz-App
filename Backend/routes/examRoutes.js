const express = require('express');
const {
  getAllExams,
  getMyExams,
  createNewExam,
  updateExistingExam,
  deleteExistingExam,
  getExamAttendeesData
} = require('../controllers/examController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/exams', authMiddleware, getAllExams);
router.get('/my-exams', authMiddleware, getMyExams);
router.post('/exams', authMiddleware, createNewExam);
router.put('/exams/:id', authMiddleware, updateExistingExam);
router.delete('/exams/:id', authMiddleware, deleteExistingExam);
router.get('/exams/:examId/attendees', authMiddleware, getExamAttendeesData);

module.exports = router;