const pool = require('../DB/db');

const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM auth_user WHERE email = $1', [email]);
  return result.rows[0];
};

const createUser = async (name, email, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO auth_user (name, email, password) VALUES ($1, $2, $3) RETURNING *',
    [name, email, hashedPassword]
  );
  return result.rows[0];
};

module.exports = { getUserByEmail, createUser };