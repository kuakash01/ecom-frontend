import { Navigate, Outlet, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import AppLayout from "../layouts/user/AppLayout";
import Home from "../pages/user/Home";
import Product from "../pages/user/Product";
import Category from "../pages/user/Category";
import Cart from "../pages/user/Cart";

const ProtectedRoute = () => {
  const user = useSelector((state) => state.user);
  return user.isAuthenticated ? <AppLayout /> : <Navigate to="/signin" />;
};

const UserRoutes = () => (
  <Route element={<ProtectedRoute />}>
    <Route path="/" element={<Home />} />
    <Route path="/product" element={<Product />} />
    <Route path="/category" element={<Category />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/profile" element={<h1>profile</h1>} />
    <Route path="/settings" element={<h1>settings</h1>} />
    <Route path="/users" element={<h1>users</h1>} />
    <Route path="/users/:id" element={<h1>user</h1>} />
    <Route path="/users/:id/edit" element={<h1>edit user</h1>} />
  </Route>
);

export default UserRoutes;
