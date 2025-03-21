const pool = require('../DB/db');

const submitScore = async (userId, examId, examTitle, score, answers) => {

  const answersJson = typeof answers === 'string' ? answers : JSON.stringify(answers);

  const result = await pool.query(
    'INSERT INTO scores (user_id, exam_id, exam_title, score, answers) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, examId, examTitle, score, answersJson]
  );
  return result.rows[0];
};

const getScoresByUser = async (userId) => {
  const result = await pool.query(
    "SELECT s.*, e.title AS exam_title, e.questions FROM scores s JOIN exams e ON s.exam_id = e.id WHERE s.user_id = $1 ORDER BY s.created_at DESC",
    [userId]
);


  const processedResults = result.rows.map(row => {
    return {
      ...row,

      answers: typeof row.answers === 'string' ? JSON.parse(row.answers) : row.answers,

      questions: typeof row.questions === 'string' ? JSON.parse(row.questions) : row.questions
    };
  });

  return processedResults;
};

module.exports = { submitScore, getScoresByUser };