const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../DB/db"); 
require("dotenv").config();

const router = express.Router();


const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};


router.post('/signup', async (req, res) => {
  console.log('Signup API called!');
  const { name, email, password } = req.body;
  console.log('Received Data:', req.body);

  try {
    const existingUser = await pool.query('SELECT * FROM auth_user WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      'INSERT INTO auth_user (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query('SELECT * FROM auth_user WHERE email = $1', [email]);
    
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Haven't signed up? Sign up first" });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user.rows[0].id,
        name: user.rows[0].name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      userId: user.rows[0].id,
      name: user.rows[0].name,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get("/exams", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM exams ORDER BY id DESC");
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Database error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


router.get("/my-exams", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    
    try {
        
        const result = await pool.query(
            "SELECT * FROM exams WHERE created_by = $1 ORDER BY id DESC",
            [userId]
        );
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Database error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/exams", authMiddleware, async (req, res) => {
  const { title, description, duration, questions } = req.body;
  const userId = req.user.id;

  
  if (!userId) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  
  const userCheck = await pool.query('SELECT * FROM auth_user WHERE id = $1', [userId]);
  if (userCheck.rows.length === 0) {
      return res.status(400).json({ success: false, message: "User does not exist" });
  }

  
  try {
      const result = await pool.query(
          "INSERT INTO exams (title, description, duration, questions, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [title, description, duration, JSON.stringify(questions), userId]
      );

      res.json({ success: true, data: result.rows[0] });
  } catch (error) {
      console.error("Database error:", error.message);
      res.status(500).json({ success: false, message: "Server error" });
  }
});


router.put("/exams/:id", authMiddleware, async (req, res) => {
    const examId = req.params.id;
    const userId = req.user.id;
    const { title, description, duration, questions } = req.body;
    
    try {
        
        const examCheck = await pool.query(
            "SELECT * FROM exams WHERE id = $1",
            [examId]
        );
        
        if (examCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }
        
        if (examCheck.rows[0].created_by !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized to update this exam" });
        }
        
       
        const result = await pool.query(
            "UPDATE exams SET title = $1, description = $2, duration = $3, questions = $4 WHERE id = $5 RETURNING *",
            [title, description, duration, JSON.stringify(questions), examId]
        );
        
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error("Database error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.delete("/exams/:id", authMiddleware, async (req, res) => {
  const examId = req.params.id;
  const userId = req.user.id;
  
  try {
     
      const examCheck = await pool.query(
          "SELECT * FROM exams WHERE id = $1",
          [examId]
      );
      
      if (examCheck.rows.length === 0) {
          return res.status(404).json({ success: false, message: "Exam not found" });
      }
      
      if (examCheck.rows[0].created_by !== userId) {
          return res.status(403).json({ success: false, message: "Not authorized to delete this exam" });
      }
      
      await pool.query(
          "DELETE FROM scores WHERE exam_id = $1",
          [examId]
      );

      
      await pool.query(
          "DELETE FROM exams WHERE id = $1",
          [examId]
      );
      
      res.json({ success: true, message: "Exam deleted successfully" });
  } catch (error) {
      console.error("Database error:", error.message);
      res.status(500).json({ success: false, message: "Server error" });
  }
});

// Submit exam score
router.post("/scores", authMiddleware, async (req, res) => {
    const { examId, score, answers } = req.body;
    const userId = req.user.id;
    
    try {
       
        const examResult = await pool.query(
            "SELECT title FROM exams WHERE id = $1",
            [examId]
        );
        
        if (examResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }
        
        const examTitle = examResult.rows[0].title;
        
        
        await pool.query(
            "INSERT INTO scores (user_id, exam_id, exam_title, score, answers) VALUES ($1, $2, $3, $4, $5)",
            [userId, examId, examTitle, score, JSON.stringify(answers)]
        );
        
        res.json({ success: true, message: "Score saved successfully" });
    } catch (error) {
        console.error("Database error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


router.get("/scores", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    
    try {
        const result = await pool.query(
            "SELECT * FROM scores WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Database error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;