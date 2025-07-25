import React, { lazy, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import Dashboard from "../pages/admin/Dashboard";
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Products = lazy(() => import("../pages/admin/Products"));
const AppLayoutAdmin = lazy(() => import("../layouts/admin/AppLayoutAdmin"));
import { login } from "../redux/adminSlice";
import { checkAuth } from "../services/authService"; // Adjust the path as necessary
import Loading from "../components/common/ui/loading/Loading";
import AdminLogin from "../pages/admin/AdminLogin";
// loders
import dashboardLoader from "../pages/admin/dashboardLoader"; // Example API call
import { useEffect } from "react";









// A wrapper layout that protects admin routes
const ProtectedAdminRoute = () => {
  const admin = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const verifyUser = async () => {
      const user = await checkAuth();
      if (user) {
        dispatch(login(user));
      }
      setLoading(false); // Done checking
    };
    verifyUser();
  }, [dispatch]);

  if (loading) {
    // You can show a spinner here instead
    return <Loading />;
  }

  return admin?.isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/signin" replace />
  );
};

// Route config for admin routes
// const adminRoutes = {
//   path: "/admin",
//   element: <ProtectedAdminRoute />,   // no children here
//   children: [
//     {
//       path: "",
//       element: <AppLayoutAdmin />,
//       children: [
//         {
//           index: true,
//           element: <Navigate to="dashboard" replace />,
//         },
//         {
//           path: "dashboard",
//           element: <Dashboard />,
//         },
//         {
//           path: "products",
//           element: <Products />,
//           loader: dashboardLoader,
//         },
//       ],
//     },
//   ],
// };


// In your adminRoutes config
const adminRoutes = {
  path: "/admin",
  children: [
    {
      path: "signin",
      element: <AdminLogin />, // <-- NOT protected
    },
    {
      element: <ProtectedAdminRoute />, // <-- Protects all below
      children: [
        {
          path: "",
          element: <AppLayoutAdmin />,
          children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "products", element: <Products />, loader: dashboardLoader },
          ],
        },
      ],
    },
  ],
};


export default adminRoutes;
