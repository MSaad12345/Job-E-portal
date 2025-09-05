import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext.jsx";
import getRedirectUrl from "../utils/GetRedirectUrl.js";

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AppContext);

  if (loading) return <div>Loading...</div>;

  return user ? <Navigate to={getRedirectUrl(user)} replace /> : children;
};

export default PublicRoute;
