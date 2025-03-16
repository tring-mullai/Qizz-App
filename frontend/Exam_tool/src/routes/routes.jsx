import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home'
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import ProtectedRoute from './ProtectedRoute';
import MainDashboard from '../pages/MainDashboard/MainDashboard';
import HomePage from '../pages/HomePage/HomePage';
import ListExams from '../pages/ListExams/ListExams';
import CreateExam from '../pages/CreateExam/CreateExam';
import Scores from '../pages/Scores/Scores';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute> <MainDashboard /> </ProtectedRoute>} >
        <Route path="" element={<HomePage />} />
        <Route path="list-exams" element={<ListExams />} />
        <Route path="create-exam" element={<CreateExam />} />
        <Route path="scores" element={<Scores />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
