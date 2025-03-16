import React from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Header/Navbar'


const Home = () => {
  return (
    <div>

      {/* <Navbar /> */}

      <div className='home_background' >

        <div className='opacity_background_image'>

          <div className='content'>
            <h1 className='section_content'>Welcome to our Proctored Exam tool</h1>

            <div className='home-btn'>
              <Link to="/Signup"><button className='home-btn-user'>Get Started</button></Link>
            </div>

          </div>

        </div>
      </div>


    </div>
  )
}

export default Home
