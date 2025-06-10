import React from "react";
import { Outlet } from "react-router-dom";
import HeaderLayoutAdmin from "./HeaderLayoutAdmin";
import SidebarLayoutAdmin from "./SidebarLayoutAdmin";
import { useSelector } from "react-redux";

function AppLayoutAdmin() {
  const isSidebarOpen = useSelector((state) => state.theme.isSidebarOpen);
  const isMobileOpen = useSelector((state) => state.theme.isMobileOpen);

  const sidebarClass = !isMobileOpen
    ? isSidebarOpen
      ? "w-[300px]"
      : "w-20"
    : isSidebarOpen
    ? "fixed w-[300px] -translate-x-100 top-0"
    : "translate-0";

  return (
    <div className=" flex bg-white dark:bg-black/30 relative ">
      {/* Sidebar */}
      <div
        className={`transition-all duration-500 ease-in-out hover:w-[300px] ${
          isSidebarOpen
            ? !isMobileOpen
              ? "w-[300px]"
              : "fixed w-[300px] top-0 left-0 translate-x-0 z-30"
            : !isMobileOpen
            ? "w-20"
            : "fixed w-[300px] top-0 left-0 -translate-x-full z-30"
        }`}
      >
        <SidebarLayoutAdmin />
      </div>
      <div className="flex-1">
        <div className="sticky top-0 z-50">
          <HeaderLayoutAdmin />
        </div>
        {/* Main content */}
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayoutAdmin;
