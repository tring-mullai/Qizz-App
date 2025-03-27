import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/DashboardProvider';
import { client } from './apollo/Client'; // Changed to named import
import AppRoutes from './routes/routes';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;

