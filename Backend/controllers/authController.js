const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByEmail, createUser } = require('../models/userModel'); 
require('dotenv').config();

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const newUser = await createUser(name, email, hashedPassword);

    
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Haven't signed up? Sign up first" });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

   
    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    
    res.json({ token, userId: user.id, name: user.name });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, login };