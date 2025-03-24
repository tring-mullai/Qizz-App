import React from 'react';
import { ApolloProvider } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom'; // Use BrowserRouter directly
import AppRoutes from './routes/routes';
import client from './apollo/Client';

const App = () => {
  return (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </ApolloProvider>  
  );
};

export default App;

