import ThemeToggle from "../../components/common/ThemeToggle";
import UserDropdown from "../../components/user/header/UserDropdown";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../redux/themeSlice"; // Import the action to toggle sidebar

const HeaderLayout = () => {
  const dispatch = useDispatch();
  const isMobileOpen = useSelector((state) => state.theme.isMobileOpen); // Get the sidebar state from Redux store

  return (
    <>
      
      <nav className="flex justify-between items-center dark:bg-brand-dark-500 bg-brand-300 text-black dark:text-white p-4 shadow-md sticky top-0 z-50 ">
        <div className="flex gap-4 items-center">
          {isMobileOpen && (
            <button
              className="cursor-pointer"
              type="button"
              onClick={() => dispatch(toggleSidebar())}
            >
              menu
            </button>
          )}
          <img src="/icons" alt="image" />
        </div>
        {!isMobileOpen && (
          <ul className="flex gap-4 justify-around">
            <li>home</li>
            <li>home</li>
            <li>home</li>
            <li>home</li>
            <li>home</li>
          </ul>
        )}
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

export default HeaderLayout;
