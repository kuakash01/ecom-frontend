import { useEffect, Suspense } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { setMobileOpen } from "./redux/themeSlice";
import router from "./routes"; // This imports your createBrowserRouter instance
import Loading from "./components/common/ui/loading/Loading"


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
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
