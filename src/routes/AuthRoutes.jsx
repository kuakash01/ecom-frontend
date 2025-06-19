import { lazy } from "react";

// const Login = lazy(() => import("../pages/auth/Login"));
// const Register = lazy(() => import("../pages/auth/Register"));

const authRoutes = [
  {
    path: "login",
    element: <div>login</div>,
  },
  {
    path: "register",
    element: <div>register</div>,
  },
];

export default authRoutes;
