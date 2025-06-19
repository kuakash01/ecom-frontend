import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";

// A wrapper layout that protects admin routes
const ProtectedAdminRoute = () => {
  const admin = useSelector((state) => state.admin);
  return admin?.isAuthenticated ? <Outlet /> : <Navigate to="/admin/signin" replace />;
};

// Route config for admin routes
const adminRoutes = {
  path: "/admin",
  element: <ProtectedAdminRoute />,
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
      loader: async () => {
        // Simulate loading products data
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ products: [] }); // Replace with actual data fetching logic
          }, 1000);
        });
      },
    },
  ],
};

export default adminRoutes;
