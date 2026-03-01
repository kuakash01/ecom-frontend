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

  const [activeImageIndex, setActiveImageIndex] = useState(0);



  /* ================= API ================= */

  const getProductDetails = async () => {
    try {
      const res = await api.get(`/products/${productId}`);
      setProductDetail(res.data.data);
      console.log("Product details:", res.data.data);
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
    <div className="w-full bg-white py-8 px-0 lg:px-16">

      <div className="max-w-[1400px] mx-auto px-4">

        <div className="grid grid-cols-12 gap-4 lg:gap-10">


          {/* ================= IMAGES ================= */}
          <div className="col-span-12 lg:col-span-7 ">


            
            {/* ===== MOBILE SLIDER ===== */}
            <div className="lg:hidden">

              {/* Slider */}
              <div
                id="mobile-gallery"
                className="
      flex gap-4

      overflow-x-auto
      scroll-smooth
      snap-x snap-mandatory
    rounded-xl
      hide-scrollbar
    "
                onScroll={(e) => {
                  const el = e.target;
                  const index = Math.round(
                    el.scrollLeft / el.clientWidth
                  );
                  setActiveImageIndex(index);
                }}
              >

                {currentGallery.map((img, i) => (

                  <div
                    key={i}
                    className="
          min-w-full
          snap-center

          bg-gray-100
          
          overflow-hidden
        "
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="
            w-full
            object-contain
          "
                    />
                  </div>

                ))}

              </div>


              {/* Dots */}
              <div className="flex justify-center gap-2 mt-3">

                {currentGallery.map((_, i) => (

                  <span
                    key={i}
                    className={`
          w-2 h-2
          rounded-full
          transition-all

          ${activeImageIndex === i
                        ? "bg-black w-4"
                        : "bg-gray-300"}
        `}
                  />

                ))}

              </div>

            </div>


            {/* ===== DESKTOP GRID ===== */}
            <div className="hidden lg:grid grid-cols-2 gap-5">

              {currentGallery.map((img, i) => (

                <div
                  key={i}
                  className="
                  bg-gray-100
                  rounded-xl
                  overflow-hidden
                  group
                "
                >
                  <img
                    src={img.url}
                    alt=""
                    className="
                    w-full
            
                    object-contain
                    transition-transform duration-500
                    group-hover:scale-105
                  "
                  />
                </div>

              ))}

            </div>

          </div>



          {/* ================= PRODUCT INFO ================= */}
          <div className="col-span-12 lg:col-span-5">

            <div className="space-y-8 ">


              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-semibold leading-snug">
                {productDetail.title}
              </h1>


              {/* Price */}
              {currentVariant ? (
                <div className="flex items-center gap-4">

                  <p className="text-3xl font-bold text-gray-900">
                    ₹{currentVariant.price}
                  </p>

                  {currentVariant.mrp > currentVariant.price && (
                    <>
                      <p className="line-through text-gray-400">
                        ₹{currentVariant.mrp}
                      </p>

                      <span className="text-green-600 text-sm font-semibold">
                        {Math.round(
                          ((currentVariant.mrp - currentVariant.price) /
                            currentVariant.mrp) *
                          100
                        )}% OFF
                      </span>
                    </>
                  )}

                </div>
              ) : (
                <p className="text-gray-500">Select size</p>
              )}



              {/* Divider */}
              <div className="border-t" />



              {/* Colors */}
              <div>

                <p className="font-medium mb-4 text-sm uppercase tracking-wide text-gray-500">
                  Select Color
                </p>

                <div className="flex gap-4 flex-wrap">

                  {productDetail.allColors.map((c, i) => {

                    const active =
                      normalize(c.colorName) ===
                      normalize(selectedColor);

                    return (
                      <button
                        key={i}
                        disabled={!c.inStock}
                        onClick={() =>
                          c.inStock &&
                          handleColorChange(c.colorName)
                        }
                        className={`
                        w-10 h-10
                        rounded-full
                        border-2
                        transition

                        ${active
                            ? "border-black scale-110"
                            : "border-gray-300"}

                        ${!c.inStock
                            ? "opacity-30 cursor-not-allowed"
                            : "hover:scale-110"}
                      `}
                        style={{
                          backgroundColor: c.colorHex,
                        }}
                      />
                    );
                  })}

                </div>

              </div>



              {/* Sizes */}
              <div>

                <p className="font-medium mb-4 text-sm uppercase tracking-wide text-gray-500">
                  Select Size
                </p>

                <div className="flex gap-3 flex-wrap">

                  {allVariantOfAColor.map((v, i) => {

                    const active =
                      selectedSize?.sizeValue ===
                      v.size.sizeValue;

                    return (
                      <button
                        key={i}
                        disabled={v.quantity === 0}
                        onClick={() => {

                          if (v.quantity === 0) return;

                          setSelectedSize(v.size);

                          setSearchParams(prev => {
                            const p = new URLSearchParams(prev);
                            p.set("size", v.size.sizeName);
                            return p;
                          }, { replace: true });

                        }}
                        className={`
                        px-5 py-2
                        border
                        text-sm
                        font-medium
                        transition

                        ${active
                            ? "bg-black text-white border-black"
                            : "border-gray-300 hover:border-black"}

                        ${v.quantity === 0
                            ? "opacity-40 cursor-not-allowed"
                            : ""}
                      `}
                      >
                        {v.size.sizeValue}
                      </button>
                    );
                  })}

                </div>

              </div>



              {/* Buttons */}
              <div className="flex gap-4 pt-4">

                <button
                  onClick={handleBuyNow}
                  className="
                  flex-1
                  bg-black
                  text-white
                  py-3
                  font-medium
                  hover:bg-gray-900
                  transition
                "
                >
                  Buy Now
                </button>

                <button
                  onClick={handleAddToCart}
                  className="
                  flex-1
                  border
                  border-black
                  py-3
                  font-medium
                  hover:bg-gray-100
                  transition
                "
                >
                  Add To Cart
                </button>

              </div>



              {/* Trust Info */}
              <div className="text-sm text-gray-500 space-y-2 pt-6 border-t">

                <p>✔ 100% Original Products</p>
                <p>✔ Free Delivery above ₹499</p>
                <p>✔ Easy 7-Day Returns</p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Product;



