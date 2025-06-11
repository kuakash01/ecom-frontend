// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setSidebar } from "../../redux/themeSlice";
// import { Link, useLocation } from "react-router-dom";
// import { BinIcon, ArrowDownIcon } from "../../icons"; // adjust path if needed

// function SidebarLayoutAdmin() {
//   const dispatch = useDispatch();
//   const isMobileOpen = useSelector((state) => state.theme.isMobileOpen);
//   const isSidebarHovered = useSelector((state) => state.theme.isSideBarHovered);
//    const isSidebarOpen = useSelector((state) => state.theme.isSidebarOpen);

//   const [openSubmenus, setOpenSubmenus] = useState({});
//   const location = useLocation();

//   const toggleSubmenu = (name) => {
//     setOpenSubmenus((prev) => ({
//       ...prev,
//       [name]: !prev[name],
//     }));
//   };

//   const main = [
//     {
//       name: "dashboard",
//       pathName: "/admin/dashboard",
//       icon: <BinIcon />,
//     },
//     {
//       name: "Product Management",
//       icon: <BinIcon />,
//       subItem: [
//         { name: "products", pathName: "/admin/products" },
//         { name: "Category", pathName: "/admin/category" },
//       ],
//     },
//   ];

//   const renderNavItems = (items) => {
//     return (
//       <ul className="px-4 space-y-2">
//         {items.map((navItem, index) => {
//           const hasSub = !!navItem.subItem;
//           const isOpen = openSubmenus[navItem.name];
//           const isActive = location.pathname === navItem.pathName;

//           return (
//             <li key={index}>
//               <div
//                 className={`flex items-center justify-between cursor-pointer p-2 rounded transition-all duration-300 ${isActive ? "bg-white/30 font-bold" : "hover:bg-white/10"} overflow-hidden`}
//                 onClick={() => hasSub && toggleSubmenu(navItem.name)}
//               >
//                 {hasSub ? (
//                   <div className="flex items-center gap-2 w-full text-nowrap overflow-hidden">
//                     {navItem.icon}
//                     <span className={`transition-all duration-300 ${isSidebarHovered || isSidebarOpen ? "opacity-100 w-auto ml-2" : "opacity-0 w-0 overflow-hidden"}`}>
//                       {navItem.name}
//                     </span>
//                   </div>
//                 ) : (
//                   <Link
//                     to={navItem.pathName}
//                     className={`flex items-center gap-2 w-full transition-all duration-300 ${isActive ? "text-brand-900" : ""}`}
//                   >
//                     {navItem.icon}
//                     <span className={`transition-all duration-300 ${isSidebarHovered || isSidebarOpen ? "opacity-100 w-auto ml-2" : "opacity-0 w-0 overflow-hidden"}`}>
//                       {navItem.name}
//                     </span>
//                   </Link>
//                 )}
//                 {hasSub && (
//                   <ArrowDownIcon
//                     className={`text-xl transition-transform duration-300 ${
//                       isOpen ? "rotate-180" : ""
//                     } ${isSidebarHovered || isSidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}
//                   />
//                 )}
//               </div>

//               {hasSub && isOpen && (
//                 <ul className={`pl-8 py-1 space-y-1 overflow-hidden`}>
//                   {navItem.subItem.map((sub, subIndex) => {
//                     const isSubActive = location.pathname === sub.pathName;
//                     return (
//                       <li key={subIndex} className="overflow-hidden">
//                         <Link
//                           to={sub.pathName}
//                           className={`flex items-center text-sm p-1 rounded ${
//                             isSubActive ? "bg-white/30 font-semibold" : "hover:bg-white/10"
//                           }`}
//                         >
//                           <span className={`transition-all duration-300 ${isSidebarHovered || isSidebarOpen ? "opacity-100 ml-2" : "opacity-0 w-0 overflow-hidden"}`}>
//                             {sub.name}
//                           </span>
//                         </Link>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//     );
//   };

