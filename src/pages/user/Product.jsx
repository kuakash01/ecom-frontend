import Badge from "../../components/common/ui/badge/Badge";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../config/axios";
import ProductSkeleton from "../../components/user/product/ProductSkeleton";
import useScrollToTop from "../../hooks/useScrollToTop";
import { useSelector, useDispatch } from "react-redux";
import { setIsAuthModalOpen } from "../../redux/userSlice";


function Product() {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);

  const [productDetail, setProductDetail] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedColor, setSelectedColor] = useState(searchParams.get("color") || "");
  const [selectedSize, setSelectedSize] = useState("");

  const { productId } = useParams();

  // product details
  const [currentGallery, setCurrentGallery] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [currentVariant, setCurrentVariant] = useState(null);
  const [allVariantOfAColor, setAllVariantOfAColor] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleColorChange = (colorName) => {
    setSearchParams({ color: colorName });
    setSelectedColor(colorName);
  };

  const getProductDetails = async () => {
    try {
      const response = await api.get(`/products/${productId}`);
      setProductDetail(response.data.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const getColorGallery = async (productId, colorId) => {
    try {
      const response = await api.get(
        `/products/${productId}/color-gallery/${colorId}`
      );
      const gallery = response.data.data.gallery;
      setMainImage(gallery.length > 0 ? gallery[0] : null);
      setCurrentGallery(gallery);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMainImage("image");
        setCurrentGallery([{ url: null, public_id: "image" }]);
      } else {
        console.error("Error fetching color gallery:", error);
      }
    }
  };

  const getColorId = (selectedColor, allColors) => {
    let colorId = "";
    allColors.forEach((cg) => {
      if (cg.colorName.toLowerCase() === selectedColor.toLowerCase()) {
        colorId = cg._id;
      }
    });
    return colorId;
  };

  const findVariantsByColor = (colorId, variants) => {
    return variants.filter((v) => v.color._id.toString() === colorId.toString());
  };

  // First fetch product
  useEffect(() => {
    getProductDetails();
  }, [productId]);

  // Handle product detail load
  useEffect(() => {
    if (!productDetail) return;

    const normalize = (str) =>
      str ? str.trim().toLowerCase() : "";

    const urlColorRaw = searchParams.get("color");
    const urlColor = normalize(urlColorRaw);

    let finalColor = "";
    let variantsForColor = [];

    // 1. If URL has color, force-select that color
    if (urlColor) {
      const found = productDetail.allColors.find(
        (c) => normalize(c.colorName) === urlColor
      );
      if (found) {
        finalColor = found.colorName;
        const colorId = found._id.toString();
        variantsForColor = productDetail.variants.filter(
          (v) => v.color._id.toString() === colorId
        );
      }
    }

    // 2. If no URL or invalid URL color, auto-select first IN-STOCK color
    if (!finalColor) {
      const validColorObj = productDetail.allColors.find((color) => {
        const list = productDetail.variants.filter(
          (v) =>
            v.color._id.toString() === color._id.toString() &&
            v.quantity > 0
        );
        return list.length > 0;
      });

      finalColor = validColorObj
        ? validColorObj.colorName
        : productDetail.defaultVariant.color.colorName;

      const colorId = getColorId(finalColor, productDetail.allColors);
      variantsForColor = findVariantsByColor(
        colorId,
        productDetail.variants
      );
    }

    setSelectedColor(finalColor);
    setAllVariantOfAColor(variantsForColor);

    const colorId = getColorId(finalColor, productDetail.allColors);
    if (variantsForColor.length > 0) {
      getColorGallery(productId, colorId);
    }

    else {
      setCurrentGallery([{ url: null, public_id: "" }]);
      setMainImage({ url: null, public_id: "" });
    }

    // else {
    //   setCurrentGallery(productDetail.defaultGallery);
    //   setMainImage(productDetail.defaultGallery[0]);
    // }

    setCurrentVariant(null);
    setSelectedSize("");
  }, [productDetail, searchParams]);


  useEffect(() => {
    if (!productDetail || !selectedColor) return;

    const colorId = getColorId(selectedColor, productDetail.allColors);
    const variantsForColor = findVariantsByColor(colorId, productDetail.variants);

    setAllVariantOfAColor(variantsForColor);
    getColorGallery(productId, colorId);

    // Reset size and variant instead of auto-selecting
    setCurrentVariant(null);
    setSelectedSize("");
  }, [selectedColor]);

  // When user selects size manually
  useEffect(() => {
    if (!selectedSize || allVariantOfAColor.length === 0) return;

    const variant = allVariantOfAColor.find(
      (v) =>
        v.size.sizeValue.toLowerCase() ===
        selectedSize.sizeValue.toLowerCase()
    );

    if (variant) setCurrentVariant(variant);
  }, [selectedSize, allVariantOfAColor]);

  // add to cart for guest user
  const addItemToCartGuest = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(
      item => item.productId === productId && item.variantId === currentVariant._id
    );

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({
        productId,
        variantId: currentVariant._id,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cartCount", cart.length);
  }

  // add to cart for login user
  const addItemToCartUser = async () => {
    try {
      const res = await api.post("/cart/items",
        {
          productId,
          variantId: currentVariant._id,
          quantity: 1,
        }
      )
      console.log("Item added to cart successfully", res.data);
    } catch (error) {
      console.error("Error updating cart :", error);
    }
  }

  // add to cart and buy now functionality
  const handleAddToCart = () => {
    if (isAuthenticated)
      addItemToCartUser();
    else addItemToCartGuest();
  }


  // buy now functionality
  const handleBuyNow = () => {
    if (isAuthenticated) {
      const data = {
        productId,
        variantId: currentVariant._id,
        quantity: 1
      };

      // Save backup
      sessionStorage.setItem("checkout_buy_now", JSON.stringify(data));

      // Navigate
      navigate("/checkout?type=BUY_NOW", { state: data });
    }
    else {
      dispatch(setIsAuthModalOpen(true));
    }
  }

  // scroll to top when render page
  useScrollToTop();

  if (!productDetail) {
    return <ProductSkeleton />;
  }

  if (
    productDetail.allColors.find(
      (cg) =>
        cg.colorName.toLowerCase() === selectedColor.toLowerCase()
    ) === undefined &&
    selectedColor !== ""
  ) {
    return (
      <div className="py-10 px-10 text-center">
        Color "{selectedColor}" not available for this product.
        <button
          onClick={() => setSearchParams({})}
          className="underline text-blue-600 cursor-pointer"
        >
          See all colors
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* product details */}
      {productDetail && (
        <div className="grid grid-cols-12 ">
          {/* Left: Image Gallery */}
          <div className="col-span-12 md:col-span-6 flex items-start flex-col-reverse lg:flex-row gap-4 md:sticky top-0 p-5">
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:h-[70vh]">
              {currentGallery?.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`min-w-20 lg:min-w-0 lg:w-20 h-20 rounded-xl border overflow-hidden cursor-pointer transition ${mainImage.url === img.url
                    ? "border-black"
                    : "border-gray-300 hover:border-black"
                    }`}
                >
                  <img
                    src={img.url || `${import.meta.env.VITE_BASE_URL}/images/defaultimage/no-image.jpg`}
                    className="w-full h-full object-cover"
                    alt={`Thumbnail ${idx}`}
                  />
                </div>
              ))}
            </div>

            <div className="flex-1 w-full aspect-square rounded-2xl overflow-hidden bg-white">
              <img
                src={mainImage.url || `${import.meta.env.VITE_BASE_URL}/images/defaultimage/no-image.jpg`}
                alt="Main product"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="col-span-12 md:col-span-6 flex flex-col gap-6 p-5">
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {productDetail.title}
            </h1>


            <div className="flex items-center gap-3">
              {currentVariant ? (
                <>
                  <p className="text-3xl font-bold text-green-700">
                    ₹{currentVariant.price}
                  </p>


                  {currentVariant.mrp && currentVariant.mrp > currentVariant.price && (
                    <>
                      <p className="text-lg line-through text-gray-500">
                        ₹{currentVariant.mrp}
                      </p>

                      <Badge
                        type="discount"><span>{`${Math.round(
                          ((currentVariant.mrp - currentVariant.price) /
                            currentVariant.mrp) *
                          100
                        )}% OFF`}</span></Badge>
                    </>
                  )}
                </>
              ) : (
                <p className="text-lg font-medium text-gray-600">
                  Select a size to view price
                </p>
              )}
            </div>


            {/* Color Selector */}
            {productDetail.allColors?.length > 1 && (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-gray-700">Select Color</p>
                <div className="flex gap-3 flex-wrap">
                  {productDetail.allColors.map((color, idx) => {
                    const isSelected =
                      selectedColor?.toLowerCase() ===
                      color.colorName.toLowerCase();

                    return (
                      <div
                        key={idx}
                        onClick={() => handleColorChange(color.colorName)}
                        className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-200 ${isSelected
                          ? "border-2 border-gray-400 scale-105 shadow-md"
                          : "border border-transparent"
                          } hover:scale-105`}
                        style={{ backgroundColor: color.colorHex }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-gray-700">Select Size</p>
              <div className="flex gap-3 flex-wrap">
                {allVariantOfAColor.map((variant, idx) => {
                  const isSelected =
                    selectedSize &&
                    selectedSize.sizeValue?.toLowerCase() ===
                    variant.size.sizeValue.toLowerCase();
                  const isOutOfStock = variant.quantity === 0;

                  return (
                    <div
                      key={idx}
                      onClick={() =>
                        !isOutOfStock && setSelectedSize(variant.size)
                      }
                      className={`px-4 py-1 rounded-lg border text-sm transition ${isSelected
                        ? "bg-black text-white border-black"
                        : "border-gray-300"
                        } ${!isSelected &&
                        !isOutOfStock &&
                        "hover:border-black hover:bg-gray-100 cursor-pointer"
                        } ${isOutOfStock &&
                        "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                        }`}
                    >
                      {variant.size.sizeValue}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              {currentVariant ? (
                currentVariant.quantity > 0 ? (
                  <>
                    <button onClick={handleBuyNow} className="flex-1 py-3 bg-[#E8D1C5] rounded-full text-[#452829] font-semibold transition hover:opacity-80">
                      Buy Now
                    </button>
                    <button onClick={handleAddToCart} className="flex-1 py-3 bg-black rounded-full text-white font-semibold transition hover:bg-gray-900">
                      Add to Cart
                    </button>
                  </>
                ) : (
                  <div className="w-full py-3 bg-red-200 text-red-700 rounded-full text-center font-semibold tracking-wide">
                    OUT OF STOCK
                  </div>
                )
              ) : allVariantOfAColor.some((v) => v.quantity > 0) ? (
                <div className="w-full py-3 bg-yellow-50 text-yellow-700 rounded-full text-center font-medium tracking-wide border border-yellow-300">
                  Select a size to continue
                </div>
              ) : (
                <div className="w-full py-3 bg-red-200 text-red-700 rounded-full text-center font-semibold tracking-wide">
                  OUT OF STOCK
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Product;



















// import Badge from "../../components/common/ui/badge/Badge";
// import { useLoaderData, useSearchParams, useParams } from "react-router-dom";
// import { useState, useEffect, useRef } from "react";
// import { ChevronUp, ChevronDown } from "lucide-react";
// import api from "../../config/axios";
// import NewArrivals from "../../components/user/product/NewArrivals";
// import useScrollToTop from "../../hooks/useScrollToTop";


// function Product() {
//   const productDetail = useLoaderData();
//   const thumbRef = useRef(null);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [selectedColor, setSelectedColor] = useState(searchParams.get("color") || "");
//   const [selectedSize, setSelectedSize] = useState("");
//   const { productId } = useParams();

//   // product details
//   const [currentGallery, setCurrentGallery] = useState([]);
//   const [mainImage, setMainImage] = useState("");
//   const [currentVariant, setCurrentVariant] = useState(null);
//   const [allVariantOfAColor, setAllVariantOfAColor] = useState([]);

//   const handleColorChange = (colorId) => {
//     setSearchParams({ color: colorId });
//     setSelectedColor(colorId);
//   };


//   const getColorGallery = async (productId, colorId) => {
//     try {
//       const response = await api.get(`/products/${productId}/color-gallery/${colorId}`);
//       let gallery = response.data.data.gallery;
//       setMainImage(gallery.length > 0 ? gallery[0] : "");
//       return setCurrentGallery(gallery);
//     } catch (error) {
//       console.error("Error fetching color gallery:", error);
//     }
//     console.log("productid, colorid", productId, colorId);
//   };

//   const getColorId = (selectedColor, allColors) => {
//     let colorId = "";
//     allColors.forEach(cg => {
//       if (cg.colorName.toLowerCase() === selectedColor.toLowerCase()) {
//         colorId = cg._id;
//       }
//     });
//     return colorId;
//   }


//   const findVariantsByColor = (colorId, variants) => {
//     let vaiant = variants
//       .filter(v => v.color._id.toString() === colorId.toString())
//     console.log("vaiant of color", colorId, vaiant);
//     return vaiant;
//   }

//   const setProductDetails = () => {
//     // set details based on selected color
//     if (selectedColor && productDetail.allColors.find(cg => cg.colorName.toLowerCase() === selectedColor.toLowerCase())) {
//       getColorGallery(productId, getColorId(selectedColor, productDetail.allColors));

//       // getVariantByColor(selectedColor);
//     }

//     // set default details if no color selected
//     else {
//       setCurrentGallery(productDetail.defaultGallery);
//       setCurrentVariant(productDetail.defaultVariant);
//       setMainImage(productDetail.defaultGallery.length > 0 ? productDetail.defaultGallery[0] : "");
//       setAllVariantOfAColor(findVariantsByColor(productDetail.defaultVariant.color._id, productDetail.variants));


//     }
//     setSelectedColor(searchParams.get("color") || productDetail.defaultVariant.color.colorName);
//   }


//   useEffect(() => {
//     if (!selectedColor) return;

//     const variantsForColor = findVariantsByColor(
//       getColorId(selectedColor, productDetail.allColors),
//       productDetail.variants
//     );

//     setAllVariantOfAColor(variantsForColor);

//     // Set default variant (first one) for this color
//     if (variantsForColor.length > 0) {
//       setCurrentVariant(variantsForColor[0]);
//       setSelectedSize(variantsForColor[0].size); // set default size
//     }
//   }, [selectedColor, productDetail]);

//   useEffect(() => {
//     if (!selectedSize || allVariantOfAColor.length === 0) return;

//     const variant = allVariantOfAColor.find(
//       (v) => v.size.sizeValue.toLowerCase() === selectedSize.sizeValue.toLowerCase()
//     );

//     if (variant) setCurrentVariant(variant);
//   }, [selectedSize, allVariantOfAColor]);



//   useEffect(() => {
//     setProductDetails();
//     console.log("selected color changed", selectedColor);
//   }, [productDetail, searchParams]);

//   useScrollToTop(); // scroll to top on component load

//   if (!productDetail) {
//     return <div>Loading...</div>;
//   }
//   else if (productDetail.allColors.find(cg => cg.colorName.toLowerCase() === selectedColor.toLowerCase()) === undefined && selectedColor !== "") {
//     return <div className="py-10 px-10 text-center">Color "{selectedColor}" not available for this product. <button onClick={() => setSearchParams({})} className="underline text-blue-600 cursor-pointer" >See all colors</button></div >
//   }
//   return (
//     <div className="py-2  px-2 lg:px-10">
//       {/* product details */}
//       {productDetail && <div className="grid grid-cols-12 ">
//         <div className="col-span-12 lg:col-span-6 grid grid-cols-12 gap-2 p-0 lg:p-10 h-full">
//           <div className="col-span-12 lg:col-span-3 flex flex-row md:flex-col gap-2 order-2 lg:order-1 overflow-auto md:h-[65vh] w-full">
//             {currentGallery?.map((img, idx) => (
//               <div
//                 key={idx}
//                 className={`min-w-32 md:min-w-full cursor-pointer rounded-2xl overflow-hidden border  ${mainImage.url === img.url ? "border-black " : "border-gray-200"}`}
//                 onClick={() => setMainImage(img)}
//               >
//                 <img
//                   className={`object-cover aspect-square  transition duration-150 hover:scale-105 `}
//                   src={img.url}
//                   alt={`Thumbnail ${idx}`}
//                 />
//               </div>
//             ))}
//           </div>



//           <div className="col-span-12 lg:col-span-9 order-1 lg:order-2">
//             <img
//               src={mainImage ? mainImage.url : productDetail.thumbnail.url}
//               alt="Main product"
//               className="w-full h-auto object-cover shadow aspect-square rounded-2xl"
//             />
//           </div>
//         </div>

//         <div className="col-span-12 lg:col-span-6 flex flex-col justify-between p-4 lg:p-10 space-y-6">
//           {/* Product Title */}
//           <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{productDetail.title}</h1>

//           {/* Price & Discount */}
//           <div className="flex items-center gap-4">
//             <p className="text-2xl font-semibold text-black">₹{currentVariant?.price}</p>
//             {currentVariant?.mrp && (
//               <p className="text-lg text-gray-400 line-through">₹{currentVariant?.mrp}</p>
//             )}
//             <Badge className="bg-red-100 text-red-600 px-2 py-1 rounded">-40%</Badge>
//           </div>

//           {/* Product Description */}
//           {/* Uncomment if needed */}
//           {/* <p className="text-gray-700">{productDetail.description}</p> */}

//           <div className="border-b border-gray-300"></div>

//           {/* Color Selector */}
//           <div>
//             {productDetail.allColors.length > 1 && (
//               <div>
//                 <p className="pb-2 text-sm font-medium text-gray-500">Select Color</p>
//                 <div className="flex gap-3">
//                   {productDetail.allColors.map((color, idx) => (
//                     <div
//                       key={idx}
//                       onClick={() => handleColorChange(color.colorName)}
//                       className={`cursor-pointer px-3 py-1 rounded-full border transition-all duration-200 ${selectedColor.toLowerCase() === color.colorName.toLowerCase()
//                         ? "border-blue-500 bg-blue-50 text-blue-600 font-semibold shadow-md"
//                         : "border-gray-200 hover:border-gray-400 hover:bg-gray-100"
//                         }`}
//                     >
//                       {color.colorName}
//                     </div>
//                   ))}
//                 </div>
//                 <div className="border-b border-gray-300"></div>
//               </div>
//             )}

//           </div>


//           {/* Size Selector */}
//           <div>
//             <p className="pb-2 text-sm font-medium text-gray-500">Select Size</p>
//             <div className="flex gap-3">
//               {allVariantOfAColor.map((variant, idx) => {
//                 const isSelected = currentVariant?.size.sizeValue.toLowerCase() === variant.size.sizeValue.toLowerCase();
//                 const isOutOfStock = variant.quantity === 0;

//                 return (
//                   <div
//                     key={idx}
//                     onClick={() => !isOutOfStock && setSelectedSize(variant.size)}
//                     className={`cursor-pointer px-3 py-1 rounded-full border transition-all duration-200
//         ${isSelected ? "border-blue-500 bg-blue-50 text-blue-600 font-semibold shadow-md" : ""}
//         ${!isSelected && !isOutOfStock ? "border-gray-200 hover:border-gray-400 hover:bg-gray-100" : ""}
//         ${isOutOfStock ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
//       `}
//                   >
//                     {variant.size.sizeName} {isOutOfStock && "(Out of Stock)"}
//                   </div>
//                 );
//               })}


//             </div>
//           </div>

//           <div className="border-b border-gray-300"></div>

//           {/* Quantity + Add to Cart */}
//           <div className="flex flex-wrap items-center gap-4">
//             <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
//               <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-all">-</button>
//               <span className="px-6 py-2">{1}</span>
//               <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-all">+</button>
//             </div>
//             <button className="flex-1 py-3 px-6 bg-black text-white font-semibold rounded-full hover:bg-gray-900 transition-colors">
//               Add to Cart
//             </button>
//           </div>
//         </div>


//       </div>}
//       {/* product reviews */}
//       <div className="">
//         <div className="grid grid-cols-3">
//           <span className="text-center p-3 border-b border-b-brand-200/60">
//             Product Details
//           </span>
//           <span className="text-center p-3 border-b-4 border-black/60">
//             Rating & Reviews
//           </span>
//           <span className="text-center p-3 border-b border-b-brand-200/60">
//             FAQs
//           </span>
//         </div>
//         <div className="flex justify-between my-5">
//           <div className="space-x-2">
//             <span className="text-xl font-bold">All Reviews</span>
//             <span>(562)</span>
//           </div>
//           <div className="flex gap-3">
//             <div className="py-2 px-5 bg-gray-200 rounded-full">f</div>
//             <div className="py-2 px-5 bg-gray-200 rounded-full">Latest </div>
//             <div className="py-2 px-5 bg-black text-white rounded-full">
//               Write a Review
//             </div>
//           </div>
//         </div>

//         <div className="m-10">
//           <div className="grid grid-cols-12 gap-4 py-5">
//             <div className="col-span-12 lg:col-span-6 space-y-3 border border-gray-200 p-5 rounded-xl">
//               <div>⭐️⭐️⭐️⭐️⭐️</div>
//               <p className="text-md font-bold">name</p>
//               <p>
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
//                 ut illo, eveniet minus ad possimus ullam aspernatur ab porro
//                 deserunt!
//               </p>
//               <p>date</p>
//             </div>
//             <div className="col-span-12 lg:col-span-6 space-y-3 border border-gray-200 p-5 rounded-xl">
//               <div>⭐️⭐️⭐️⭐️⭐️</div>
//               <p className="text-md font-bold">name</p>
//               <p>
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
//                 ut illo, eveniet minus ad possimus ullam aspernatur ab porro
//                 deserunt!
//               </p>
//               <p>date</p>
//             </div>
//             <div className="col-span-12 lg:col-span-6 space-y-3 border border-gray-200 p-5 rounded-xl">
//               <div>⭐️⭐️⭐️⭐️⭐️</div>
//               <p className="text-md font-bold">name</p>
//               <p>
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
//                 ut illo, eveniet minus ad possimus ullam aspernatur ab porro
//                 deserunt!
//               </p>
//               <p>date</p>
//             </div>
//             <div className="col-span-12 lg:col-span-6 space-y-3 border border-gray-200 p-5 rounded-xl">
//               <div>⭐️⭐️⭐️⭐️⭐️</div>
//               <p className="text-md font-bold">name</p>
//               <p>
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
//                 ut illo, eveniet minus ad possimus ullam aspernatur ab porro
//                 deserunt!
//               </p>
//               <p>date</p>
//             </div>
//             <div className="col-span-12 lg:col-span-6 space-y-3 border border-gray-200 p-5 rounded-xl">
//               <div>⭐️⭐️⭐️⭐️⭐️</div>
//               <p className="text-md font-bold">name</p>
//               <p>
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
//                 ut illo, eveniet minus ad possimus ullam aspernatur ab porro
//                 deserunt!
//               </p>
//               <p>date</p>
//             </div>
//             <div className="col-span-12 lg:col-span-6 space-y-3 border border-gray-200 p-5 rounded-xl">
//               <div>⭐️⭐️⭐️⭐️⭐️</div>
//               <p className="text-md font-bold">name</p>
//               <p>
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
//                 ut illo, eveniet minus ad possimus ullam aspernatur ab porro
//                 deserunt!
//               </p>
//               <p>date</p>
//             </div>
//           </div>
//           <button className="py-2 px-10 block border mx-auto border-gray-200 rounded-full">
//             Load More Reviews
//           </button>
//         </div>

//         <div className=" my-6  rounded-lg ">
//           <NewArrivals />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Product;









