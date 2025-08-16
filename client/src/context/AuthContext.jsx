import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get('/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
          setError(null);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    setError(null);
  };

  // This function handles the logout logic
  const logout = () => {
    localStorage.removeItem('token'); // Clears the token from storage
    setUser(null); // Clears the user from the application state
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error,
      login, 
      logout 
    }}>
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

export default AuthContext;