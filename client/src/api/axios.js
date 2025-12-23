import axios from 'axios';

const api = axios.create({
  baseURL: 'https://event-management-system-f1df.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;
