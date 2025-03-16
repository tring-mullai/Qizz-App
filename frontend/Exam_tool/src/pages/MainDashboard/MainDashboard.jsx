import React from 'react';
import './MainDashboard.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

const MainDashboard = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'auto' }}>

      <Sidebar />


      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainDashboard;
