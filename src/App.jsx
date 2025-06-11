// import { useEffect, useState } from "react";
// import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
// import { useDispatch, useSelector } from 'react-redux';
// import { login, logout } from './redux/userSlice';
// import { setMobileOpen } from "./redux/themeSlice";
// import AppLayout from "./layouts/user/AppLayout";
// import AppLayoutAdmin from "./layouts/admin/AppLayoutAdmin";
// import Home from "./pages/user/Home";
// import Product from "./pages/user/Product"
// import Category from "./pages/user/Category";
// import Cart from "./pages/user/Cart"
// import Dashboard from "./pages/admin/Dashboard";


// function App() {
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user);
//   const admin = useSelector((state) => state.admin);
//   const ProtectedRoute = ({ element }) => {
//     return user.isAuthenticated ? element : <Navigate to="/signin" />;
//   };
//   const ProtectedAdminRoute = ({ element }) => {
//     return admin.isAuthenticated ? element : <Navigate to="/admin/signin" />;
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       dispatch(setMobileOpen(window.innerWidth < 1000));
//     };

//     // Set initially
//     handleResize();

//     // Listen to resize
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [dispatch]);

//   return (
//     <BrowserRouter >
//       <Routes>
//         {/* protected routes user*/}
//         <Route element={<ProtectedRoute element={<AppLayout />} />}>
//           <Route path="/" element={<Home/>} />
//           <Route path="/product" element={<Product/>} />
//           <Route path="/category" element={<Category/>} />
//           <Route path="/cart" element={<Cart/>} />
//           <Route path="/profile" element={<h1>profile</h1>} />
//           <Route path="/settings" element={<h1>settings</h1>} />
//           <Route path="/users" element={<h1>users</h1>} />
//           <Route path="/users/:id" element={<h1>user</h1>} />
//           <Route path="/users/:id/edit" element={<h1>edit user</h1>} />
//         </Route>



//         {/* protected routes admin*/}
//         <Route
//           path="/admin"
//           element={<ProtectedAdminRoute element={<AppLayoutAdmin />} />}
//         >
//           <Route index element={<Navigate to="dashboard" />} />
//           <Route path="dashboard" element={<Dashboard/>} />
//           <Route path="products" element={<Dashboard/>} />
//         </Route>




//         {/* auth routes*/}
//         <Route path="/signin" element={<h1>signin</h1>} />
//         <Route path="/signup" element={<h1>signin</h1>} />

//         {/*admin auth routes  */}
//         <Route path="/admin/signin" element={<h1>admin signin</h1>} />
//         <Route path="/admin/signup" element={<h1>admin signup</h1>} />

//         {/* 404 page*/}
//         <Route path="*" element={<h1>404 page</h1>} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMobileOpen } from "./redux/themeSlice";

import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import AuthRoutes from "./routes/AuthRoutes";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      dispatch(setMobileOpen(window.innerWidth < 1000));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {UserRoutes()}
        {AdminRoutes()}
        {AuthRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<h1>404 page</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

