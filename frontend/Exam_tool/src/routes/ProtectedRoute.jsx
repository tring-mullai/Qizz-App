import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/DashboardProvider';
import Spinner from 'react-bootstrap/Spinner';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { currentUser, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;