import { Navigate } from "react-router-dom";
import DashboardProvider from '../context/DashboardProvider';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  );
};

export default ProtectedRoute;
