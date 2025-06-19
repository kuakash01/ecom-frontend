import React,{lazy} from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
// import Dashboard from "../pages/admin/Dashboard";
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Products = lazy(() => import("../pages/admin/Products"));
const AppLayoutAdmin = lazy(() => import("../layouts/admin/AppLayoutAdmin"));

// loders
import dashboardLoader from "../pages/admin/dashboardLoader"; // Example API call

// A wrapper layout that protects admin routes
const ProtectedAdminRoute = () => {
  const admin = useSelector((state) => state.admin);
  return admin?.isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/signin" replace />
  );
};

// Route config for admin routes
const adminRoutes = {
  path: "/admin",
  element: <ProtectedAdminRoute />,   // no children here
  children: [
    {
      path: "",
      element: <AppLayoutAdmin />,
      children: [
        {
          index: true,
          element: <Navigate to="dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "products",
          element: <Products />,
          loader: dashboardLoader,
        },
      ],
    },
  ],
};


export default adminRoutes;
