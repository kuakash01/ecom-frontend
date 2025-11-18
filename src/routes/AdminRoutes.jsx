import React, { lazy, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import Dashboard from "../pages/admin/Dashboard";

// pages
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Products = lazy(() => import("../pages/admin/Products"));
const AppLayoutAdmin = lazy(() => import("../layouts/admin/AppLayoutAdmin"));
const ManageCategories = lazy(() => import("../pages/admin/ManageCategories"));
const Orders = lazy(() => import("../pages/admin/Orders"));
const HomeCarousel = lazy(() => import("../pages/admin/HomeCarousel"));
const ManageColors = lazy(() => import("../pages/admin/ManageColors"));
const ManageSizes = lazy(() => import("../pages/admin/ManageSizes"));


// loders
import ProductsLoader from "../pages/admin/ProductsLoader"; // Example API call
import OrdersLoader from "../pages/admin/OrdersLoader";
import CategoriesLoader from "../pages/admin/CategoriesLoader";
import HomeCarouselLoader from "../pages/admin/HomeCarouselLoader";
import ColorsLoader from "../pages/admin/ColorsLoader";
import SizesLoader from "../pages/admin/SizesLoader";


import { login } from "../redux/adminSlice";
import { checkAuth } from "../services/authService"; // Adjust the path as necessary
import Loading from "../components/common/ui/loading/Loading";
import AdminLogin from "../pages/admin/AdminLogin";

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
            { path: "products", element: <Products />, loader: ProductsLoader },
            { path: "category", element: <ManageCategories />, loader: CategoriesLoader },
            { path: "orders", element: <Orders />, loader: OrdersLoader },
            { path: "colors", element: <ManageColors />, loader: ColorsLoader },
            { path: "sizes", element: <ManageSizes />, loader: SizesLoader },


            { path: "carousel", element: <HomeCarousel />, loader: HomeCarouselLoader },
          ],
        },
      ],
    },
  ],
};


export default adminRoutes;
