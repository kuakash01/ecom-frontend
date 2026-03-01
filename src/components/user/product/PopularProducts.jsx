import React, { useState, useEffect, useRef } from "react";
import api from "../../../config/apiUser";
import { Link } from "react-router-dom";
import NewArrivalsSkeleton from "../loadingSkeleton/NewArrivalsSkeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PopularProducts() {

  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArrows, setShowArrows] = useState(false);

  const scrollRef = useRef(null);


  /* ================= FETCH ================= */

  const getPopularProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("products/bestSeller");
      setPopularProducts(res.data.data || []);

    } catch (error) {
      console.error("Error fetching popular products", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getPopularProducts();
  }, []);


  /* ================= CHECK OVERFLOW ================= */

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkOverflow = () => {
      const containerWidth = el.clientWidth;

      // Detect card width dynamically
      const firstCard = el.querySelector(".flex-shrink-0");
      if (!firstCard) return;

      const cardWidth = firstCard.offsetWidth;
      const gap = 24; // gap-6

      const totalCards = popularProducts.length + 1; // +1 for Explore More

      const visibleCapacity = Math.floor(
        containerWidth / (cardWidth + gap)
      );

      setShowArrows(totalCards > visibleCapacity);
    };

    requestAnimationFrame(checkOverflow);
    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [popularProducts]);


  /* ================= SCROLL ================= */

  const scroll = (dir) => {
    if (!scrollRef.current) return;

    const cardWidth = 220 + 24;

    scrollRef.current.scrollBy({
      left: dir === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };


  /* ================================================= */

  return (

    <div className="bg-gray-50 py-6 md:py-8 relative">

      <div className="px-4 lg:px-8 max-w-[1600px] mx-auto">


        {/* ================= TITLE ================= */}

        <h3 className="
          text-2xl sm:text-3xl lg:text-4xl
          font-semibold mb-4
          text-center text-gray-900
        ">
          Popular Products
        </h3>


        {/* ================= LOADING ================= */}

        {loading && <NewArrivalsSkeleton count={4} />}


        {/* ================= EMPTY ================= */}

        {!loading && popularProducts.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No popular products found 😕
          </div>
        )}


        {/* ================= SLIDER ================= */}

        {!loading && popularProducts.length > 0 && (

          <div className="relative">


            {/* Left */}
            {showArrows && (
              <button
                onClick={() => scroll("left")}
                className="
                  hidden lg:flex
                  absolute -left-5 top-1/2 -translate-y-1/2 z-10

                  w-11 h-11 rounded-full
                  bg-white/90 backdrop-blur
                  shadow-md hover:shadow-xl hover:scale-105

                  items-center justify-center
                  transition
                "
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}


            {/* Right */}
            {showArrows && (
              <button
                onClick={() => scroll("right")}
                className="
                  hidden lg:flex
                  absolute -right-5 top-1/2 -translate-y-1/2 z-10

                  w-11 h-11 rounded-full
                  bg-white/90 backdrop-blur
                  shadow-md hover:shadow-xl hover:scale-105

                  items-center justify-center
                  transition
                "
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            )}


            {/* Scroll */}
            <div
              ref={scrollRef}
              className="
                flex gap-6

                overflow-x-auto scroll-smooth
                pb-4 hide-scrollbar

                mx-auto max-w-[1220px]
                px-4 scroll-pr-20
              "
            >

              {popularProducts.map((item, i) => (
                <div key={i} className="flex-shrink-0">
                  <ProductCard item={item} />
                </div>
              ))}


              <Link
                to="/shop?sort=popular"
                className="
                  flex-shrink-0

                  bg-black text-white rounded-3xl

                   w-[180px] sm:w-[200px] lg:w-[220px]

                  flex items-center justify-center
                  text-lg font-semibold

                  hover:bg-gray-900 transition
                "
              >
                Explore More →
              </Link>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default PopularProducts;



/* ================= PRODUCT CARD ================= */

const ProductCard = ({ item }) => (

  <div className="
    bg-white rounded-3xl overflow-hidden
    border shadow-sm

     w-[180px] sm:w-[200px] lg:w-[220px]

    hover:shadow-xl hover:-translate-y-1
    transition
  ">

    <Link
      to={`/products/${item._id}`}
      
      className="block overflow-hidden group"
    >

      <img
        src={item?.thumbnail?.url}
        alt="product"
        className="
          aspect-[3/4] w-full object-cover
          transition-transform duration-500
          group-hover:scale-110
        "
      />

    </Link>


    <div className="p-3 lg:p-4">

      <p className="text-xs uppercase text-gray-500">
        {item.category}
      </p>

      <p className="mt-1 font-semibold text-sm lg:text-base line-clamp-2">
        {item.title}
      </p>


      <div className="flex gap-3 mt-2">

        <span className="font-semibold">
          ₹{item.price}
        </span>

        <span className="text-xs line-through text-gray-400">
          ₹{item.mrp}
        </span>

      </div>

    </div>

  </div>
);