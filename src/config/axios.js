import axios from 'axios';
import { history } from '../utils/navigateHelper'; // Adjust the path as necessary

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true,
  timeout: 10000,
});

// Request interceptor (optional)
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

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
