import axios from 'axios';
import { history } from '../utils/navigateHelper'; // Adjust the path as necessary

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api` || 'http://localhost:3000/api',
  withCredentials: true,
  timeout: 10000,
});

// Request interceptor (optional)
// axiosInstance.interceptors.request.use(
//   (config) => config,
//   (error) => Promise.reject(error)
// );

// Add token to every request automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized. Redirecting...");
      history.push('/admin/signin'); // No full reload, works like <Navigate to="/login" />
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
