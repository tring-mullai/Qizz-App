import React from 'react'

import Frame_img from '../../assets/home_images/Frame_img.png'
// import Arrow_1 from '../../assets/arrow_1.png'
import { Container } from 'react-bootstrap';
import './Frame.css'

const Frame = () => {
  return (
    <div className='d-flex frame'>
      <Container className='d-flex justify-content-center align-items-center vh-100'>
        <div>
          <div className='d-flex flex-column frame_name'>
            <h1 className='project'>EDUCATIONAL</h1>
            <h1 className='lorum'>QuizMaster</h1>
          </div>
          {/* <div>
              <img src={Arrow_1} alt='not_displayed' className='arrow_1'/>
          </div> */}
        </div>
      
        <div className='frame_img'>
          <img src={Frame_img} alt='Quiz app interface' className='frame_img' />
        </div>
      </Container>
    </div>
  )
}

export default Frame
