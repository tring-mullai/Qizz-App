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
        <CDBSidebar textColor="#fff" className='sidebar' >
            <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                <h1 className="text-decoration-none logo-name" style={{ color: 'inherit' ,fontSize:'22px',fontStyle:'italic' }}>
                    QUIZZ
                </h1>
            </CDBSidebarHeader>

            <CDBSidebarContent className="sidebar-content">
                <CDBSidebarMenu >
                    <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column' } } >
                        
                        <NavLink to="/dashboard" >
                            <CDBSidebarMenuItem icon="columns"  className='sidebar-label'>
                                Home
                            </CDBSidebarMenuItem>
                        </NavLink>
                       
                        
                        <NavLink to="/dashboard/list-exams">
                            <CDBSidebarMenuItem icon="table"  className='sidebar-label'>
                                Attend Quizz
                            </CDBSidebarMenuItem>
                        </NavLink>
                        
                        <NavLink to="/dashboard/create-exam">
                            <CDBSidebarMenuItem icon="user"  className='sidebar-label' >
                                Create Quizz
                            </CDBSidebarMenuItem>
                        </NavLink>
                        
                        <NavLink to="/dashboard/scores">
                            <CDBSidebarMenuItem icon="chart-line" className='sidebar-label' >
                                Scores
                            </CDBSidebarMenuItem>
                        </NavLink>
                        
                    </ul>
                </CDBSidebarMenu>
            </CDBSidebarContent>

            <CDBSidebarFooter style={{ textAlign: 'center' }} onClick={handleLogout} className="sidebar-footer">
                <div style={{ margin:"20px", cursor: 'pointer' }}>
                    Logout
                </div>
            </CDBSidebarFooter>
        </CDBSidebar>
    );
};

export default Sidebar;