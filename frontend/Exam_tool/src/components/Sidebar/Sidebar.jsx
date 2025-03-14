import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardProvider';
import './Sidebar.css';

const Sidebar = () => {
  const { handleLogout } = useDashboard();
  

  return (
    <CDBSidebar textColor="#fff" backgroundColor="#333">
      <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
        <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
          QUIZZ-TIME
        </a>
      </CDBSidebarHeader>

      <CDBSidebarContent className="sidebar-content">
        <CDBSidebarMenu>
          <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column' }}>
            <NavLink to="/dashboard">
              <CDBSidebarMenuItem icon="columns" style={{ color: '#fff' }} className="sidebar-item">
                Home
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/dashboard/list-exams">
              <CDBSidebarMenuItem icon="table" style={{ color: '#fff' }} className="sidebar-item">
                Attend Quizz
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/dashboard/create-exam">
              <CDBSidebarMenuItem icon="user" style={{ color: '#fff' }} className="sidebar-item">
                Create Exams
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/dashboard/scores">
              <CDBSidebarMenuItem icon="chart-line" style={{ color: '#fff' }} className="sidebar-item">
                Scores
              </CDBSidebarMenuItem>
            </NavLink>
          </ul>
        </CDBSidebarMenu>
      </CDBSidebarContent>

      <CDBSidebarFooter style={{ textAlign: 'center' }} onClick={handleLogout} className="sidebar-item">
        <div style={{ padding: '20px 5px', cursor: 'pointer' }}>
          Logout
        </div>
      </CDBSidebarFooter>
    </CDBSidebar>
  );
};

export default Sidebar;