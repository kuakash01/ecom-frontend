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
import { setIsAuthModalOpen, } from "../redux/userSlice";
import { useDispatch } from "react-redux";




// Auth-protected layout wrapper
const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  if (user.isLoading)
    return null;
  return user?.isAuthenticated ? <Outlet /> : <Navigate to="/" />
};


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
      element: <ProtectedRoute />,
      children: [
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
      
      ]
    },
    {
      path: '*',
      element: <h2>This route is not present</h2>
    }


  ],
};

export default userRoutes;
