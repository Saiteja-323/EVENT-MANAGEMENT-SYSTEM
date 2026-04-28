import React, {
  createContext,
  useState,
  useEffect,
  useContext
} from 'react';

import api from '../api/axios';

const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);


  // Check auth on first load
  useEffect(() => {

    const checkAuth = async () => {

      const token = localStorage.getItem('token');

      // No token → not logged in
      if (!token) {
        setLoading(false);
        return;
      }

      try {

        const res = await api.get('/api/users/me');

        setUser(res.data);

        setError(null);

      } catch (err) {

        console.error('Auth check failed:', err);

        localStorage.removeItem('token');

        setUser(null);

        setError(null);

      } finally {

        setLoading(false);

      }

    };

    checkAuth();

  }, []);



  // Login function
  const login = (token, userData) => {

    localStorage.setItem('token', token);

    setUser(userData);

    setError(null);

  };



  // Logout function
  const logout = () => {

    localStorage.removeItem('token');

    setUser(null);

    setError(null);

  };



  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};


// Custom hook
export const useAuth = () => {

  return useContext(AuthContext);

};