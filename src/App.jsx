

// import { useEffect } from "react";
// import { BrowserRouter, Routes, Route, createBrowserRouter  } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { setMobileOpen } from "./redux/themeSlice";

// import UserRoutes from "./routes/UserRoutes";
// import AdminRoutes from "./routes/AdminRoutes";
// import AuthRoutes from "./routes/AuthRoutes";

// function App() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const handleResize = () => {
//       dispatch(setMobileOpen(window.innerWidth < 1000));
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [dispatch]);

//   return (
//     <BrowserRouter>
//       <Routes>
//         {UserRoutes()}
//         {AdminRoutes()}
//         {AuthRoutes.map((route, index) => (
//           <Route key={index} path={route.path} element={route.element} />
//         ))}
//         <Route path="*" element={<h1>404 page</h1>} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;




import { useEffect, Suspense } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { setMobileOpen } from "./redux/themeSlice";
import router from "./routes"; // This imports your createBrowserRouter instance

// Optional fallback while lazy components load
const Loader = () => <div className="text-center py-10">Loading...</div>;

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
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
