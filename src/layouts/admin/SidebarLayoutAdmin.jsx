import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebar } from "../../redux/themeSlice";

function SidebarLayoutAdmin() {
  const dispatch = useDispatch();
  const isMobileOpen = useSelector((state) => state.theme.isMobileOpen);
  const isSidebarOpen = useSelector((state) => state.theme.isSidebarOpen);
  return (
    
      <div className={` h-screen flex flex-col bg-brand-300 dark:bg-brand-dark-500 border-r-1 text-black dark:text-white border-brand-500 dark:border-brand-500 relative z-50 `}>
        {/* {isMobileOpen && (
          <button className={`py-3`} type="button" onClick={() => dispatch(setSidebar(false))}>
            close
          </button>
        )} */}
        {!isMobileOpen&&<img className={`py-3 `}  src="/icons" alt="image" />}

        <div>
          <ul className={`py-3`}>
            <li className="text-center py-3 m-2 rounded-md hover:bg-white/20 dark:hover:bg-white/8">
              home
            </li>
            <li className="text-center py-3 m-2 rounded-md hover:bg-white/20 dark:hover:bg-white/8">
              home
            </li>
            <li className="text-center py-3 m-2 rounded-md hover:bg-white/20 dark:hover:bg-white/8">
              home
            </li>
            <li className="text-center py-3 m-2 rounded-md hover:bg-white/20 dark:hover:bg-white/8">
              home
            </li>
            <li className="text-center py-3 m-2 rounded-md hover:bg-white/20 dark:hover:bg-white/8">
              home
            </li>
          </ul>
        </div>
      </div>

  );
}

export default SidebarLayoutAdmin;
