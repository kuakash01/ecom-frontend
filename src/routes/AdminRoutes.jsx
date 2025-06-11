import { Navigate, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import AppLayoutAdmin from "../layouts/admin/AppLayoutAdmin";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products"

const ProtectedAdminRoute = () => {
  const admin = useSelector((state) => state.admin);
  return admin.isAuthenticated ? <AppLayoutAdmin /> : <Navigate to="/admin/signin" />;
};

const AdminRoutes = () => (
  <Route path="/admin" element={<ProtectedAdminRoute />}>
    <Route index element={<Navigate to="dashboard" />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="products" element={<Products />} />
  </Route>
);

export default AdminRoutes;
