import { createBrowserRouter } from "react-router-dom";

// Route modules
import userRoutes from "./UserRoutes";
import adminRoutes from "./AdminRoutes";

// Optional 404 page
const NotFound = () => <h1>404 - Page Not Found</h1>;

const router = createBrowserRouter([
  adminRoutes, 
  userRoutes,  
  // {
  //   path: "/",
  //   children: authRoutes, // ✅ authRoutes must be an array
  // },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