//   return (
//     <div
//       className={`h-screen min-w-[60px] flex flex-col bg-brand-300 dark:bg-brand-dark-500 border-r text-black dark:text-white relative z-50 transition-all duration-300`}
//       // onMouseEnter={() => dispatch(setSidebar({ isSideBarHovered: true }))}
//       // onMouseLeave={() => dispatch(setSidebar({ isSideBarHovered: false }))}
//     >
//       {!isMobileOpen && (
//         <img className="py-3 px-4" src="/icons" alt="logo" />
//       )}
//       <div className="overflow-y-auto">{renderNavItems(main)}</div>
//     </div>
//   );
// }

// export default SidebarLayoutAdmin;



import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebar } from "../../redux/themeSlice";
import { Link, useLocation } from "react-router-dom";
import { BinIcon, ArrowDownIcon } from "../../icons";

function SidebarLayoutAdmin() {
  const dispatch = useDispatch();
  const isMobileOpen = useSelector((state) => state.theme.isMobileOpen);
  const isSidebarHovered = useSelector((state) => state.theme.isSideBarHovered);
  const isSidebarOpen = useSelector((state) => state.theme.isSidebarOpen);

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
      icon: <BinIcon />,
    },
    {
      name: "Product Management",
      icon: <BinIcon />,
      subItem: [
        { name: "products", pathName: "/admin/products" },
        { name: "Category", pathName: "/admin/category" },
      ],
    },
  ];

  const shouldShowText = isSidebarHovered || isSidebarOpen;

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
                className={`flex items-center justify-between cursor-pointer p-2 rounded transition-all duration-300 ${isActive ? "bg-white/30 font-bold" : "hover:bg-white/10"} text-nowrap overflow-hidden`}
                onClick={() => hasSub && toggleSubmenu(navItem.name)}
              >
                {hasSub ? (
                  <div className="flex items-center gap-2 w-full">
                    {navItem.icon}
                    <span
                      className={`ml-2 transition-all duration-300 ${
                        shouldShowText ? "opacity-100 inline" : "opacity-0 hidden"
                      }`}
                    >
                      {navItem.name}
                    </span>
                  </div>
                ) : (
                  <Link
                    to={navItem.pathName}
                    className={`flex items-center gap-2 w-full transition-all duration-300 ${isActive ? "text-brand-900" : ""}`}
                  >
                    {navItem.icon}
                    <span
                      className={`ml-2 transition-all duration-300 ${
                        shouldShowText ? "opacity-100 inline" : "opacity-0 hidden"
                      }`}
                    >
                      {navItem.name}
                    </span>
                  </Link>
                )}

                {hasSub && (
                  <ArrowDownIcon
                    className={`text-xl transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    } ${shouldShowText ? "opacity-100 inline" : "opacity-0 hidden"}`}
                  />
                )}
              </div>

              {hasSub && isOpen && shouldShowText && (
                <ul className={`pl-8 py-1 space-y-1 text-nowrap`}>
                  {navItem.subItem.map((sub, subIndex) => {
                    const isSubActive = location.pathname === sub.pathName;
                    return (
                      <li key={subIndex}>
                        <Link
                          to={sub.pathName}
                          className={`flex items-center text-sm p-1 rounded ${
                            isSubActive ? "bg-white/30 font-semibold" : "hover:bg-white/10"
                          }`}
                        >
                          <span
                            className={`ml-2 transition-all duration-300 ${
                              shouldShowText ? "opacity-100 inline" : "opacity-0 hidden"
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
      className={`h-screen min-w-[60px] flex flex-col bg-brand-300 dark:bg-brand-dark-500 border-r text-black dark:text-white relative z-50 transition-all duration-300`}
      
    >
      {!isMobileOpen && <img className="py-3 px-4" src="/icons" alt="logo" />}
      <div className="overflow-y-auto mt-20 lg:mt-0">{renderNavItems(main)}</div>
    </div>
  );
}

export default SidebarLayoutAdmin;
