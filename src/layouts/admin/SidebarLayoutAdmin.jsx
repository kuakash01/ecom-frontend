import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebar } from "../../redux/themeSlice";
import { Link, useLocation } from "react-router-dom";
import { BinIcon, ArrowDownIcon, GridIcon, ProductHighlightIcon, CmsIcon } from "../../icons";

function SidebarLayoutAdmin() {
  const dispatch = useDispatch();
  const isMobileOpen = useSelector((state) => state.theme.isMobileOpen);
  const isSidebarHovered = useSelector((state) => state.theme.isSideBarHovered);
  const isAdminSidebarOpen = useSelector((state) => state.theme.isAdminSidebarOpen);

  const [openSubmenus, setOpenSubmenus] = useState({});
  const location = useLocation();

  const toggleSubmenu = (name) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const main = [
    {
      name: "dashboard",
      pathName: "/admin/dashboard",
      icon: <GridIcon />,
    },
    {
      name: "Product Management",
      icon: <ProductHighlightIcon />,
      subItem: [
        { name: "products", pathName: "/admin/products" },
        { name: "Category", pathName: "/admin/category" },
        { name: "Orders", pathName: "/admin/orders" },
        { name: "Colors", pathName: "/admin/colors" },
        { name: "Sizes", pathName: "/admin/sizes" },
      ],
    },
    {
      name: "Website Management",
      icon: <CmsIcon />,
      subItem: [
        { name: "Carousel", pathName: "/admin/carousel" },
        { name: "AnnouncementBar", pathName: "/admin/announcement" },

      ],
    },
  ];

  const shouldShowText = isSidebarHovered || isAdminSidebarOpen;

  const renderNavItems = (items) => {
    return (
      <ul className="px-4 space-y-2">
        {items.map((navItem, index) => {
          const hasSub = !!navItem.subItem;
          const isOpen = openSubmenus[navItem.name];
          const isActive = location.pathname === navItem.pathName;

          return (
            <li key={index}>
              <div
                className={`flex items-center justify-between cursor-pointer p-2 rounded transition-all duration-300 ${isActive ? "bg-black/10 font-bold dark:bg-white/10" : "hover:bg-black/10 dark:hover:bg-white/10"} text-nowrap overflow-hidden`}
                onClick={() => hasSub && toggleSubmenu(navItem.name)}
              >
                {hasSub ? (
                  <div className="flex items-center gap-2 w-full ">
                    <span className="text-2xl ">
                      {navItem.icon}
                    </span>
                    <span
                      className={`ml-2 transition-all duration-300 ${shouldShowText ? "opacity-100 inline" : "opacity-0 hidden"
                        }`}
                    >
                      {navItem.name}
                    </span>
                  </div>
                ) : (
                  <Link
                    to={navItem.pathName}
                    className={`flex items-center gap-2 w-full transition-all duration-300 ${isActive ? "text-black dark:text-white" : ""}`}
                  >
                    <span className="text-2xl">
                      {navItem.icon}
                    </span>
                    <span
                      className={`ml-2 transition-all duration-300 ${shouldShowText ? "opacity-100 inline" : "opacity-0 hidden"
                        }`}
                    >
                      {navItem.name}
                    </span>
                  </Link>
                )}

                {hasSub && (
                  <ArrowDownIcon
                    className={`text-xl text-black dark:text-white transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                      } ${shouldShowText ? "opacity-100 inline" : "opacity-0 hidden"}`}
                  />
                )}
              </div>

              {hasSub && isOpen && shouldShowText && (
                <ul className={`pl-8 py-1 space-y-1 text-nowrap overflow-hidden`}>
                  {navItem.subItem.map((sub, subIndex) => {
                    const isSubActive = location.pathname === sub.pathName;
                    return (
                      <li key={subIndex}>
                        <Link
                          to={sub.pathName}
                          className={`flex items-center text-sm p-2 rounded ${isSubActive ? "bg-white/30 font-semibold" : "hover:bg-white/10"
                            }`}
                        >
                          <span
                            className={`ml-2 transition-all duration-300 ${shouldShowText ? "opacity-100 inline" : "opacity-0 hidden"
                              }`}
                          >
                            {sub.name}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div
      className={`h-screen min-w-[60px] flex flex-col bg-admin-light-500 dark:bg-admin-dark-800 border-r border-gray-200 dark:border-gray-500 text-black dark:text-white relative transition-all duration-300 `}

    >
      {!isMobileOpen && (
        <div className="flex items-start overflow-hidden p-4 gap-2">
          <img
            className="w-[100px] max-w-full  rounded-lg  object-contain"
            src="https://img.freepik.com/premium-vector/logo-company-called-creative-design-your-line_880858-63.jpg"
            alt="logo"
          />
          {shouldShowText && (
            <h1 className="text-base font-semibold whitespace-nowrap">Brand Name</h1>
          )}
        </div>
      )}


      <div className="overflow-y-auto mt-20 lg:mt-0">{renderNavItems(main)}</div>
    </div>
  );
}

export default SidebarLayoutAdmin;
