import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home/Home';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import ProtectedRoute from './ProtectedRoute';
import MainDashboard from '../pages/MainDashboard/Main_Dashboard'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route 
        path="/main_dashboard/*" 
        element={
          <ProtectedRoute>
            <MainDashboard /> 
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
