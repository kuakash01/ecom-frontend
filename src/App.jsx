import { useEffect, Suspense, useState } from "react";
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

import AuthModal from "./components/user/Auth/AuthModal"



function App() {
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(true);


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
      <AuthModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
      <ToastContainer position="top-right" autoClose={3000} />
      <RouterProvider router={router} history={history} />
    </Suspense>
  );
}

export default App;
