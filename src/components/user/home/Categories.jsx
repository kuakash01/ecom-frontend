import { useEffect, useState } from 'react';
import api from "../../../config/apiUser";
import { Link } from "react-router-dom"

function Categories() {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const res = await api.get("/categories/root");
      setCategories(res.data.data);
    } catch (error) {
      console.error("Error in fetching categories", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 ">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-800">
        Shop by Category
      </h2>

      <div className="
        grid 
        grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
        gap-4 sm:gap-6
      ">
        {categories.map(cat => (
          <div
            key={cat._id}
            className="
              relative overflow-hidden rounded-lg sm:rounded-xl
              shadow-md sm:shadow-lg 
              group cursor-pointer
              transition-all
            "
          >
            <Link to={`/${cat.slug}`}>

              {/* MOBILE STYLE */}
              <img
                src={cat.image.url}
                alt={cat.name}
                className="
                w-full 
                h-40 sm:h-64 
                object-cover 
                transition-transform duration-500 
                group-hover:scale-105 sm:group-hover:scale-110
              "
              />

              {/* MOBILE: Solid bar; DESKTOP: Gradient */}
              <div className="
              absolute bottom-0 w-full
              bg-gradient-to-t from-black via-transparent to-transparent p-4 text-white
              p-2 sm:p-4 
              text-white text-center
            ">
                <h3 className="text-sm sm:text-lg font-medium sm:font-semibold">
                  {cat.name}
                </h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
