import { lazy } from "react";
import AdminLogin from "../pages/admin/AdminLogin";

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
  {
    path: "admin/signin",
    element: <AdminLogin/>,
  },
  {
    path: "admin/singup",
    element: <div>register</div>,
  },
];

export default authRoutes;
