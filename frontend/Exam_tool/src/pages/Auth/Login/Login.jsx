import React, { useState } from 'react'
import { Container, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import login_img from '../../../assets/login_background.png'
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css'


const schema = yup.object().shape(
  {
    email: yup.string().required("Email is required"),
    // .email("Invalid email Format").required("Email is required"),
    password: yup.string()
    // .required('password is required')
    // .min(6,"length must be of 6").matches(/[0-9]/,"password must contain atleast one number").required('password is required')
  }
);


const Login = () => {
  const navigate = useNavigate();
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(<FaEyeSlash />);

  const handleToggle = () => {
    if (type === 'password') {
      setIcon(<FaEye />);
      setType('text');
    } else {
      setIcon(<FaEyeSlash />);
      setType('password');
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const res = await fetch("https://n3q3bv9g-5000.inc1.devtunnels.ms/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (res.ok) {
        localStorage.setItem("token", responseData.token);
        toast.success("Login successful!");
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className='d-flex flex-row '>
      <div>
        <img src={login_img} alt='not displayed' style={{ height: '100vh', width: '90%' }} />
      </div>
      <div>
        <Container className='d-flex justify-content-center align-items-center vh-100'>
          <Card className='p-4 shadow' style={{ width: '400px' }}>
            <h3 className='text-center mb-3'>Login</h3>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className='mb-3'>
                <Form.Label>Email <sup className='text-danger'>*</sup></Form.Label>
                <Form.Control type='email' {...register("email")} placeholder='Enter email' />
                {errors.email && <small className='text-danger'>{errors.email.message}</small>}
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>Password <sup className='text-danger'>*</sup></Form.Label>
                <InputGroup>
                  <Form.Control
                    type={type}
                    {...register('password')}
                    placeholder='Enter password'
                  />
                  <InputGroup.Text onClick={handleToggle} style={{ cursor: 'pointer' }}>
                    {icon}
                  </InputGroup.Text>
                </InputGroup>
                {errors.password && <small className='text-danger'>{errors.password.message}</small>}
              </Form.Group>
              <Button type='submit'  className='w-100 btn-lg submit-button'>Submit</Button>
            </Form>
            <p className='text-center mt-3'>Don't have an account?</p>
            <Link to="/signup" style={{ display: "inline", marginLeft: "120px", width: "100px" }} >
              <Button type='button' variant='secondary' style={{ width: "100px" }}>Sign Up</Button>
            </Link>
          </Card>
          <ToastContainer position='top-right' autoClose={3000} />
        </Container>
      </div>
    </div>
  );
};

export default Login;


