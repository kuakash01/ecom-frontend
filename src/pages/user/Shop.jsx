import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FilterIcon, ArrowDownIcon } from "../../icons";
import { Range } from "react-range";
import { useParams, Link, useSearchParams } from "react-router-dom";
import api from "../../config/apiUser";
import useScrollToTop from "../../hooks/useScrollToTop";
import ProductCard from "../../components/user/product/ProductCard";

function Shop() {

  /* ================= CONSTANTS ================= */

  const MIN_PRICE = 0;
  const MAX_PRICE = 5000;


  /* ================= STATES ================= */

  const isMobileOpen = useSelector((state) => state.theme.isMobileOpen);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState(null);
  const [products, setProducts] = useState([]);

  const [params, setParams] = useSearchParams();

  const { slug } = useParams();


  /* Filters */

  const [priceRange, setPriceRange] = useState([
    Number(params.get("min")) || MIN_PRICE,
    Number(params.get("max")) || MAX_PRICE,
  ]);

  const [selectedColors, setSelectedColors] =
    useState(params.get("color")?.split(",") || []);

  const [selectedSize, setSelectedSize] =
    useState(params.get("size")?.split(",") || []);

  const [style, setStyle] = useState(params.get("style") || "");


  const [isDropdownOpen, setIsDropdownOpen] = useState({
    price: true,
    color: true,
    size: true,
    dressStyle: true,
  });



  /* ================= SCROLL LOCK ================= */

  useEffect(() => {

    if (isFilterOpen && isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };

  }, [isFilterOpen, isMobileOpen]);



  /* ================= HELPERS ================= */

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };


  const getColorName = (id) => {
    return filters?.colors.find((c) => c._id === id)?.name || "";
  };


  const getSizeName = (id) => {
    return filters?.sizes.find((s) => s._id === id)?.name || "";
  };



  /* ================= FILTER ACTIONS ================= */

  const toggleColor = (id) => {
    setSelectedColors((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id]
    );
  };


  const toggleSize = (id) => {
    setSelectedSize((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id]
    );
  };



  /* ================= APPLY FILTERS ================= */

  const applyFilters = () => {

    const query = {};

    if (
      priceRange[0] !== filters?.minPrice ||
      priceRange[1] !== filters?.maxPrice
    ) {
      query.min = priceRange[0];
      query.max = priceRange[1];
    }

    if (selectedColors.length)
      query.color = selectedColors.join(",");

    if (selectedSize.length)
      query.size = selectedSize.join(",");

    if (style)
      query.style = style;

    setParams(query);

    // ✅ Auto close on mobile
    if (isMobileOpen) {
      setIsFilterOpen(false);
    }
  };



  /* ================= CLEAR FILTERS ================= */

  const clearFilters = () => {

    setSelectedColors([]);
    setSelectedSize([]);
    setStyle("");

    setPriceRange([
      filters?.minPrice || MIN_PRICE,
      filters?.maxPrice || MAX_PRICE,
    ]);

    setParams({});

    if (isMobileOpen) {
      setIsFilterOpen(false);
    }
  };



  /* ================= TAG REMOVE (AUTO APPLY) ================= */

  const removeColor = (id) => {

    const updated = selectedColors.filter((c) => c !== id);
    setSelectedColors(updated);

    const query = Object.fromEntries([...params]);

    if (updated.length) {
      query.color = updated.join(",");
    } else {
      delete query.color;
    }

    setParams(query);
  };


  const removeSize = (id) => {

    const updated = selectedSize.filter((s) => s !== id);
    setSelectedSize(updated);

    const query = Object.fromEntries([...params]);

    if (updated.length) {
      query.size = updated.join(",");
    } else {
      delete query.size;
    }

    setParams(query);
  };



  /* ================= API ================= */

  const getFilters = async () => {

    try {

      const res = await api.get(`/products/${slug}/filters`);

      setFilters(res.data.filters);

      if (res.data.filters) {
        setPriceRange([
          res.data.filters.minPrice,
          res.data.filters.maxPrice,
        ]);
      }

    } catch (err) {
      console.log(err);
    }
  };


  const getProducts = async () => {

    try {

      const query = Object.fromEntries([...params]);

      const res = await api.get(
        `/products/${slug}/list`,
        { params: query }
      );

      setProducts(res.data.products);

    } catch (err) {
      console.log(err);
    }
  };



  /* ================= EFFECTS ================= */

  useEffect(() => {
    getFilters();
    getProducts();
  }, [slug, params]);


  useScrollToTop();



  /* ================= COUNT ================= */

  const activeFilterCount =
    selectedColors.length +
    selectedSize.length +
    (style ? 1 : 0);



  /* ======================================================= */

  return (

    <div className="bg-gray-50 min-h-screen">

      <div className="px-4 lg:px-8 max-w-[1400px] mx-auto flex justify-center">


        {/* ================= OVERLAY ================= */}

        <div
          className={`
            fixed inset-0 bg-black/50 z-10

            transition-all duration-300

            ${isFilterOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible"}

            lg:hidden
          `}
          onClick={() => setIsFilterOpen(false)}
        />



        {/* ================= FILTER SHEET ================= */}

        <div
          className={`
            fixed inset-0 z-20 
            flex items-end justify-center

            transition-all duration-300

            ${isFilterOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible"}

            lg:opacity-100 lg:visible
            lg:relative lg:top-20 lg:w-72 lg:h-[80vh]
          `}
        >


          <div
            className={`
              bg-white/95 backdrop-blur-lg
              rounded-t-3xl lg:rounded-2xl
              shadow-2xl
              border border-gray-200

              p-6 flex flex-col
              w-full h-[80vh]

              transform transition-transform duration-300 ease-in-out

              ${isFilterOpen
                ? "translate-y-0"
                : "translate-y-full"}

              lg:translate-y-0 lg:h-full
            `}
            onClick={(e) => e.stopPropagation()}
          >


            {/* ================= HEADER ================= */}

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-xl font-semibold">
                Filters
              </h2>

              <button
                onClick={toggleFilter}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <FilterIcon className="text-xl" />
              </button>

            </div>



            {/* ================= SCROLL ================= */}

            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-5 pr-1">


              {/* PRICE */}

              <FilterCard
                title="Price"
                open={isDropdownOpen.price}
                onToggle={() =>
                  setIsDropdownOpen({
                    ...isDropdownOpen,
                    price: !isDropdownOpen.price,
                  })
                }
              >

                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>

                <Range
                  step={1}
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  values={priceRange}
                  onChange={setPriceRange}

                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="h-1 bg-gray-300 rounded-full relative"
                    >

                      <div
                        className="absolute h-1 bg-black rounded-full"
                        style={{
                          left: `${(priceRange[0] / MAX_PRICE) * 100}%`,
                          width: `${((priceRange[1] - priceRange[0]) / MAX_PRICE) * 100}%`,
                        }}
                      />

                      {children}

                    </div>
                  )}

                  renderThumb={({ props }) => (
                    <div
                      {...props}
                      className="h-5 w-5 bg-black rounded-full shadow"
                    />
                  )}
                />

              </FilterCard>



              {/* COLOR */}

              <FilterCard
                title="Color"
                open={isDropdownOpen.color}
                onToggle={() =>
                  setIsDropdownOpen({
                    ...isDropdownOpen,
                    color: !isDropdownOpen.color,
                  })
                }
              >

                <div className="flex flex-wrap gap-3">

                  {filters?.colors.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => toggleColor(c._id)}

                      className={`
                        h-9 w-9 rounded-full
                        ring-2 ring-offset-2
                        cursor-pointer
                        transition

                        ${selectedColors.includes(c._id)
                          ? "ring-black scale-110"
                          : "ring-gray-200 hover:ring-gray-400"}
                      `}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}

                </div>

              </FilterCard>



              {/* SIZE */}

              <FilterCard
                title="Size"
                open={isDropdownOpen.size}
                onToggle={() =>
                  setIsDropdownOpen({
                    ...isDropdownOpen,
                    size: !isDropdownOpen.size,
                  })
                }
              >

                <div className="flex flex-wrap gap-2">

                  {filters?.sizes.map((s) => (
                    <div
                      key={s._id}
                      onClick={() => toggleSize(s._id)}

                      className={`
                        px-4 py-2 rounded-full text-sm
                        cursor-pointer transition

                        ${selectedSize.includes(s._id)
                          ? "bg-black text-white shadow"
                          : "bg-white border border-gray-300 hover:border-black"}
                      `}
                    >
                      {s.name}
                    </div>
                  ))}

                </div>

              </FilterCard>



              {/* STYLE */}

              <FilterCard
                title="Dress Style"
                open={isDropdownOpen.dressStyle}
                onToggle={() =>
                  setIsDropdownOpen({
                    ...isDropdownOpen,
                    dressStyle: !isDropdownOpen.dressStyle,
                  })
                }
              >

                <div className="flex flex-wrap gap-2">

                  {filters?.styles.map((s, i) => (
                    <div
                      key={i}
                      onClick={() => setStyle(style === s ? "" : s)}

                      className={`
                        px-4 py-2 rounded-full text-sm border
                        cursor-pointer transition

                        ${style === s
                          ? "bg-black text-white border-black"
                          : "bg-white border-gray-300 hover:border-black"}
                      `}
                    >
                      {s}
                    </div>
                  ))}

                </div>

              </FilterCard>

            </div>



            {/* ================= FOOTER ================= */}

            <div className="pt-4 mt-4 border-t space-y-3">

              <button
                onClick={clearFilters}
                className="w-full text-sm text-gray-500 hover:text-black"
              >
                Clear All
              </button>

              <button
                onClick={applyFilters}
                className="
                  w-full py-3 rounded-full
                  bg-black text-white font-medium
                  shadow-lg hover:shadow-xl
                  transition
                "
              >
                Apply Filters
              </button>

            </div>

          </div>

        </div>



        {/* ================= PRODUCTS ================= */}

        <div className="flex-1 py-6 px-1">


          {/* HEADER */}

          <div className="flex justify-between items-center">

            <div>
              <h1 className="text-2xl font-semibold capitalize">
                {slug}
              </h1>

              <p className="text-sm text-gray-500">
                {products.length} Products
              </p>
            </div>


            {isMobileOpen && (
              <button
                onClick={() => setIsFilterOpen(true)}
                className="
                  relative
                  flex items-center gap-2
                  px-4 py-2
                  bg-black text-white
                  rounded-full shadow
                "
              >
                <FilterIcon />
                Filter

                {activeFilterCount > 0 && (
                  <span className="
                    absolute -top-2 -right-2
                    bg-red-500 text-white
                    text-xs px-2 py-0.5 rounded-full
                  ">
                    {activeFilterCount}
                  </span>
                )}

              </button>
            )}

          </div>



          {/* ACTIVE TAGS */}

          <div className="flex flex-wrap gap-2 mb-6">

            {selectedColors.map((id) => (
              <Tag
                key={id}
                label={getColorName(id)}
                onRemove={() => removeColor(id)}
              />
            ))}

            {selectedSize.map((id) => (
              <Tag
                key={id}
                label={getSizeName(id)}
                onRemove={() => removeSize(id)}
              />
            ))}

            {style && (
              <Tag
                label={style}
                onRemove={() => setStyle("")}
              />
            )}

          </div>



          {/* EMPTY */}

          {products.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No products found
            </div>
          )}



          {/* GRID */}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

            {products.map((item, i) => (
              <ProductCard key={i} item={item} />
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Shop;



/* ================= COMPONENTS ================= */


const FilterCard = ({ title, open, onToggle, children }) => {

  return (
    <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">

      <div
        onClick={onToggle}
        className="flex justify-between items-center cursor-pointer"
      >

        <span className="font-medium">
          {title}
        </span>

        <ArrowDownIcon
          className={`transition ${open ? "rotate-180" : ""}`}
        />

      </div>

      {open && (
        <div className="mt-4">
          {children}
        </div>
      )}

    </div>
  );
};



const Tag = ({ label, onRemove }) => (
  <span
    className="
      flex items-center gap-1
      px-3 py-1.5
      bg-white
      border border-gray-300
      rounded-full
      text-sm
      shadow-sm
    "
  >

    {label}

    <button
      onClick={onRemove}
      className="text-gray-500 hover:text-black"
    >
      ✕
    </button>

  </span>
);




















// import { useState, useRef, useEffect } from "react";
// import { useSelector } from "react-redux";
// import {
//   FilterIcon,
//   ArrowNextIcon,
//   ArrowDownIcon,
//   TickIcon,
// } from "../../icons";
// import { Range } from "react-range";
// import { useParams } from "react-router-dom";
// import api from "../../config/apiUser";
// import { Link } from "react-router-dom";
// import useScrollToTop from "../../hooks/useScrollToTop"
// import { useSearchParams, useNavigate } from "react-router-dom";


// function Shop() {
//   const MIN_PRICE = 0;
//   const MAX_PRICE = 5000;

//   const isMobileOpen = useSelector((state) => state.theme.isMobileOpen);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   const [filters, setFilters] = useState(null);


//   const [params, setParams] = useSearchParams();
//   const navigate = useNavigate();


//   const { slug } = useParams();
//   const [products, setProducts] = useState([]);

//   // current slected filters state
//   const [priceRange, setPriceRange] = useState([
//     Number(params.get("min")) || MIN_PRICE,
//     Number(params.get("max")) || MAX_PRICE
//   ]);

//   const [selectedColors, setSelectedColors] = useState(
//     params.get("color")?.split(",") || []
//   );

//   const [selectedSize, setSelectedSize] = useState(
//     params.get("size")?.split(",") || []
//   );

//   const [style, setStyle] = useState(params.get("style") || "");



//   const [isDropdownOpen, setIsDropdownOpen] = useState({
//     price: false,
//     color: false,
//     size: false,
//     dressStyle: false,
//   });


//   const applyFilters = () => {
//     const query = {};

//     if (
//       priceRange[0] !== filters?.minPrice ||
//       priceRange[1] !== filters?.maxPrice
//     ) {
//       query.min = priceRange[0];
//       query.max = priceRange[1];
//     }


//     if (selectedColors.length)
//       query.color = selectedColors.join(",");

//     if (selectedSize.length)
//       query.size = selectedSize.join(",");

//     if (style) query.style = style;

//     setParams(query);
//   };

//   const clearFilters = () => {
//     setSelectedColors([]);
//     setSelectedSize([]);
//     setStyle("");
//     setPriceRange([
//       filters?.minPrice || MIN_PRICE,
//       filters?.maxPrice || MAX_PRICE
//     ]);

//     setParams({});
//   };


//   const getFilters = async () => {
//     try {
//       const res = await api.get(
//         `/products/${slug}/filters`
//       );
//       console.log("filters data", res.data);
//       setFilters(res.data.filters);

//       // Init price range
//       if (res.data.filters) {
//         setPriceRange([
//           res.data.filters.minPrice,
//           res.data.filters.maxPrice
//         ]);
//       }

//     } catch (err) {
//       console.log(err);
//     }
//   };


//   const getColorName = (id) => {
//     return filters?.colors.find(c => c._id === id)?.name || "";
//   };

//   const getSizeName = (id) => {
//     return filters?.sizes.find(s => s._id === id)?.name || "";
//   };



//   const toggleFilter = () => {
//     setIsFilterOpen((prev) => !prev);
//     // console.log(isFilterOpen)
//   };

//   const toggleColor = (id) => {
//     setSelectedColors((prev) =>
//       prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
//     );
//   };
//   const toggleSize = (id) => {
//     setSelectedSize((prev) =>
//       prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
//     );
//   };

//   const getProducts = async () => {
//     try {
//       const query = Object.fromEntries([...params]);

//       const res = await api.get(`products/${slug}/list`, {
//         params: query
//       });
//       console.log("products", res.data)

//       setProducts(res.data.products);
//     } catch (err) {
//       console.log(err);
//     }
//   };


//   useEffect(() => {
//     getProducts();
//     getFilters();
//   }, [slug, params]);


//   useScrollToTop();

//   return (
//     <div className="px-2 lg:px-5  flex justify-center">
//       {/* filter section */}

//       <div
//         className={`
//     fixed inset-0 bg-black/60 lg:py-6 flex items-center justify-center z-50
//     transition-transform duration-500 ease-in-out
//     ${isFilterOpen ? "translate-y-0" : "translate-y-full"}
//     lg:translate-y-0 lg:sticky lg:top-20 lg:w-64 lg:h-[80vh] lg:bg-transparent lg:z-0
//   `}
//         onClick={toggleFilter}
//       >
//         <div
//           className={`
//       bg-white rounded-2xl box-border border border-gray-300 p-5 flex flex-col
//       w-full h-[80vh]
//       ${isFilterOpen ? "fixed bottom-0" : "fixed bottom-[-100%]"}
//       lg:relative lg:w-full lg:h-full lg:fixed-auto lg:bottom-auto
//     `}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Scrollable Filters */}
//           <div className="flex-1 overflow-y-auto hide-scrollbar pr-1">
//             <div className="flex justify-between px-2">
//               <span className="text-lg font-medium">Filters</span>
//               <FilterIcon className="text-2xl" onClick={toggleFilter} />
//             </div>
//             <div className="border-b border-b-gray-300 my-4"></div>


//             {/* price range */}
//             <div className="price-range w-full">
//               <div
//                 onClick={() =>
//                   setIsDropdownOpen({
//                     ...isDropdownOpen,
//                     price: !isDropdownOpen.price,
//                   })
//                 }
//                 className="flex justify-between px-2 cursor-pointer "
//               >
//                 <span className="text-lg font-medium">Price</span>
//                 <ArrowDownIcon
//                   className={`text-xl ${isDropdownOpen.price ? "rotate-180" : ""
//                     }`}
//                 />
//               </div>
//               {isDropdownOpen.price && (
//                 <div className="p-5">
//                   <div className="flex justify-between text-sm mb-2">
//                     <span>₹{priceRange[0]}</span>
//                     <span>₹{priceRange[1]}</span>
//                   </div>

//                   <Range
//                     step={1}
//                     min={MIN_PRICE}
//                     max={MAX_PRICE}
//                     values={priceRange}
//                     onChange={(priceRange) => setPriceRange(priceRange)}
//                     renderTrack={({ props, children }) => (
//                       <div
//                         onMouseDown={props.onMouseDown}
//                         onTouchStart={props.onTouchStart}
//                         className="h-1 w-full bg-gray-300 rounded-lg relative"
//                         ref={props.ref}
//                       >
//                         <div
//                           className="absolute bg-black h-1 rounded-lg"
//                           style={{
//                             left: `${(priceRange[0] / MAX_PRICE) * 100}%`,
//                             width: `${((priceRange[1] - priceRange[0]) / MAX_PRICE) * 100
//                               }%`,
//                           }}
//                         />
//                         {children}
//                       </div>
//                     )}
//                     renderThumb={({ props, index }) => {
//                       const { key, ...restProps } = props;
//                       return (
//                         <div
//                           key={key}
//                           {...restProps}
//                           className="h-5 w-5 rounded-full bg-black shadow relative flex items-center justify-center"
//                           style={{
//                             zIndex: index === 1 ? 2 : 1,
//                             ...restProps.style,
//                           }}
//                         >

//                         </div>
//                       );
//                     }}
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="border-b border-b-gray-300 mt-8 mb-4"></div>

//             {/* color filter */}
//             <div className="color-filters">
//               <div
//                 onClick={() =>
//                   setIsDropdownOpen({
//                     ...isDropdownOpen,
//                     color: !isDropdownOpen.color,
//                   })
//                 }
//                 className="flex justify-between px-2 cursor-pointer "
//               >
//                 <span className="text-lg font-medium">Color</span>
//                 <ArrowDownIcon
//                   className={`text-xl ${isDropdownOpen.color ? "rotate-180" : ""
//                     }`}
//                 />
//               </div>
//               {isDropdownOpen.color && (
//                 <div className="p-5 flex gap-2 flex-wrap">
//                   {filters?.colors.map((c) => (
//                     <div
//                       key={c._id}
//                       onClick={() => toggleColor(c._id)}
//                       className={`
//   h-8 w-8 rounded-full border-2
//   ${selectedColors.includes(c._id)
//                           ? "border-black scale-110"
//                           : "border-gray-300"}
// `}

//                       style={{ backgroundColor: c.hex }}
//                     />
//                   ))}

//                 </div>
//               )}
//             </div>

//             <div className="border-b border-b-gray-300 my-4"></div>

//             {/* size filters */}
//             <div className="size-filter">
//               <div
//                 onClick={() =>
//                   setIsDropdownOpen({
//                     ...isDropdownOpen,
//                     size: !isDropdownOpen.size,
//                   })
//                 }
//                 className="flex justify-between px-2 cursor-pointer "
//               >
//                 <span className="text-lg font-medium">Size</span>
//                 <ArrowDownIcon
//                   className={`text-xl ${isDropdownOpen.size ? "rotate-180" : ""
//                     }`}
//                 />
//               </div>
//               {isDropdownOpen.size && (
//                 <div className="flex flex-wrap gap-2 py-5">
//                   {filters?.sizes.map((s) => (
//                     <div
//                       key={s._id}
//                       onClick={() => toggleSize(s._id)}
//                       className={`px-3 py-1 rounded-full ${selectedSize.includes(s._id)
//                         ? "bg-black text-white"
//                         : "bg-gray-200"
//                         }`}
//                     >
//                       {s.name}
//                     </div>
//                   ))}

//                 </div>
//               )}
//             </div>

//             <div className="border-b border-b-gray-300 my-4"></div>

//             {/* dress style */}
//             <div className="dress-style-filter">
//               <div
//                 onClick={() =>
//                   setIsDropdownOpen({
//                     ...isDropdownOpen,
//                     dressStyle: !isDropdownOpen.dressStyle,
//                   })
//                 }
//                 className="flex justify-between px-2 cursor-pointer "
//               >
//                 <span className="text-lg font-medium">Dress Style</span>
//                 <ArrowDownIcon
//                   className={`text-xl ${isDropdownOpen.dressStyle ? "rotate-180" : ""
//                     }`}
//                 />
//               </div>
//               {isDropdownOpen.dressStyle && (
//                 <div className="text-gray-500 flex flex-wrap">
//                   {filters?.styles.map((s, i) => (
//                     <div
//                       key={i}
//                       onClick={() =>
//                         setStyle(style === s ? "" : s)
//                       }
//                       className={`px-3 py-2 rounded-full text-sm cursor-pointer
//     ${style === s
//                           ? "bg-black text-white"
//                           : "bg-gray-100"}
//   `}
//                     >
//                       {s}
//                     </div>

//                   ))}

//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Fixed Apply Button */}
//           <div className="mt-4">
//             <button
//               onClick={clearFilters}
//               className="text-sm text-gray-500 underline"
//             >
//               Clear all
//             </button>

//             <button
//               onClick={applyFilters}
//               className="bg-black rounded-full py-3 text-white w-full
//   hover:bg-gray-900 transition"
//             >
//               Apply Filters
//             </button>

//           </div>
//         </div>
//       </div>


//       <div className="products flex-1 px-2 ">
//         {/* <div className="flex justify-between items-center px-2">
//           <h2 className="text-3xl font-medium">Casual</h2>
//           <div className="flex gap-3">
//             <p className="text-gray-500">Showing 1-10 of 100 Products</p>
//             {isMobileOpen ? (
//               <FilterIcon className="text-2xl" onClick={toggleFilter} />
//             ) : (
//               <div className="flex items-center">
//                 <span className="text-gray-500">Sort by: &nbsp;</span> Most
//                 Popular <ArrowDownIcon className="text-lg" />
//               </div>
//             )}
//           </div>
//         </div> */}

//         <div className="my-3 flex flex-wrap gap-2">
//           {selectedColors.map((id) => (
//             <span
//               key={id}
//               className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-full text-sm"
//             >
//               {getColorName(id)}

//               <button
//                 onClick={() => toggleColor(id)}
//                 className="text-gray-500 hover:text-black"
//               >
//                 ✕
//               </button>
//             </span>
//           ))}

//           {selectedSize.map((id) => (
//             <span
//               key={id}
//               className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-full text-sm"
//             >
//               {getSizeName(id)}

//               <button
//                 onClick={() => toggleSize(id)}
//                 className="text-gray-500 hover:text-black"
//               >
//                 ✕
//               </button>
//             </span>
//           ))}


//           {/* {selectedSize.map((id) => (
//             <span
//               key={id}
//               className="px-3 py-1 bg-gray-200 rounded-full text-sm"
//             >
//               {getSizeName(id)}
//             </span>
//           ))} */}


//           {style && (
//             <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
//               {style}
//             </span>
//           )}
//         </div>

//         {/* products */}
//         <div className="grid grid-cols-12">
//           {products && products.map((item, i) => (
//             // <div key={i} className="col-span-6 md:col-span-3 bg-white rounded-2xl cursor-pointer p-2 group">
//             //   <Link to={`/products/${item._id}`}>
//             //     <img
//             //       className="aspect-[14/16] object-cover rounded-2xl w-full group-hover:scale-105 duration-150"
//             //       src={item?.thumbnail?.url || null}
//             //       alt="product"
//             //     />
//             //     <div className="mt-2">
//             //       <p className="text-sm text-gray-400">{item.category}</p>
//             //       <p className="text-lg font-medium">{item.title}</p>
//             //       <div className="flex gap-2 items-center">
//             //         <p className="text-md font-semibold">₹ {item.price}</p>
//             //         <p className="text-sm line-through">₹ {item.mrp}</p>
//             //       </div>
//             //     </div>
//             //   </Link>
//             // </div>
//             <div
//               key={i}
//               className="col-span-6 md:col-span-3 bg-white rounded-2xl cursor-pointer p-2 group"
//             >
//               {/* Product Link (Default Color) */}
//               <Link to={`/products/${item._id}${item.color && item.size ? `?color=${item.color}&size=${item.size}` : ''}`}>
//                 <img
//                   className="aspect-[14/16] object-cover rounded-2xl w-full group-hover:scale-105 duration-150"
//                   src={item?.thumbnail?.url || null}
//                   alt="product"
//                 />

//                 <div className="mt-2">
//                   <p className="text-sm text-gray-400">{item.category}</p>
//                   <p className="text-lg font-medium">{item.title}</p>

//                   <div className="flex gap-2 items-center">
//                     <p className="text-md font-semibold">₹ {item.price}</p>
//                     <p className="text-sm line-through">₹ {item.mrp}</p>
//                   </div>
//                 </div>
//               </Link>

//               {/* 🎨 Color Swatches */}
//               <div className="flex gap-1 mt-2 ">
//                 {item.allColors?.slice(0, 5).map((c, idx) => {

//                   const dot = (
//                     <span
//                       key={idx}
//                       title={c.name}
//                       className={`w-4 h-4 rounded-full border inline-block ${c.inStock
//                         ? "cursor-pointer hover:scale-110"
//                         : "opacity-30 cursor-not-allowed"
//                         }`}
//                       style={{ backgroundColor: c.colorHex }}
//                     />
//                   );

//                   // If available → wrap with Link
//                   if (c.inStock) {
//                     return (
//                       <Link
//                         key={idx}
//                         to={`/products/${item._id}?color=${c.colorName}`}
//                       >
//                         {dot}
//                       </Link>
//                     );
//                   }

//                   // If not available → normal span
//                   return dot;
//                 })}

//                 {/* +More */}
//                 {item.allColors?.length > 5 && (
//                   <span className="text-xs text-gray-500 ml-1">
//                     +{item.allColors.length - 5}
//                   </span>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       {/* Floating Filter Button (Mobile) */}
//       {isMobileOpen && !isFilterOpen && (
//         <button
//           onClick={toggleFilter}
//           className="
//       fixed bottom-5 right-5
//       bg-black text-white
//       p-4 rounded-full
//       shadow-lg
//       z-40
//       active:scale-95
//       transition
//     "
//         >
//           <FilterIcon className="text-xl text-white" />
//         </button>
//       )}

//     </div>
//   );
// }

// export default Shop;
