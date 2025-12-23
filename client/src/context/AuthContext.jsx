import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Response interceptor
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      response => response,
      err => {
        if (err.response?.status === 401) {
          logout();
          setError('Your session has expired. Please log in again.');
        }
        return Promise.reject(err);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/api/users/me');
        setUser(res.data);
        setError(null);
      } catch (err) {
        setError('Session expired. Please log in again. '+err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setError(null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
