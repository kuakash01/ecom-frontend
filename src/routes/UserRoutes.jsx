import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import AppLayout from "../layouts/user/AppLayout";
import { useEffect } from "react";

import Home from "../pages/user/Home";
import Product from "../pages/user/Product";
import Shop from "../pages/user/Shop";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";

// Account related pages
import AccountLayout from "../layouts/user/AccountLayout";
import Profile from "../pages/user/Profile";
import Orders from "../pages/user/Orders";
import OrderDetails from "../pages/user/OrderDetails";
import Address from "../pages/user/Address";
import AddressForm from "../pages/user/AddressForm";





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
      path: "checkout",
      element: <Checkout />,
    },

    {
      path: "profile",
      element: <AccountLayout />,
      children: [
        {
          index: true,
          element: <Profile />,
        },
        {
          path: "orders",
          element: <Orders />,
        },
        {
          path: "orders/:orderId",
          element: <OrderDetails />,
        },
        {
          path: "addresses",
          element: <Address />,
        },
        {
          path: "addresses/add",
          element: <AddressForm />,
        },
        {
          path: "addresses/edit/:id",
          element: <AddressForm />,
        },
        
      ]
    },


  ],
};

export default userRoutes;
