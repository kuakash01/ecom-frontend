// import Badge from "../../components/common/ui/badge/Badge";
// import { useSearchParams, useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import api from "../../config/apiUser";
// import ProductSkeleton from "../../components/user/product/ProductSkeleton";
// import useScrollToTop from "../../hooks/useScrollToTop";
// import { useSelector, useDispatch } from "react-redux";
// import { setIsAuthModalOpen, setUserData } from "../../redux/userSlice";

// function Product() {
//   const { isAuthenticated, userData } = useSelector(state => state.user);

//   const { productId } = useParams();
//   const [searchParams, setSearchParams] = useSearchParams();

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   /* ================= STATES ================= */

//   const [productDetail, setProductDetail] = useState(null);

//   const [selectedColor, setSelectedColor] = useState(
//     searchParams.get("color") || ""
//   );

//   const [selectedSize, setSelectedSize] = useState("");

//   const [currentGallery, setCurrentGallery] = useState([]);
//   const [mainImage, setMainImage] = useState(null);

//   const [allVariantOfAColor, setAllVariantOfAColor] = useState([]);
//   const [currentVariant, setCurrentVariant] = useState(null);

//   const [galleryCache, setGalleryCache] = useState({});
//   const [isInitialLoad, setIsInitialLoad] = useState(true);

//   /* ================= HELPERS ================= */

//   const normalize = str => (str ? str.trim().toLowerCase() : "");

//   /* ================= API ================= */

//   const getProductDetails = async () => {
//     try {
//       const res = await api.get(`/products/${productId}`);
//       setProductDetail(res.data.data);
//     } catch (err) {
//       console.error("Product fetch error:", err);
//     }
//   };

//   const getColorGallery = async (colorId) => {
//     try {
//       // Cache first
//       if (galleryCache[colorId]) {
//         const cached = galleryCache[colorId];
//         setCurrentGallery(cached);
//         setMainImage(cached[0] || null);
//         return;
//       }

//       const res = await api.get(
//         `/products/${productId}/color-gallery/${colorId}`
//       );

//       const gallery = res.data.data.gallery || [];

//       setGalleryCache(prev => ({
//         ...prev,
//         [colorId]: gallery
//       }));

//       setCurrentGallery(gallery);
//       setMainImage(gallery[0] || null);

//     } catch (err) {
//       console.error("Gallery error:", err);
//     }
//   };

//   /* ================= COLOR CLICK ================= */

//   const handleColorChange = (colorName) => {
//     setSelectedColor(colorName);

//     // Update URL (replace so back works)
//     setSearchParams(
//       { color: colorName },
//       { replace: true }
//     );
//   };

//   /* ================= FETCH PRODUCT ================= */

//   useEffect(() => {
//     setIsInitialLoad(true);
//     getProductDetails();
//   }, [productId]);

//   /* ================= INITIAL SETUP ================= */

//   useEffect(() => {
//     if (!productDetail) return;

//     const urlColor = normalize(searchParams.get("color"));

//     let finalVariant = null;
//     let finalColor = "";

//     /* 1️⃣ URL priority (NO stock check) */
//     if (urlColor) {
//       const matches = productDetail.variants.filter(
//         v =>
//           normalize(v.color.colorName) === urlColor
//       );

//       if (matches.length) {
//         finalVariant = matches[0];
//         finalColor = matches[0].color.colorName;
//       }
//     }

//     /* 2️⃣ Default */
//     if (!finalVariant) {
//       if (productDetail.defaultVariant) {
//         finalVariant = productDetail.defaultVariant;
//         finalColor =
//           productDetail.defaultVariant.color?.colorName || "";
//       } else {
//         finalVariant = productDetail.variants[0];
//         finalColor = finalVariant.color?.colorName || "";
//       }
//     }

//     if (!finalVariant) return;

//     /* Variants of this color */
//     const colorVariants = productDetail.variants.filter(
//       v =>
//         normalize(v.color.colorName) ===
//         normalize(finalColor)
//     );

//     setSelectedColor(finalColor);
//     setAllVariantOfAColor(colorVariants);
//     setSelectedSize("");
//     setCurrentVariant(null);

//     /* Initial gallery */
//     if (isInitialLoad) {

//       const hasUrlColor = !!searchParams.get("color");

//       // If URL has color → always fetch that gallery
//       if (hasUrlColor) {
//         getColorGallery(finalVariant.color._id);
//       }

