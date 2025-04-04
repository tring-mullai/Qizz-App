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
import { useAuth } from '../../context/DashboardProvider';
import './Sidebar.css';

const Sidebar = () => {
    const {currentUser, logout } = useAuth();
    const role = currentUser?.role
    

    return (
        <CDBSidebar textColor="#fff" className='sidebar' >
            <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                <h1 className="text-decoration-none logo-name" style={{ color: 'inherit', fontSize: '22px', fontStyle: 'italic' }}>
                    QUIZZ
                </h1>
            </CDBSidebarHeader>

            <CDBSidebarContent className="sidebar-content">
                <CDBSidebarMenu>
                    <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column' }}>
                        <NavLink to="/dashboard">
                            <CDBSidebarMenuItem icon="columns" className='sidebar-label'>
                                Home
                            </CDBSidebarMenuItem>
                        </NavLink>
                       
                        {role === "student" && (
                            <NavLink to="/dashboard/list-exams">
                                <CDBSidebarMenuItem icon="table" className='sidebar-label'>
                                    Attend Quiz
                                </CDBSidebarMenuItem>
                            </NavLink>
                        
                        )}
                         {role === 'admin' && (
                            <>
                                <NavLink to="/dashboard/create-exam">
                                    <CDBSidebarMenuItem icon="user" className='sidebar-label'>
                                        Create Quiz
                                    </CDBSidebarMenuItem>
                                </NavLink>
                                
                                <NavLink to="/dashboard/exam-attendees">
                                    <CDBSidebarMenuItem icon="users" className='sidebar-label'>
                                        Exam Results
                                    </CDBSidebarMenuItem>
                                </NavLink>
                                </>
                         )}        
                        
                        {role === "student" &&(
                            <NavLink to="/dashboard/scores">
                                <CDBSidebarMenuItem icon="chart-line" className='sidebar-label'>
                                    Scores
                                </CDBSidebarMenuItem>
                            </NavLink>
                        )}         
                    </ul>
                </CDBSidebarMenu>
            </CDBSidebarContent>


            <CDBSidebarFooter style={{ textAlign: 'center' }} onClick={logout} className="sidebar-footer">
                <div style={{ margin: "20px", cursor: 'pointer' }}>
                    Logout
                </div>
            </CDBSidebarFooter>
        </CDBSidebar>
    );
};

export default Sidebar;