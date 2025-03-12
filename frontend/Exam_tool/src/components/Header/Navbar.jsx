import React from 'react'
import './Navbar.css'
// import header_logo from '../../../assets/header_logo.jpg'
import header_logo from '../../assets/header_logo.jpg'
import { Link } from 'react-router-dom'


const Navbar = () => {
  return (
    <div className='header'>
      <img src={header_logo} alt='not_displayed' className='header_logo'/>
      <ul className='header_buttons'>
        <li><Link to="/login" className='head-btn'>Login</Link></li>
        <li><Link to="/signup" className='head-btn'>Sign Up</Link></li>
      </ul>
    </div>
  )
}

export default Navbar