//       // Else use backend default
//       else if (productDetail.defaultGallery?.length) {
//         setCurrentGallery(productDetail.defaultGallery);
//         setMainImage(productDetail.defaultGallery[0]);
//       }

//       // Else fallback
//       else {
//         getColorGallery(finalVariant.color._id);
//       }

//       setIsInitialLoad(false);
//     }


//   }, [productDetail, searchParams]);

//   /* ================= FETCH ON COLOR CHANGE ================= */

//   useEffect(() => {
//     if (!productDetail || !selectedColor) return;

//     const colorObj = productDetail.allColors.find(
//       c =>
//         normalize(c.colorName) ===
//         normalize(selectedColor)
//     );

//     if (!colorObj) return;

//     getColorGallery(colorObj._id);

//   }, [selectedColor]);

//   /* ================= AUTO SIZE ================= */

//   useEffect(() => {
//     if (!allVariantOfAColor.length) return;

//     const firstInStock = allVariantOfAColor.find(
//       v => v.quantity > 0
//     );

//     if (firstInStock) {
//       setSelectedSize(firstInStock.size);
//       setCurrentVariant(firstInStock);
//     }

//   }, [allVariantOfAColor]);

//   /* ================= SIZE SELECT ================= */

//   useEffect(() => {
//     if (!selectedSize) return;

//     const variant = allVariantOfAColor.find(
//       v =>
//         normalize(v.size.sizeValue) ===
//         normalize(selectedSize.sizeValue)
//     );

//     if (variant) setCurrentVariant(variant);

//   }, [selectedSize]);

//   /* ================= CART ================= */

//   const addItemToCartGuest = () => {
//     const cart = JSON.parse(localStorage.getItem("cart")) || [];

//     const found = cart.find(
//       i =>
//         i.productId === productId &&
//         i.variantId === currentVariant._id
//     );

//     if (found) found.quantity++;
//     else {
//       cart.push({
//         productId,
//         variantId: currentVariant._id,
//         quantity: 1
//       });
//     }

//     localStorage.setItem("cart", JSON.stringify(cart));

//     const count = cart.reduce((t, i) => t + i.quantity, 0);

//     dispatch(setUserData({ ...userData, cartCount: count }));
//   };

//   const addItemToCartUser = async () => {
//     const res = await api.post("/cart/items", {
//       productId,
//       variantId: currentVariant._id,
//       quantity: 1
//     });

//     dispatch(
//       setUserData({
//         ...userData,
//         cartCount: res.data.data.cartCount
//       })
//     );
//   };

//   const handleAddToCart = () => {
//     if (!currentVariant) return;

//     if (isAuthenticated) addItemToCartUser();
//     else addItemToCartGuest();
//   };

//   const handleBuyNow = () => {
//     if (!isAuthenticated) {
//       dispatch(setIsAuthModalOpen(true));
//       return;
//     }

//     const data = {
//       productId,
//       variantId: currentVariant._id,
//       quantity: 1
//     };

//     sessionStorage.setItem(
//       "checkout_buy_now",
//       JSON.stringify(data)
//     );

//     navigate("/checkout?type=BUY_NOW", { state: data });
//   };

//   useScrollToTop();

//   /* ================= LOADING ================= */

//   if (!productDetail) return <ProductSkeleton />;

//   /* ================= UI ================= */

//   return (
//     <div className="w-full">

//       <div className="grid grid-cols-12">

//         {/* Images */}
//         <div className="col-span-12 md:col-span-6 p-5 flex gap-4">

//           <div className="flex lg:flex-col gap-3">

//             {currentGallery.map((img, i) => (
//               <div
//                 key={i}
//                 onClick={() => setMainImage(img)}
//                 className={`w-20 h-20 border rounded-xl overflow-hidden cursor-pointer
//                 ${mainImage?.url === img.url
//                     ? "border-black"
//                     : "border-gray-300"
//                   }`}
//               >
//                 <img
//                   src={img.url}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             ))}

//           </div>

//           <div className="flex-1 bg-white rounded-2xl overflow-hidden">

//             <img
//               src={
//                 mainImage?.url ||
//                 "/images/defaultimage/no-image.jpg"
//               }
//               className="w-full h-full object-contain"
//             />

//           </div>
//         </div>

//         {/* Info */}
//         <div className="col-span-12 md:col-span-6 p-5 flex flex-col gap-6">

//           <h1 className="text-3xl font-bold">
//             {productDetail.title}
//           </h1>

//           {/* Price */}
//           {currentVariant ? (
//             <div className="flex gap-3 items-center">

