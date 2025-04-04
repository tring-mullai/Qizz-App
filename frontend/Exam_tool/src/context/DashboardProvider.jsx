import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { jwtDecode } from 'jwt-decode'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();

  
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          const decoded = jwtDecode(token);
          
          // Basic token expiration check
          if (decoded.exp * 1000 < Date.now()) {
            throw new Error('Token expired');
          }
          
          setCurrentUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = () => {
    // Clear Apollo cache before logout
    client.clearStore().then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
    });
  };

  // Verify token validity on each access
  const verifyToken = () => {
    const token = localStorage.getItem('token');
    console.log('Current Token:', token); // Debug line
    
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      console.log('Token Expiry:', new Date(decoded.exp * 1000)); // Debug line
      
      const isValid = decoded.exp * 1000 > Date.now();
      console.log('Token Valid:', isValid); // Debug line
      
      if (!isValid) logout();
      return isValid;
    } catch (err) {
      console.error('Token Decode Error:', err); // Debug line
      logout();
      return false;
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    isAuthenticated: verifyToken()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};