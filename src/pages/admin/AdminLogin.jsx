// import React, { useState, useEffect  } from "react";
// import api from "../../config/apiAdmin"; // Adjust the path as necessary
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate, Navigate } from "react-router-dom";
// import { login, logout } from "../../redux/adminSlice";
// import { checkAuth } from "../../services/authService";
// import Loading from "../../components/common/ui/loading/Loading";


// const AdminLogin = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);
//   const navigate = useNavigate();
//   const dispatch = useDispatch(); 
//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };
//   const [loading, setLoading] = useState(true);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const response = await api.post("auth/signin", formData);
//       // console.log("Login successful:", response.data);
//       navigate("/admin");
//     } catch (err) {
//       setError("Something went wrong. Try again.");
//       console.error("Login error:", err);
//     }
//   };

//   useEffect(() => {
//     const verifyUser = async () => {
//       const user = await checkAuth();
//       if (user) {
//         dispatch(login(user));
//       }
//       setLoading(false);
//     };
//     verifyUser();
//   }, [dispatch]);

//   if (loading) {
//     return <Loading />;
//   }

//   if (isAuthenticated) {
//     // Already logged in, redirect to dashboard
//     console.log("isAuthenticated", isAuthenticated);
//     return <Navigate to="/admin" replace />;
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6" >Admin Login</h2>

//         {error && (
//           <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="admin@example.com"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-1">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="••••••••"
//               />
//               <span
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 className="absolute right-3 top-2.5 cursor-pointer text-sm text-gray-500 hover:text-gray-700"
//               >
//                 {showPassword ? "Hide" : "Show"}
//               </span>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;









import React, { useState, useEffect } from "react";
import api from "../../config/apiAdmin";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { login } from "../../redux/adminSlice";
import { checkAuthAdmin } from "../../services/authService";
import Loading from "../../components/common/ui/loading/Loading";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("admin/auth/signin", formData);
      dispatch(login(response.data));
      localStorage.setItem("token", response.data.token);
      navigate("/admin");
    } catch (err) {
      setError("Invalid email or password. Try again.");
      console.error("Login error:", err);
    }
  };

  useEffect(() => {
    const verifyUser = async () => {
      const user = await checkAuthAdmin();
      if (user) dispatch(login(user));
      setLoading(false);
    };
    verifyUser();
  }, [dispatch]);

  if (loading) return <Loading />;
  if (isAuthenticated) return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side image */}
      <div className="hidden md:flex md:w-1/2">
        <img
          src={`${import.meta.env.VITE_BASE_URL}/auth/signin.png`}
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 p-8">
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Admin Login
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="••••••••"
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 cursor-pointer text-sm text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 hover:bg-black text-white font-semibold py-2 rounded-md transition"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