//               <p className="text-3xl font-bold text-green-700">
//                 ₹{currentVariant.price}
//               </p>

//               {currentVariant.mrp > currentVariant.price && (
//                 <>
//                   <p className="line-through text-gray-500">
//                     ₹{currentVariant.mrp}
//                   </p>

//                   <Badge type="discount">
//                     {Math.round(
//                       ((currentVariant.mrp -
//                         currentVariant.price) /
//                         currentVariant.mrp) *
//                       100
//                     )}% OFF
//                   </Badge>
//                 </>
//               )}

//             </div>
//           ) : (
//             <p>Select size</p>
//           )}

//           {/* Colors */}
//           <div>
//             <p className="font-medium mb-2">Select Color</p>

//             <div className="flex gap-3 flex-wrap">

//               {productDetail.allColors.map((c, i) => {

//                 const active =
//                   normalize(c.colorName) ===
//                   normalize(selectedColor);

//                 return (
//                   <div
//                     key={i}
//                     onClick={() =>
//                       c.inStock &&
//                       handleColorChange(c.colorName)
//                     }
//                     className={`w-8 h-8 rounded-full border
//                     ${active
//                         ? "border-black scale-110"
//                         : "border-gray-300"
//                       }
//                     ${c.inStock
//                         ? "cursor-pointer"
//                         : "opacity-30"
//                       }`}
//                     style={{
//                       backgroundColor: c.colorHex
//                     }}
//                   />
//                 );
//               })}

//             </div>
//           </div>

//           {/* Sizes */}
//           <div>
//             <p className="font-medium mb-2">Select Size</p>

//             <div className="flex gap-3 flex-wrap">

//               {allVariantOfAColor.map((v, i) => {

//                 const active =
//                   selectedSize?.sizeValue ===
//                   v.size.sizeValue;

//                 return (
//                   <div
//                     key={i}
//                     onClick={() =>
//                       v.quantity > 0 &&
//                       setSelectedSize(v.size)
//                     }
//                     className={`px-4 py-1 border rounded
//                     ${active
//                         ? "bg-black text-white"
//                         : "border-gray-300"
//                       }
//                     ${v.quantity === 0
//                         ? "opacity-40"
//                         : "cursor-pointer"
//                       }`}
//                   >
//                     {v.size.sizeValue}
//                   </div>
//                 );
//               })}

//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-4">

//             <button
//               onClick={handleBuyNow}
//               className="flex-1 bg-[#E8D1C5] py-3 rounded-full"
//             >
//               Buy Now
//             </button>

//             <button
//               onClick={handleAddToCart}
//               className="flex-1 bg-black text-white py-3 rounded-full"
//             >
//               Add To Cart
//             </button>

//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default Product;












import Badge from "../../components/common/ui/badge/Badge";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../config/apiUser";
import ProductSkeleton from "../../components/user/loadingSkeleton/ProductSkeleton";
import useScrollToTop from "../../hooks/useScrollToTop";
import { useSelector, useDispatch } from "react-redux";
import { setIsAuthModalOpen, setUserData } from "../../redux/userSlice";

