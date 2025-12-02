import { useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { setMobileOpen } from "./redux/themeSlice";
import router from "./routes"; // This imports your createBrowserRouter instance
import Loading from "./components/common/ui/loading/Loading"
// import { checkAuth } from "./services/authService";
import { history } from "./utils/navigateHelper";


// toast 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




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
    <Suspense fallback={<Loading />}>
      
      <ToastContainer position="top-right" autoClose={3000} />
      <RouterProvider router={router} history={history} />
    </Suspense>
  );
}

export default App;
