

import React from "react";
import { Outlet } from "react-router-dom";
import HeaderLayoutAdmin from "./HeaderLayoutAdmin";
import SidebarLayoutAdmin from "./SidebarLayoutAdmin";
import { useSelector, useDispatch } from "react-redux";

function AppLayoutAdmin() {
  const dispatch = useDispatch();
  const isAdminSidebarOpen = useSelector((state) => state.theme.isAdminSidebarOpen);
  const isMobileOpen = useSelector((state) => state.theme.isMobileOpen);
  const isSideBarHovered = useSelector((state) => state.theme.isSideBarHovered);
  // const sidebarWidth = isSidebarOpen ? 300 : 80;

  return (
    <div className="flex bg-white dark:bg-black/30 relative">
      {/* Sidebar */}
      <div
        onMouseEnter={() =>
          dispatch({ type: "theme/setSideBarHovered", payload: true })
        }
        onMouseLeave={() =>
          dispatch({ type: "theme/setSideBarHovered", payload: false })
        }
        className={`transition-all duration-500 ease-in-out hover:w-[300px] ${
          isAdminSidebarOpen
            ? !isMobileOpen
              ? "w-[300px] fixed h-full"
              : "fixed w-[300px] top-0 left-0 translate-x-0 z-30 h-full"
            : !isMobileOpen
            ? "w-20 fixed h-full"
            : "fixed w-[300px] top-0 left-0 -translate-x-full z-30 h-full"
        }`}
      >
        <SidebarLayoutAdmin />
      </div>

      {/* Main Section */}
      <div
        className={`flex-1 transition-all duration-500 ease-in-out ${
          !isMobileOpen && (isAdminSidebarOpen || isSideBarHovered) ? "ml-[300px]" : !isMobileOpen ? "ml-20" : ""
        }`}
      >
        <div className="sticky top-0 z-50">
          <HeaderLayoutAdmin />
        </div>
        <div className="p-5 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppLayoutAdmin;
