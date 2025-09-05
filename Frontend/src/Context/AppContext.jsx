import React, { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import api from "../Api";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- Fetch logged-in user from backend (cookie based auth) ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/Getuser", { withCredentials: true });
        console.log(res.data ||null)
        setUser(res.data.user || null); 
      } catch (error) {
        setUser(null);
        error 
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

 
  const login = async () => {
    try {
      const res = await api.get("/Getuser", { withCredentials: true });
      setUser(res.data.user);
      navigate("/home");
    } catch (err) {
      setUser(null);
      err
    }
  };

  // --- Logout function ---
  const logout = () => {
    Cookies.remove("jwt");
    setUser(null);
    navigate("/login");
  };

  const value = { loading, user, login, logout,setUser };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
