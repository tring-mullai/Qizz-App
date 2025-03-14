import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom'; // Use BrowserRouter directly
import AppRoutes from './routes/routes';

const App = () => {
  return (
    <BrowserRouter> 
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;

