import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const loggedInUser = localStorage.getItem('openform_user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('openform_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password, role = 'creator') => {
    try {
      const response = await API.post('/auth/register', { name, email, password, role });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('openform_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('openform_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
