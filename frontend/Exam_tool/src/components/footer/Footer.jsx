import React from 'react'
import './Footer.css'
import Footer_img from '../../assets/home_images/footer_img.png'
import address from '../../assets/home_images/address.png'
import email from '../../assets/home_images/email.png'
import phone_no from '../../assets/home_images/phone_no.png'
import facebook from '../../assets/home_images/facebook_sc.png'
import twitter from '../../assets/home_images/twitter.png'
import Linked_In from '../../assets/home_images/Linked_In.png'
import pininterest from '../../assets/home_images/pininterest.png'

const Footer = () => {
  return (
    <div className='d-flex flex-row footer'>
       <div>
        <img src={Footer_img} alt='QuizMaster logo' className='footer_img'/>
       </div>
       <div className='section_1'>
           <h5 className='h5'>Navigation</h5>
           <p className='list'>Home</p>
           <p className='list'>Features</p>
           <p className='list'>Pricing</p>
           <p className='list'>Testimonials</p>
           <p className='list'>Contact</p>
       </div>

       <div className='section_2'>
        <h5 className='h5'>Contacts</h5>

        <div className='d-flex flex-row '>
          <div>
              <img src={address} alt='Address icon' className='address'/>
          </div>

          <div>
            <p className='address_1'>123 Education Avenue</p>
            <p className='address_2'>Learning City, ED 54321</p>
          </div>
        </div>

        <div className='d-flex flex-row'>
          <div>
              <img src={phone_no} alt='Phone icon' className='phone_no'/>
          </div>
          <p>555.123.4567</p>
        </div>

        <div className='d-flex flex-row'>
          <div>
              <img src={email} alt='Email icon' className='email'/>
          </div>
          <p>support@quizmaster.edu</p>
        </div>
       </div>

       <div className='section_3'>
        <h5 className='h5'>Social Media</h5>
        <div className='d-flex flex-row social_media'>
            <img src={facebook} alt='Facebook icon' className='facebook'/>
            <img src={twitter} alt='Twitter icon' className='twitter'/>
            <img src={Linked_In} alt='LinkedIn icon' className='linkedin'/>
            <img src={pininterest} alt='Pinterest icon' className='pininterest'/>
        </div>
       </div>
    </div>
  )
}

export default Footer
