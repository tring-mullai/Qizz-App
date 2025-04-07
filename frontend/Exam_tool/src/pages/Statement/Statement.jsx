import React from 'react'
import './Statement.css'
import Statement_image_1 from '../../assets/home_images/Statement_img_1.png'
import Statement_image_2 from '../../assets/home_images/Statement_img_2.png'

const Statement = () => {
  return (
    <div className='section_statement'>
      <div className='main_content'>
        <h2>Main Focus / Mission Statement</h2>
      </div>

      <div className='d-flex flex-row statement_content'>
        <div className='statement_image1'>
            <img src={Statement_image_1} alt='Teacher creating exam' />
        </div>
         
        <div className='statement_content_1'>
            <p>Empowering educators with intuitive tools to create customized assessments that accurately measure student knowledge and progress.</p>
        </div>

        <div className='statement_image2'>
            <img src={Statement_image_2} alt='Student taking quiz'/>
        </div>

        <div className='statement_content_2'>
            <p>Providing students with a user-friendly platform to demonstrate their understanding, receive immediate feedback, and track their educational growth through comprehensive performance analytics.</p>
        </div>
      </div>
    </div>
  )
}

export default Statement