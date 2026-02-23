import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebar } from "../../redux/themeSlice";
import api from "../../config/apiUser";
import { toast } from "react-toastify";

import { X } from "lucide-react";

import SidebarCategories from "../../components/user/sidebar/sidebarCategories";

function SidebarLayout() {

  const dispatch = useDispatch();

  // ONLY depend on this
  const isSidebarOpen = useSelector((state) => state.theme.isSidebarOpen);

  const [categories, setCategories] = useState([]);


  /* ================= FETCH ================= */

  const getCategories = async () => {
    try {
      const res = await api.get("/categories/tree");
      setCategories(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };


  useEffect(() => {
    getCategories();
  }, []);


  /* ================= CLOSE ================= */

  const closeSidebar = () => {
    dispatch(setSidebar(false));
  };


  /* ================================================= */

  return (
    <>


      {/* ================= OVERLAY ================= */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="
            fixed
            top-0 left-0
            w-screen h-screen

            bg-black/60

            z-40
          "
        />
      )}


      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed
          top-0 left-0

          h-screen
          w-[280px]

          bg-white
          dark:bg-brand-dark-500

          shadow-2xl

          z-50

          transform
          transition-transform
          duration-300
          ease-in-out

          ${isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"}
        `}
      >


        {/* ================= HEADER ================= */}
        <div
          className="
            flex items-center justify-between
            px-4 py-4

            border-b border-gray-100
            dark:border-brand-dark-600

            bg-gray-50
            dark:bg-brand-dark-600
          "
        >

          <h3 className="font-semibold text-gray-900 dark:text-white">
            Categories
          </h3>

          <button
            onClick={closeSidebar}
            className="
              p-2
              rounded-full

              hover:bg-gray-200
              dark:hover:bg-brand-dark-400

              transition
            "
          >
            <X className="w-5 h-5" />
          </button>

        </div>


        {/* ================= BODY ================= */}
        <div
          className="
            flex-1
            overflow-y-auto

            px-2 py-3

            hide-scrollbar
          "
        >

          <SidebarCategories
            categories={categories}
            onClose={closeSidebar}
          />

        </div>

      </aside>

    </>
  );
}

export default SidebarLayout;