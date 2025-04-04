import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login/Login';
import Signup from '../pages/Auth/Signup/Signup';
import ProtectedRoute from './ProtectedRoute';
import MainDashboard from '../pages/MainDashboard/MainDashboard';
import HomePage from '../pages/HomePage/HomePage';
import ListExams from '../pages/ListExams/ListExams';
import CreateExam from '../pages/CreateExam/CreateExam';
import ExamAttendeesDetails from '../pages/ExamAttendees/ExamAttendees';
import Scores from '../pages/Scores/Scores';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><MainDashboard /></ProtectedRoute>}>
        <Route index element={<HomePage />} />
        <Route path="list-exams" element={<ListExams />} />
        <Route path="create-exam" element={<CreateExam />} />
        <Route path="exam-attendees" element={<ExamAttendeesDetails/>} />
        <Route path="exam-attendees/:examId" element={<ExamAttendeesDetails />} />
        <Route path="scores" element={<Scores />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
