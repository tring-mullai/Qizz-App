require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const scoreRoutes = require('./routes/scoreRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/scores', scoreRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));