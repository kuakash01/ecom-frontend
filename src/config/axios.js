import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api', // Default base URL
  withCredentials: true, // Include credentials for CORS requests
  timeout: 10000, // Request timeout in milliseconds    
});

export default axiosInstance;