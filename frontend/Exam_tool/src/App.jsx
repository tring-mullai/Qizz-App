import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import ProtectedRoute from './components/ProtectedRoute';
import Main_Dashboard from './components/MainDashboard/Main_Dashboard';


const App = () => {
  return (
      
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>

      <Route path='/main_dashboard' element={<ProtectedRoute><Main_Dashboard/></ProtectedRoute>}/>
      
    </Routes>
    </BrowserRouter>  
  )
}

export default App