function Product() {
  /* ================= HELPERS ================= */
  const normalize = str => (str ? str.trim().toLowerCase() : "");


  const { isAuthenticated, userData } = useSelector(state => state.user);

  const { productId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();



  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================= STATES ================= */

  const [productDetail, setProductDetail] = useState(null);

  const [selectedColor, setSelectedColor] = useState(
    searchParams.get("color") || ""
  );

  
  const [selectedSize, setSelectedSize] = useState("");
  const urlSize = normalize(searchParams.get("size"));

  const [currentGallery, setCurrentGallery] = useState([]);
  const [mainImage, setMainImage] = useState(null);

  const [allVariantOfAColor, setAllVariantOfAColor] = useState([]);
  const [currentVariant, setCurrentVariant] = useState(null);

  const [galleryCache, setGalleryCache] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  

  /* ================= API ================= */

  const getProductDetails = async () => {
    try {
      const res = await api.get(`/products/${productId}`);
      setProductDetail(res.data.data);
    } catch (err) {
      console.error("Product fetch error:", err);
    }
  };

  const getColorGallery = async (colorId) => {
    try {
      // Cache first
      if (galleryCache[colorId]) {
        const cached = galleryCache[colorId];
        setCurrentGallery(cached);
        setMainImage(cached[0] || null);
        return;
      }

      const res = await api.get(
        `/products/${productId}/color-gallery/${colorId}`
      );

      const gallery = res.data.data.gallery || [];

      setGalleryCache(prev => ({
        ...prev,
        [colorId]: gallery
      }));

      setCurrentGallery(gallery);
      setMainImage(gallery[0] || null);

    } catch (err) {
      console.error("Gallery error:", err);
    }
  };

  /* ================= COLOR CLICK ================= */

  const handleColorChange = (colorName) => {
    setSelectedColor(colorName);

    // Update URL (replace so back works)
    setSearchParams(
      { color: colorName },
      { replace: true }
    );
  };

  /* ================= FETCH PRODUCT ================= */

  useEffect(() => {
    setIsInitialLoad(true);
    getProductDetails();
  }, [productId]);

  /* ================= INITIAL SETUP ================= */

  useEffect(() => {
    if (!productDetail) return;

    const urlColor = normalize(searchParams.get("color"));

    let finalVariant = null;
    let finalColor = "";

    /* 1️⃣ URL priority (NO stock check) */
    if (urlColor) {
      const matches = productDetail.variants.filter(
        v =>
          normalize(v.color.colorName) === urlColor
      );

      if (matches.length) {
        finalVariant = matches[0];
        finalColor = matches[0].color.colorName;
      }
    }

    /* 2️⃣ Default */
    if (!finalVariant) {
      if (productDetail.defaultVariant) {
        finalVariant = productDetail.defaultVariant;
        finalColor =
          productDetail.defaultVariant.color?.colorName || "";
      } else {
        finalVariant = productDetail.variants[0];
        finalColor = finalVariant.color?.colorName || "";
      }
    }

    if (!finalVariant) return;

    /* Variants of this color */
    const colorVariants = productDetail.variants.filter(
      v =>
        normalize(v.color.colorName) ===
        normalize(finalColor)
    );

    setSelectedColor(finalColor);
    setAllVariantOfAColor(colorVariants);
    setSelectedSize("");
    setCurrentVariant(null);

    /* Initial gallery */
    if (isInitialLoad) {

      const hasUrlColor = !!searchParams.get("color");

      // If URL has color → always fetch that gallery
      if (hasUrlColor) {
        getColorGallery(finalVariant.color._id);
      }

      // Else use backend default
      else if (productDetail.defaultGallery?.length) {
        setCurrentGallery(productDetail.defaultGallery);
        setMainImage(productDetail.defaultGallery[0]);
      }

      // Else fallback
      else {
        getColorGallery(finalVariant.color._id);
      }

      setIsInitialLoad(false);
    }


  }, [productDetail, searchParams]);

  /* ================= FETCH ON COLOR CHANGE ================= */

  useEffect(() => {
    if (!productDetail || !selectedColor) return;

    const colorObj = productDetail.allColors.find(
      c =>
        normalize(c.colorName) ===
        normalize(selectedColor)
    );

    if (!colorObj) return;

    getColorGallery(colorObj._id);

  }, [selectedColor]);

  /* ================= AUTO SIZE ================= */

  useEffect(() => {
    if (!allVariantOfAColor.length) return;

    // 1️⃣ If URL has size → try match by sizeName
    if (urlSize) {
      const matched = allVariantOfAColor.find(
        v =>
          normalize(v.size.sizeName) === urlSize
      );

      if (matched) {
        setSelectedSize(matched.size);
        setCurrentVariant(matched);
        return;
      }
    }

    // 2️⃣ Else → select first in-stock
    const firstInStock = allVariantOfAColor.find(
      v => v.quantity > 0
    );

    if (firstInStock) {
      setSelectedSize(firstInStock.size);
      setCurrentVariant(firstInStock);
    }

  }, [allVariantOfAColor, urlSize]);


  /* ================= SIZE SELECT ================= */

  useEffect(() => {
    if (!selectedSize) return;

    const variant = allVariantOfAColor.find(
      v =>
        normalize(v.size.sizeName) ===
        normalize(selectedSize.sizeName)
    );

    if (variant) setCurrentVariant(variant);

  }, [selectedSize]);


  /* ================= CART ================= */

  const addItemToCartGuest = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const found = cart.find(
      i =>
        i.productId === productId &&
        i.variantId === currentVariant._id
    );

    if (found) found.quantity++;
    else {
      cart.push({
        productId,
        variantId: currentVariant._id,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    const count = cart.reduce((t, i) => t + i.quantity, 0);

    dispatch(setUserData({ ...userData, cartCount: count }));
  };

  const addItemToCartUser = async () => {
    const res = await api.post("/cart/items", {
      productId,
      variantId: currentVariant._id,
      quantity: 1
    });

    dispatch(
      setUserData({
        ...userData,
        cartCount: res.data.data.cartCount
      })
    );
  };

  const handleAddToCart = () => {
    if (!currentVariant) return;

    if (isAuthenticated) addItemToCartUser();
    else addItemToCartGuest();
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      dispatch(setIsAuthModalOpen(true));
      return;
    }

    const data = {
      productId,
      variantId: currentVariant._id,
      quantity: 1
    };

    sessionStorage.setItem(
      "checkout_buy_now",
      JSON.stringify(data)
    );

    navigate("/checkout?type=BUY_NOW", { state: data });
  };

  useScrollToTop();

  /* ================= LOADING ================= */

  if (!productDetail) return <ProductSkeleton />;

  /* ================= UI ================= */

  return (
    <div className="w-full">

      <div className="grid grid-cols-12">

        {/* Images */}
        <div className="col-span-12 md:col-span-6 p-5 flex gap-4">

          <div className="flex lg:flex-col gap-3">

            {currentGallery.map((img, i) => (
              <div
                key={i}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 border rounded-xl overflow-hidden cursor-pointer
                ${mainImage?.url === img.url
                    ? "border-black"
                    : "border-gray-300"
                  }`}
              >
                <img
                  src={img.url}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

          </div>

          <div className="flex-1 bg-white rounded-2xl overflow-hidden">

            <img
              src={
                mainImage?.url ||
                "/images/defaultimage/no-image.jpg"
              }
              className="w-full h-full object-contain"
            />

          </div>
        </div>

        {/* Info */}
        <div className="col-span-12 md:col-span-6 p-5 flex flex-col gap-6">

          <h1 className="text-3xl font-bold">
            {productDetail.title}
          </h1>

          {/* Price */}
          {currentVariant ? (
            <div className="flex gap-3 items-center">

              <p className="text-3xl font-bold text-green-700">
                ₹{currentVariant.price}
              </p>

              {currentVariant.mrp > currentVariant.price && (
                <>
                  <p className="line-through text-gray-500">
                    ₹{currentVariant.mrp}
                  </p>

                  <Badge type="discount">
                    {Math.round(
                      ((currentVariant.mrp -
                        currentVariant.price) /
                        currentVariant.mrp) *
                      100
                    )}% OFF
                  </Badge>
                </>
              )}

            </div>
          ) : (
            <p>Select size</p>
          )}

          {/* Colors */}
          <div>
            <p className="font-medium mb-2">Select Color</p>

            <div className="flex gap-3 flex-wrap">

              {productDetail.allColors.map((c, i) => {

                const active =
                  normalize(c.colorName) ===
                  normalize(selectedColor);

                return (
                  <div
                    key={i}
                    onClick={() =>
                      c.inStock &&
                      handleColorChange(c.colorName)
                    }
                    className={`w-8 h-8 rounded-full border
                    ${active
                        ? "border-black scale-110"
                        : "border-gray-300"
                      }
                    ${c.inStock
                        ? "cursor-pointer"
                        : "opacity-30"
                      }`}
                    style={{
                      backgroundColor: c.colorHex
                    }}
                  />
                );
              })}

            </div>
          </div>

          {/* Sizes */}
          <div>
            <p className="font-medium mb-2">Select Size</p>

            <div className="flex gap-3 flex-wrap">

              {allVariantOfAColor.map((v, i) => {

                const active =
                  selectedSize?.sizeValue ===
                  v.size.sizeValue;

                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (v.quantity === 0) return;

                      setSelectedSize(v.size);

                      setSearchParams(prev => {
                        const p = new URLSearchParams(prev);
                        p.set("size", v.size.sizeName); // 👈 use sizeName
                        return p;
                      }, { replace: true });
                    }}

                    className={`px-4 py-1 border rounded
                    ${active
                        ? "bg-black text-white"
                        : "border-gray-300"
                      }
                    ${v.quantity === 0
                        ? "opacity-40"
                        : "cursor-pointer"
                      }`}
                  >
                    {v.size.sizeValue}
                  </div>
                );
              })}

            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">

            <button
              onClick={handleBuyNow}
              className="flex-1 bg-[#E8D1C5] py-3 rounded-full"
            >
              Buy Now
            </button>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white py-3 rounded-full"
            >
              Add To Cart
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Product;



