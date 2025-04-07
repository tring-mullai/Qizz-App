import React from 'react'
import './Projects.css'
import Project_img_2 from '../../assets/home_images/projects_img_2.png'
import Project_img_3 from '../../assets/home_images/projects_img_3.png'
import Project_img_4 from '../../assets/home_images/projects_img_4.png'
import Project_img_5 from '../../assets/home_images/projects_img_5.png'

import { Container } from 'react-bootstrap'

const Projects = () => {
  return (
    <div className='section_projects'>
      <div className='project_heading'>
        <h1>Our Features</h1>
      </div>

      <div className='d-flex flex-row projects_images'>
        <div className='overlay'>
          <div>
            <div className='sample_project'>
                <h1>Exam Creation</h1>
            </div>

            <div className='view_more'>
                <h5>VIEW MORE</h5>
            </div>
          </div>
        </div>

        <div className='projects_image_2'> 
            <img src={Project_img_2} alt='Exam creation interface' className='projects_image_2'/>
        </div>
      </div>

      <div className='d-flex flex-row project_images_1'>
        <div>
            <img src={Project_img_3} alt='Quiz taking interface' className='projects_img_3'/>
        </div>
        <div>
            <img src={Project_img_4} alt='Results dashboard' className='projects_img_4'/>
        </div>
        <div>
            <img src={Project_img_5} alt='Analytics view' className='projects_img_5'/>
        </div>
      </div>
    </div>
  )
}

export default Projects
