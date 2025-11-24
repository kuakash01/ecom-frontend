import { useState, useEffect, useRef } from "react";
import ThemeToggle from "../../components/common/ThemeToggle";
import UserDropdown from "../../components/user/header/UserDropdown";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../redux/themeSlice"; // Import the action to toggle sidebar
import api from "../../config/axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { CartIcon } from "../../icons"


function Navbar({ categories, onSelect, onHover, }) {

  return (
    <div className="flex items-center">
      <Link to="/">
        <div className="flex items-center">
          <img
            className="w-[50px] max-w-full  rounded-lg  object-contain"
            src="https://img.freepik.com/premium-vector/logo-company-called-creative-design-your-line_880858-63.jpg"
            alt="logo"
          />
        </div>
      </Link>
      <ul className="flex gap-8 px-4 ">
        {categories.map(cat => (
          <li
            key={cat._id}
            onMouseEnter={() => onHover(cat)}

            onClick={() => onSelect(cat)}
            className="cursor-pointer font-medium text-gray-700 dark:text-white hover:text-blue-600 
        transition-colors py-6"
          >
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}


function MegaPanel({ category }) {
  if (!category) return null;

  return (
    <div

      className="
      absolute left-0 top-full
      w-screen 
      bg-white shadow-xl
      p-8 grid grid-cols-6 gap-5 z-50 
      border-t border-gray-200
    ">
      {category.children?.map(child => (
        <div key={child._id} className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-800 tracking-wide cursor-pointer">
            {child.name}
          </h3>

          <ul className="space-y-2">
            {child.children?.map(sub => (
              <li
                key={sub._id}
                className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
              >
                {sub.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}


function NavContainer({ categories }) {
  const [selected, setSelected] = useState(null);
  const ref = useRef(null);

  // close when clicking outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setSelected(null);
      }
    };
    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, []);


  return (
    <div
      ref={ref}
      className="relative  overflow-visible"
      onMouseLeave={() => setSelected(null)}     // close on mouse leave
    >
      <Navbar
        categories={categories}
        onSelect={setSelected}
        onHover={setSelected} // open on hover
      />

      <MegaPanel category={selected} />
    </div>
  );
}



const HeaderLayout = () => {
  const dispatch = useDispatch();
  const isMobileOpen = useSelector((state) => state.theme.isMobileOpen); // Get the sidebar state from Redux store
  const [categoryTree, setCategoryTree] = useState([]);

  const getCategoryTree = async () => {
    try {
      const res = await api.get("/categories/tree");
      // console.log("Category tree", res.data.data);
      setCategoryTree(res.data.data);
    } catch (error) {
      console.log("Error fetching Category Tree");
      toast.error("Error Fetching Categories");
    }
  }

  useEffect(() => {
    getCategoryTree();
  }, []);
  return (
    <>

      <nav className="flex justify-between items-center dark:bg-brand-dark-500 bg-white text-black dark:text-white shadow-md sticky top-0 z-50 ">
        {isMobileOpen && (
          <button
            className="cursor-pointer"
            type="button"
            onClick={() => dispatch(toggleSidebar())}
          >
            menu
          </button>
        )}
        {!isMobileOpen && (
          <NavContainer categories={categoryTree} />
        )}
        <div className="flex gap-4 items-center">
          <Link to="/cart">
            <CartIcon className="text-2xl" />
          </Link>
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
