import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import AppLayout from "../layouts/user/AppLayout";
import { useEffect } from "react";

import Home from "../pages/user/Home";
import Product from "../pages/user/Product";
import Shop from "../pages/user/Shop";
import Cart from "../pages/user/Cart";



// // Auth-protected layout wrapper
// const ProtectedRoute = () => {
//   const user = useSelector((state) => state.user);
//   return user?.isAuthenticated ? <AppLayout /> : <Navigate to="/signin" replace />;
// };


const userRoutes = {
  path: "/",
  element: <AppLayout />,
  children: [
    {
      index: true,
      element: <Home />,
    },
    {
      path: "/:slug",
      element: <Shop />,
    },
    {
      path: "products/:productId",
      element: <Product />,

    },
    {
      path: "cart",
      element: <Cart />,
    },
    {
      path: "profile",
      element: <h1>profile</h1>,
    },
    {
      path: "settings",
      element: <h1>settings</h1>,
    },
    {
      path: "users",
      element: <h1>users</h1>,
    },
    {
      path: "users/:id",
      element: <h1>user</h1>,
    },
    {
      path: "users/:id/edit",
      element: <h1>edit user</h1>,
    },
  ],
};

export default userRoutes;
