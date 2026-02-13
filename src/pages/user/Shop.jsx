import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FilterIcon,
  ArrowNextIcon,
  ArrowDownIcon,
  TickIcon,
} from "../../icons";
import { Range } from "react-range";
import { useParams } from "react-router-dom";
import api from "../../config/apiUser";
import { Link } from "react-router-dom";
import useScrollToTop from "../../hooks/useScrollToTop"

function Shop() {
  const isMobileOpen = useSelector((state) => state.theme.isMobileOpen);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { slug } = useParams();
  const [products, setProducts] = useState([]);

  // current slected filters state
  const [priceRange, setPriceRange] = useState([20, 80]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState({
    price: false,
    color: false,
    size: false,
    dressStyle: false,
  });

  // filter values;
  const [filterColors, setFilterColors] = useState([
    { id: "red", color: "bg-red-500" },
    { id: "blue", color: "bg-blue-500" },
    { id: "green", color: "bg-green-500" },
    { id: "yellow", color: "bg-yellow-500" },
    { id: "orange", color: "bg-orange-500" },
    { id: "white", color: "bg-white" },
    { id: "black", color: "bg-black" },
  ]);
  const [filterSize, setFilterSize] = useState([
    { id: "2xs", size: "2X-Small" },
    { id: "xs", size: "X-Small" },
    { id: "sm", size: "Small" },
    { id: "md", size: "Medium" },
    { id: "lg", size: "Large" },
    { id: "xl", size: "X-Large" },
    { id: "2xl", size: "2X-Large" },
    { id: "3xl", size: "3X-Large" },
    { id: "4xl", size: "4X-Large" },
  ]);

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
    // console.log(isFilterOpen)
  };

  const toggleColor = (id) => {
    setSelectedColors((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };
  const toggleSize = (id) => {
    setSelectedSize((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const getProducts = async () => {
    try {
      const res = await api.get(`products/${slug}/list`);
      console.log("products resposne slug", res.data);
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error fething products", error);
    }
  }

  useEffect(() => {
    getProducts();
  }, [slug])

  useScrollToTop();

  return (
    <div className="px-2 lg:px-5 py-10 flex justify-center">
      {/* filter section */}

      <div
        className={`
    fixed inset-0 bg-black/60 flex items-center justify-center z-50
    transition-transform duration-500 ease-in-out
    ${isFilterOpen ? "translate-y-0" : "translate-y-full"}
    lg:translate-y-0 lg:sticky lg:top-20 lg:w-64 lg:h-[80vh] lg:bg-transparent lg:z-0
  `}
        onClick={toggleFilter}
      >
        <div
          className={`
      bg-white rounded-2xl box-border border border-gray-300 p-5 flex flex-col
      w-full h-[80vh]
      ${isFilterOpen ? "fixed bottom-0" : "fixed bottom-[-100%]"}
      lg:relative lg:w-full lg:h-full lg:fixed-auto lg:bottom-auto
    `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scrollable Filters */}
          <div className="flex-1 overflow-y-auto hide-scrollbar pr-1">
            <div className="flex justify-between px-2">
              <span className="text-lg font-medium">Filters</span>
              <FilterIcon className="text-2xl" onClick={toggleFilter} />
            </div>
            <div className="border-b border-b-gray-300 my-4"></div>


            {/* price range */}
            <div className="price-range w-full">
              <div
                onClick={() =>
                  setIsDropdownOpen({
                    ...isDropdownOpen,
                    price: !isDropdownOpen.price,
                  })
                }
                className="flex justify-between px-2 cursor-pointer "
              >
                <span className="text-lg font-medium">Price</span>
                <ArrowDownIcon
                  className={`text-xl ${isDropdownOpen.price ? "rotate-180" : ""
                    }`}
                />
              </div>
              {isDropdownOpen.price && (
                <div className="p-5">
                  <Range
                    step={1}
                    min={0}
                    max={100}
                    values={priceRange}
                    onChange={(priceRange) => setPriceRange(priceRange)}
                    renderTrack={({ props, children }) => (
                      <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        className="h-1 w-full bg-gray-300 rounded-lg relative"
                        ref={props.ref}
                      >
                        <div
                          className="absolute bg-black h-1 rounded-lg"
                          style={{
                            left: `${(priceRange[0] / 100) * 100}%`,
                            width: `${((priceRange[1] - priceRange[0]) / 100) * 100
                              }%`,
                          }}
                        />
                        {children}
                      </div>
                    )}
                    renderThumb={({ props, index }) => {
                      const { key, ...restProps } = props;
                      return (
                        <div
                          key={key}
                          {...restProps}
                          className="h-5 w-5 rounded-full bg-black shadow relative flex items-center justify-center"
                          style={{
                            zIndex: index === 1 ? 2 : 1,
                            ...restProps.style,
                          }}
                        >
                          <div className="absolute top-7 text-xs text-black font-medium">
                            {priceRange[index]}
                          </div>
                        </div>
                      );
                    }}
                  />
                </div>
              )}
            </div>

            <div className="border-b border-b-gray-300 mt-8 mb-4"></div>

            {/* color filter */}
            <div className="color-filters">
              <div
                onClick={() =>
                  setIsDropdownOpen({
                    ...isDropdownOpen,
                    color: !isDropdownOpen.color,
                  })
                }
                className="flex justify-between px-2 cursor-pointer "
              >
                <span className="text-lg font-medium">Color</span>
                <ArrowDownIcon
                  className={`text-xl ${isDropdownOpen.color ? "rotate-180" : ""
                    }`}
                />
              </div>
              {isDropdownOpen.color && (
                <div className="p-5 flex gap-2 flex-wrap">
                  {filterColors.map(({ id, color }) => (
                    <div
                      key={id}
                      onClick={() => {
                        toggleColor(id);
                      }}
                      className={`h-8 w-8 flex justify-center items-center rounded-full cursor-pointer border-black/40 border ${color}`}
                    >
                      {selectedColors.includes(id) && (
                        <TickIcon className="text-white" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-b border-b-gray-300 my-4"></div>

            {/* size filters */}
            <div className="size-filter">
              <div
                onClick={() =>
                  setIsDropdownOpen({
                    ...isDropdownOpen,
                    size: !isDropdownOpen.size,
                  })
                }
                className="flex justify-between px-2 cursor-pointer "
              >
                <span className="text-lg font-medium">Size</span>
                <ArrowDownIcon
                  className={`text-xl ${isDropdownOpen.size ? "rotate-180" : ""
                    }`}
                />
              </div>
              {isDropdownOpen.size && (
                <div className="flex flex-wrap gap-2 py-5">
                  {filterSize.map(({ id, size }) => (
                    <div
                      key={id}
                      onClick={() => toggleSize(id)}
                      className={`py-1 px-3 rounded-full cursor-pointer ${selectedSize.includes(id)
                        ? "bg-black text-white"
                        : "bg-gray-300/70 text-black"
                        }`}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-b border-b-gray-300 my-4"></div>

            {/* dress style */}
            <div className="dress-style-filter">
              <div
                onClick={() =>
                  setIsDropdownOpen({
                    ...isDropdownOpen,
                    dressStyle: !isDropdownOpen.dressStyle,
                  })
                }
                className="flex justify-between px-2 cursor-pointer "
              >
                <span className="text-lg font-medium">Dress Style</span>
                <ArrowDownIcon
                  className={`text-xl ${isDropdownOpen.dressStyle ? "rotate-180" : ""
                    }`}
                />
              </div>
              {isDropdownOpen.dressStyle && (
                <div className="text-gray-500">
                  {["Casual", "Formal", "Party", "Gym"].map((item) => (
                    <div
                      key={item}
                      className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
                    >
                      <span>{item}</span>
                      <ArrowNextIcon className="text-xl fill-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fixed Apply Button */}
          <div className="mt-4">
            <button className="bg-black rounded-full py-2 text-white w-full cursor-pointer">
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* product section */}
      <div className="products flex-1 px-2 ">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-3xl font-medium">Casual</h2>
          <div className="flex gap-3">
            <p className="text-gray-500">Showing 1-10 of 100 Products</p>
            {isMobileOpen ? (
              <FilterIcon className="text-2xl" onClick={toggleFilter} />
            ) : (
              <div className="flex items-center">
                <span className="text-gray-500">Sort by: &nbsp;</span> Most
                Popular <ArrowDownIcon className="text-lg" />
              </div>
            )}
          </div>
        </div>
        {/* products */}
        <div className="grid grid-cols-12">
          {products && products.map((item, i) => (
            <div key={i} className="col-span-6 md:col-span-3 bg-white rounded-2xl cursor-pointer p-2 group">
              <Link to={`/products/${item._id}`}>
                <img
                  className="aspect-[14/16] object-cover rounded-2xl w-full group-hover:scale-105 duration-150"
                  src={item.thumbnail.url}
                  alt="product"
                />
                <div className="mt-2">
                  <p className="text-sm text-gray-400">{item.category}</p>
                  <p className="text-lg font-medium">{item.title}</p>
                  <div className="flex gap-2 items-center">
                    <p className="text-md font-semibold">₹ {item.price}</p>
                    <p className="text-sm line-through">₹ {item.mrp}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;
