import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppContext } from "../Context/AppContext.jsx";
import GetRedirectUrl from "../utils/GetRedirectUrl.js";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AppContext);
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  
  const redirectUrl = GetRedirectUrl(user);
  if (location.pathname !== redirectUrl) {
    return <Navigate to={redirectUrl} replace />;
  }

  return children;
};

export default ProtectedRoute;
