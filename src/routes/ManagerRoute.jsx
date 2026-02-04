import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

const ManagerRoute = ({ children }) => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user && (userRole === "manager" || userRole === "admin")) {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default ManagerRoute;
