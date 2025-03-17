

import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';


const Home = () => {
  return (
    <div>
      

      <div className='home_background'>

        <div className='opacity_background_image'>

          <div className='content'>
            <h1 className='section_content'>Welcome to Proctored Exam Tool</h1>
            <p className='section_subtext'>
              A secure and efficient platform for creating, taking, and managing exams with real-time proctoring.
            </p>

            <div className='home-btn'>
              <Link to="/login">
                <button className='home-btn-user'>Get Started</button>
              </Link>
            </div>

          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Home;
