import { useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { setMobileOpen } from "./redux/themeSlice";
import router from "./routes"; // This imports your createBrowserRouter instance
import Loading from "./components/common/ui/loading/Loading"
// import { checkAuth } from "./services/authService";
import { history } from "./utils/navigateHelper";



function App() {
  const dispatch = useDispatch();
  // const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);
  
  // useEffect(() => {
  //   const verifyUser = async () => {
  //     const user = await checkAuth();
  //     console.log("is authenticated:", isAuthenticated);
  //     if (user) {
  //       console.log("User is authenticated:", user);

  //     } else {
  //       console.log("User is not authenticated");
  //     }

  //   }
  //   verifyUser();
  // }, [])

  useEffect(() => {
    const handleResize = () => {
      dispatch(setMobileOpen(window.innerWidth < 1000));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} history={history} />
    </Suspense>
  );
}

export default App;
