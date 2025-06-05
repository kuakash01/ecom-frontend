import React from "react";
import { Outlet } from "react-router-dom";
import HeaderLayout from "./HeaderLayout";
import SidebarLayout from "./SidebarLayout";
import { useSelector } from "react-redux";
import FooterLayout from "./FooterLayout";

function AppLayout() {
  const isSidebarOpen = useSelector((state) => state.theme.isSidebarOpen);
  const isMobileOpen = useSelector((state) => state.theme.isMobileOpen);

  return (
    <div className="  bg-white dark:bg-black/30 relative ">
      {/* Sidebar */}
      <div className="relative z-50">
        <div className="topbar  bg-black text-white p-1">topbar</div>
      </div>
      <div className="sticky top-0 z-30">
        <HeaderLayout />
      </div>
      <div className="flex">
        <div className="absolute">
          <div
            className={`transition-all duration-500 ease-in-out w-[300px] ${
              isSidebarOpen ? "translate-x-0 " : "-translate-x-full"
            } ${
              isMobileOpen ? "fixed  block top-0  " : "relative hidden"
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
    </div>
  );
}

export default AppLayout;
