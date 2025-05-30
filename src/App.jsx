import { useState } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "./layouts/user/AppLayout";
import AppLayoutAdmin from "./layouts/admin/AppLayoutAdmin";
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from './redux/userSlice';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const admin = useSelector((state) => state.admin);
  const ProtectedRoute = ({ element }) => {
    return user.isAuthenticated ? element : <Navigate to="/signin" />;
  };
  const ProtectedAdminRoute = ({ element }) => {
    return admin.isAuthenticated ? element : <Navigate to="/admin/signin" />;
  };
  return (
    <BrowserRouter>
      <Routes>
        {/* protected routes user*/}
        <Route element={<ProtectedRoute element={<AppLayout />} />}>
          <Route path="/" element={<h1>home</h1>} />
          <Route path="/dashboard" element={<h1>dashboard</h1>} />
          <Route path="/profile" element={<h1>profile</h1>} />
          <Route path="/settings" element={<h1>settings</h1>} />
          <Route path="/users" element={<h1>users</h1>} />
          <Route path="/users/:id" element={<h1>user</h1>} />
          <Route path="/users/:id/edit" element={<h1>edit user</h1>} />
        </Route>

        {/* protected routes admin*/}
        <Route
          path="/admin"
          element={<ProtectedAdminRoute element={<AppLayoutAdmin />} />}
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<h1>admin dashboard</h1>} />
        </Route>

        {/* auth routes*/}
        <Route path="/signin" element={<h1>signin</h1>} />
        <Route path="/signup" element={<h1>signin</h1>} />

        {/*admin auth routes  */}
        <Route path="/admin/signin" element={<h1>admin signin</h1>} />
        <Route path="/admin/signup" element={<h1>admin signup</h1>} />

        {/* 404 page*/}
        <Route path="*" element={<h1>404 page</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
