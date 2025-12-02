import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import HeaderLayout from "./HeaderLayout";
import SidebarLayout from "./SidebarLayout";
import { useSelector, useDispatch } from "react-redux";
import FooterLayout from "./FooterLayout";
import AuthModal from "../../components/user/Auth/AuthModal";
import { setIsAuthModalOpen, setIsAuthenticated } from "../../redux/userSlice";
import { checkAuthUser } from "../../services/authService";
import api from "../../config/axios";

function AppLayout() {
  const isSidebarOpen = useSelector((state) => state.theme.isSidebarOpen);
  const isMobileOpen = useSelector((state) => state.theme.isMobileOpen);
  const { isAuthenticated, isAuthModalOpen } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(true);


  // const token = localStorage.getItem("token");

  const dispatch = useDispatch();

  const verifyUser = async () => {
    setLoading(true);
    const user = await checkAuthUser();
    if (user) {
      dispatch(setIsAuthenticated(true));

      // dispatch(setIsAuthModalOpen(open))
    }
    setLoading(false);
  };

  const syncLocalCart = async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      if (localCart.length) {
        const res = await api.post("/cart/guest/sync", {
          items: localCart
        });
        console.log("cart sync response", res.data);
        localStorage.removeItem("cart");
        localSTorage.removeItem("cartCount");
      }
    } catch (error) {
      console.error("Error sync in local cart", error);
    }
  }


  // close modal when logged in
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(setIsAuthModalOpen(false));
      if (!loading)
        syncLocalCart();
    }
    else dispatch(setIsAuthModalOpen(true))
  }, [isAuthenticated, dispatch]);


  useEffect(() => {
    verifyUser();
  }, [dispatch]);

  return (
    <div className="  bg-white dark:bg-black/30 relative ">
      {/* Sidebar */}
      {!isMobileOpen && <div className="relative z-50">
        <div className="topbar  bg-black text-white p-1">topbar</div>
      </div>}
      <div className="sticky top-0 z-30 shadow-lg">
        <HeaderLayout />
      </div>
      <div className="flex ">
        <div className="absolute ">
          <div
            className={`transition-all duration-500 ease-in-out w-[300px] ${isSidebarOpen ? "translate-x-0 " : "-translate-x-full"
              } ${isMobileOpen ? "fixed  block top-0  " : "relative hidden"
              } z-10 `}
          >
            {/* isSidebarOpen ? "w-[300px]" : "w-0 " */}
            <SidebarLayout />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 h-full  relative ">
          <Outlet />
          <div>
            <FooterLayout />
          </div>
        </div>
      </div>
      {!loading && <AuthModal
        isAuthModalOpen={isAuthModalOpen}
        isAuthenticated={isAuthenticated}
        onClose={() => dispatch(setIsAuthModalOpen(false))}
      />}
    </div>
  );
}

export default AppLayout;
