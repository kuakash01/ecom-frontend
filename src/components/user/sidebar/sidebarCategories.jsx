import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

function SidebarCategories({ categories, onClose }) {

  const [openCat, setOpenCat] = useState(null);
  const [openSub, setOpenSub] = useState(null);


  /* ================= TOGGLE ================= */

  const toggleCat = (id) => {
    setOpenCat(openCat === id ? null : id);
    setOpenSub(null);
  };

  const toggleSub = (id) => {
    setOpenSub(openSub === id ? null : id);
  };


  /* ================================================= */

  return (

    <div className="px-2">


      {/* ================= SECTION TITLE ================= */}
      <p className="px-2 mb-3 text-xs font-semibold text-gray-400 uppercase">
        Browse Categories
      </p>


      {/* ================= LIST ================= */}
      <div className="space-y-1">


        {categories.map((cat) => (

          <div
            key={cat._id}
            className="
              rounded-xl
              overflow-hidden
              bg-gray-50
              dark:bg-brand-dark-600
            "
          >


            {/* ================= MAIN CATEGORY ================= */}
            <button
              onClick={() => toggleCat(cat._id)}
              className="
                w-full

                flex items-center justify-between
                px-3 py-3

                font-medium text-sm
                text-gray-800 dark:text-white

                hover:bg-gray-100
                dark:hover:bg-brand-dark-500

                transition
              "
            >

              <span>{cat.name}</span>

              {openCat === cat._id ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}

            </button>


            {/* ================= CHILD LEVEL ================= */}
            {openCat === cat._id && (

              <div
                className="
                  bg-white
                  dark:bg-brand-dark-700
                  
                  dark:border-brand-dark-500
                "
              >

                {cat.children?.map((child) => (

                  <div key={child._id}>


                    {/* SUB CATEGORY */}
                    <button
                      onClick={() => toggleSub(child._id)}
                      className="
                        w-full

                        flex items-center justify-between
                        px-4 py-2.5

                        text-sm
                        text-gray-700 dark:text-gray-200

                        hover:bg-gray-100
                        dark:hover:bg-brand-dark-500

                        transition
                      "
                    >

                      <span>{child.name}</span>

                      {openSub === child._id ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}

                    </button>


                    {/* ================= SUB → SUB ================= */}
                    {openSub === child._id && (

                      <div
                        className="
                          bg-gray-50
                          dark:bg-brand-dark-800

                          px-6 py-2

                          space-y-1
                        "
                      >

                        {child.children?.map((sub) => (

                          <Link
                            key={sub._id}
                            to={`/${sub.slug}`}
                            onClick={onClose}
                            className="
                              block

                              py-1.5

                              text-sm
                              text-gray-600
                              dark:text-gray-300

                              hover:text-black
                              dark:hover:text-white

                              transition
                            "
                          >
                            {sub.name}
                          </Link>

                        ))}

                      </div>
                    )}

                  </div>
                ))}

              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}

export default SidebarCategories;