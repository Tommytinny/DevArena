// src/services/axiosInstance.ts
import axios from 'axios';
import Cookies from 'js-cookie';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your Flask API base URL
});

// Add request interceptor to include token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle expired token or unauthorized access
axiosInstance.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {
      alert('Session expired, please log in again.');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

