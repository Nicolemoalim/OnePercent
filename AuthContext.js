import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

   // Restore user from localStorage on load
   useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // כניסה
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
      const { accessToken, ...userData } = response.data;
      
      // Store token and user data in localStorage
      localStorage.setItem('token', accessToken);
      const userInfo = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role // Ensure role is included
      };
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Update user state with the complete user info including role
      setUser(userInfo);
      
      return { success: true, user: userInfo };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  // הרשמה
  const register = async (userData) => {
    try {
      const res = await axios.post('http://localhost:3001/api/auth/register', userData);
      setUser(res.data);
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }  
  };

  // התנתקות
  const logout = () => {
    // Clear all auth-related data from storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear user state
    setUser(null);
    
    // Force a re-render by updating the state
    return Promise.resolve();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register, 
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
