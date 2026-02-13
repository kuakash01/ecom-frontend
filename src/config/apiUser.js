import axios from "axios";
import { history } from "../utils/navigateHelper";

const apiUser = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api` || 'http://localhost:3000/api',
    withCredentials: true,
    timeout: 10000,
});


// Request
apiUser.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});


// // Response
// apiUser.interceptors.response.use(
//   (res) => res,

//   (error) => {

//     if (error.response?.status === 401) {

//       console.warn("User Unauthorized");

//       localStorage.removeItem("token");

//       history.push("/login"); // USER LOGIN
//     }

//     return Promise.reject(error);
//   }
// );

export default apiUser;
