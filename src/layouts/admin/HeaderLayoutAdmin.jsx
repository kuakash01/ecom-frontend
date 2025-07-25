import ThemeToggle from "../../components/common/ThemeToggle";
import UserDropdown from "../../components/user/header/UserDropdown";
import { useDispatch, useSelector } from "react-redux";
import { toggleAdminSidebar } from "../../redux/themeSlice"; // Import the action to toggle sidebar
import { HamBurgerOpenIcon, HamBurgerCloseIcon } from "../../icons";



const HeaderLayoutAdmin = () => {
  const dispatch = useDispatch();
  const isMobileOpen = useSelector((state) => state.theme.isMobileOpen); // Get the sidebar state from Redux store
  const isAdminSidebarOpen = useSelector((state) => state.theme.isAdminSidebarOpen);
  
  return (
    <>
      <nav className="flex justify-between items-center dark:bg-brand-dark-500 bg-brand-300 text-black dark:text-white p-4 shadow-md sticky top-0 z-50 ">
        <div className="flex gap-4 items-center">

          <button
            className="cursor-pointer"
            type="button"
            onClick={() => dispatch(toggleAdminSidebar())}
          >
            {isAdminSidebarOpen ? (
              <HamBurgerOpenIcon className="text-2xl" />
            ) : (
              <HamBurgerCloseIcon className="text-2xl" />
            )}
          </button>

          <img src="/icons" alt="image" />
        </div>

        <div className="flex gap-4 items-center">
          <div>
            <ThemeToggle />
          </div>
          <div className="">
            <UserDropdown />
          </div>
        </div>
      </nav>
    </>
  );
};

export default HeaderLayoutAdmin;
