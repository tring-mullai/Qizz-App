const { getExams, getExamsByUser, createExam, updateExam, deleteExam, getExamAttendees } = require('../models/examModel');

const getAllExams = async (req, res) => {
  try {
    const exams = await getExams();
    res.json({ success: true, data: exams });
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getMyExams = async (req, res) => {
  const userId = req.user.id;
  try {
    const exams = await getExamsByUser(userId);
    res.json({ success: true, data: exams });
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createNewExam = async (req, res) => {
  const { title, description, duration, questions } = req.body;
  const userId = req.user.id;

  try {
    const newExam = await createExam(title, description, duration, questions, userId);
    res.json({ success: true, data: newExam });
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateExistingExam = async (req, res) => {
  const examId = req.params.id;
  const userId = req.user.id;
  const { title, description, duration, questions } = req.body;

  try {
    const updatedExam = await updateExam(examId, title, description, duration, questions, userId);
    res.json({ success: true, data: updatedExam });
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteExistingExam = async (req, res) => {
  const examId = req.params.id;
  const userId = req.user.id;

  try {
    await deleteExam(examId, userId);
    res.json({ success: true, message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getExamAttendeesData = async (req, res) => {
  const examId = req.params.examId;

  try {
    const attendees = await getExamAttendees(examId);
    const formattedAttendees = attendees.map(attendee => {
      // Parse user_answers and exam_questions if they are strings
      const userAnswers = typeof attendee.user_answers === 'string' 
        ? JSON.parse(attendee.user_answers) 
        : attendee.user_answers;

      const examQuestions = typeof attendee.exam_questions === 'string' 
        ? JSON.parse(attendee.exam_questions) 
        : attendee.exam_questions;

      return {
        ...attendee,
        user_answers: userAnswers,
        exam_questions: examQuestions
      };
    });

    res.json({ success: true, data: formattedAttendees });
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAllExams,
  getMyExams,
  createNewExam,
  updateExistingExam,
  deleteExistingExam,
  getExamAttendeesData
};