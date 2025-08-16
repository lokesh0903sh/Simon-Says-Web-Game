import axios from 'axios';

// Environment-based API URL configuration
const getAPIBaseURL = () => {
  // Check if we have a custom environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Production detection
  if (import.meta.env.PROD) {
    return 'https://simon-says-game-server.vercel.app/api';
  }
  
  // Development fallback
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getAPIBaseURL();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      const token = parsed.state?.token;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } 
    }
  } catch (error) {
    console.error('Error parsing auth token:', error);
  }
  
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
