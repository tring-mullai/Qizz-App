import React from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Signup_background from '../../assets/signup_background.jpg';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const schema = yup.object().shape({
  name: yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').matches(/[0-9]/, 'Password must contain at least one number').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
});

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      delete data.confirmPassword;
      const res = await fetch('https://n3q3bv9g-5000.inc1.devtunnels.ms/api/route/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      let responseData;
      try {
        responseData = await res.json();
      } catch (error) {
        responseData = { message: 'Unexpected server response' };
      }

      if (res.ok) {
        toast.success('Signup successful!');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        toast.error(responseData.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='d-flex flex-row'>
      <Container className='d-flex justify-content-center align-items-center vh-100'>
        <Card className='p-4 shadow' style={{ width: '500px' }}>
          <h3 className='mb-3 text-center'>Sign Up</h3>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className='mb-3'>
              <Form.Label>Name <sup className='text-danger'>*</sup></Form.Label>
              <Form.Control type='name' {...register('name')} placeholder='Enter name' />
              {errors.name && <small className='text-danger'>{errors.name.message}</small>}
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Email <sup className='text-danger'>*</sup></Form.Label>
              <Form.Control type='email' {...register('email')} placeholder='Enter email' />
              {errors.email && <small className='text-danger'>{errors.email.message}</small>}
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Password <sup className='text-danger'>*</sup></Form.Label>
              <Form.Control type='password' {...register('password')} placeholder='Enter password' />
              {errors.password && <small className='text-danger'>{errors.password.message}</small>}
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Confirm Password <sup className='text-danger'>*</sup></Form.Label>
              <Form.Control type='password' {...register('confirmPassword')} placeholder='Confirm password' />
              {errors.confirmPassword && <small className='text-danger'>{errors.confirmPassword.message}</small>}
            </Form.Group>

            <Button type='submit' variant='primary' className='w-100 btn-lg'>Submit</Button>
          </Form>

          <p className='mt-3 mb-3 text-center'>Already have an account?</p>
          <Link to='/login' style={{ display: 'inline', marginLeft: '180px', width: '100px' }}>
            <Button type='button' variant='success' style={{ width: '100px' }}>Login</Button>
          </Link>
        </Card>

        <ToastContainer position='top-right' autoClose={1500}/>
      </Container>
      <div>
        <img src={Signup_background} alt='not_displayed' style={{ height: '100vh' }} />
      </div>
    </div>
  );
};

export default Signup;
