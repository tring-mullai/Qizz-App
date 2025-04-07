import React from 'react'
import About_image_1 from '../../assets/home_images/About_image_1.png'
import About_image_2 from '../../assets/home_images/About_image_2.png'
import About_image_3 from '../../assets/home_images/About_image_3.png'
import './About.css'

const About = () => {
  return (
    <div className='d-flex flex-row section_about'>
      <div className='d-flex flex-row'>
        <div className='d-flex flex-column image_about_1'>
            <img src={About_image_1} alt='Students taking quiz' className='first'/>
            <img src={About_image_2} alt='Teacher creating exam'/>
        </div>

        <div className='image_about_2'>
            <img src={About_image_3} alt='Student viewing results'/>
        </div>
      </div>

      <div className='d-flex flex-column section_content'>
        <div className='about_name'>
          <h1>ABOUT</h1>
        </div>

        <div className='about_content'>
            <p>QuizMaster is an innovative educational platform designed 
               to streamline the assessment process for both educators 
               and students. Our platform allows administrators to create 
               customized exams with various question types, while students 
               can take these assessments in a user-friendly environment. 
               With instant scoring and detailed performance analytics, 
               QuizMaster transforms the traditional examination experience 
               into an engaging and efficient learning journey.
            </p>
        </div>

        <div className='read_more'>
            <h5>READ MORE</h5>
        </div>
      </div>
    </div>
  )
}

export default About
