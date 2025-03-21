const pool = require('../DB/db');

const getExams = async () => {
  const result = await pool.query('SELECT * FROM exams ORDER BY id DESC');
  return result.rows;
};

const getExamsByUser = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM exams WHERE created_by = $1 ORDER BY id DESC',
    [userId]
  );
  return result.rows;
};

const createExam = async (title, description, duration, questions, userId) => {
  const result = await pool.query(
    'INSERT INTO exams (title, description, duration, questions, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, description, duration, JSON.stringify(questions), userId]
  );
  return result.rows[0];
};

const updateExam = async (examId, title, description, duration, questions, userId) => {
  const result = await pool.query(
    'UPDATE exams SET title = $1, description = $2, duration = $3, questions = $4 WHERE id = $5 AND created_by = $6 RETURNING *',
    [title, description, duration, JSON.stringify(questions), examId, userId]
  );
  return result.rows[0];
};

const deleteExam = async (examId, userId) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM scores WHERE exam_id = $1', [examId]);
    const result = await client.query(
      'DELETE FROM exams WHERE id = $1 AND created_by = $2 RETURNING *',
      [examId, userId]
    );
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getExamAttendees = async (examId) => {
  try {
    const result = await pool.query(
      `SELECT 
         s.id AS score_id,
         s.user_id,
         s.score,
         s.answers AS user_answers,
         e.title AS exam_title,
         e.questions AS exam_questions,
         u.name AS user_name,
         u.email AS user_email
       FROM scores s
       JOIN exams e ON s.exam_id = e.id
       JOIN auth_user u ON s.user_id = u.id
       WHERE s.exam_id = $1`,
      [examId]
    );
    console.log('Query Result:', result.rows); 
    return result.rows;
  } catch (error) {
    console.error('Error in getExamAttendees:', error);
    throw error;
  }
};


module.exports = {
  getExams,
  getExamsByUser,
  createExam,
  updateExam,
  deleteExam,
  getExamAttendees
};