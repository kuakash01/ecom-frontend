
import { useEffect, useState } from "react";
import api from "../../../config/apiUser";
import { Link } from "react-router-dom";
import CategorySkeleton from "../../user/loadingSkeleton/CategorySkeleton";

function Categories() {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);


  const getCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories/root");
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Error in fetching categories", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getCategories();
  }, []);



  return (

    <div className="bg-gray-50 py-6 md:py-8">

      <div className="px-4 lg:px-8 max-w-[1600px] mx-auto">


        {/* ================= TITLE ================= */}

        <h2
          className="
            text-2xl sm:text-3xl lg:text-4xl
            font-semibold
            mb-8
            text-center
            text-gray-900
          "
        >
          Shop by Category
        </h2>

        {loading && (
          <>
            {/* Mobile */}
            <div className="md:hidden flex gap-5 overflow-x-auto px-4 pb-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <CategorySkeleton key={i} />
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:grid gap-6 justify-center w-full [grid-template-columns:repeat(auto-fit,minmax(200px,200px))]">
              {Array.from({ length: 6 }).map((_, i) => (
                <CategorySkeleton key={i} />
              ))}
            </div>
          </>
        )}

        {/* ================= MOBILE SLIDER ================= */}

        {!loading && (
          <div className="md:hidden">

            <div
              className="
        flex
        gap-5

        overflow-x-auto
        scroll-smooth

        pb-4
        px-4

        hide-scrollbar
      "
            >

              {categories.map((cat) => (

                <Link
                  key={cat._id}
                  to={`/${cat.slug}`}
                  className="
            flex-shrink-0
            flex
            flex-col
            items-center
            gap-2
          "
                >

                  {/* Circular Image */}
                  <div
                    className="
              w-20 h-20
              rounded-full
              overflow-hidden

              shadow-md
              border border-gray-100

              transition
              hover:scale-105
            "
                  >
                    <img
                      src={cat.image?.url || ""}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name */}
                  <p
                    className="
              text-xs
              font-medium
              text-gray-700
              text-center
              truncate
              w-20
            "
                  >
                    {cat.name}
                  </p>

                </Link>

              ))}

            </div>

          </div>
        )}


        {/* ================= DESKTOP GRID ================= */}

        {!loading && <div className="hidden md:block">

          <div
            className="
      grid
      gap-6

      justify-center
      w-full

      [grid-template-columns:repeat(auto-fit,minmax(200px,200px))]
    "
          >
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/${cat.slug}`}
                className="
          group
          relative
          overflow-hidden
          rounded-3xl

          bg-white
          border border-gray-200
          shadow-sm

          hover:shadow-xl
          hover:-translate-y-1
          transition-all duration-300

          w-[200px]
        "
              >
                <img
                  src={cat.image?.url || ""}
                  alt={cat.name}
                  className="
            w-full
            aspect-[4/5]
            object-cover
            transition-transform duration-500
            group-hover:scale-110
          "
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-0 w-full py-3 text-center">
                  <h3 className="text-sm font-semibold text-white">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

        </div>}

      </div>

    </div>
  );
}

export default Categories;
