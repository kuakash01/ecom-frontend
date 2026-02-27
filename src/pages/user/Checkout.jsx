import { useEffect, useState } from "react";
import api from "../../config/apiUser";
import { useLocation, Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowDownIcon, BinIcon, DiscountIcon } from "../../icons";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice"
import CartSkeleton from "../../components/user/loadingSkeleton/CartSkeleton";
import useScrollToTop from "../../hooks/useScrollToTop";
import openRazorpay from "../../utils/openRazorpay";



const Checkout = () => {
  const [previewData, setPreviewData] = useState(null);

  // Buy Now Checkout Data
  const location = useLocation();
  const storedData = sessionStorage.getItem("checkout_buy_now");
  const buyNowData = location.state || storedData;
  const [buyNowQty, setBuyNowQty] = useState(
    buyNowData?.quantity || 1
  );

  const [paymentMode, setPaymentMode] = useState("");

  // order place states
  const [loading, setLoading] = useState(false);


  const isCheckoutValid =
    previewData?.cartItems?.length > 0 &&
    previewData?.address &&
    paymentMode;

  const [pageLoading, setPageLoading] = useState(true);

  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const checkoutType = searchParams.get("type");


  // order failed state from query param
  const [params] = useSearchParams();
  const failed = params.get("payment") === "failed";


  const getPreview = async () => {
    try {
      const res = await api.post("/checkout/preview", {
        type: checkoutType,
        productId: buyNowData?.productId,
        variantId: buyNowData?.variantId,
        buyNowQty
      });
      console.log("Checkout Preview Data:", res.data);
      if (res.data && res.data.status === "success" && res.data.data.cartItems.length === 0) {
        navigate("/cart");
        return;
      }
      setPreviewData(res.data.data);

    } catch (err) {
      console.error(err);
    }
  };
  const incrementQty = () => {
    setBuyNowQty(prev => prev + 1);
    getPreview();
  };

  const decrementQty = () => {
    if (buyNowQty > 1) {
      setBuyNowQty(prev => prev - 1);
      getPreview();
    }
  };

  const handleUpdateQuantityCart = async (cartItemId, type, quantity = 1) => {
    try {
      const res = await api.patch(`/cart/items/${cartItemId}`, {
        quantity,
        type
      })
      getPreview();
      dispatch(setUserData({ ...userData, cartCount: res.data.cart.cartCount }));
      console.log("user cart update response", res.data);
    } catch (error) {
      console.error("Error updating user cart", error);
    }
  }

  // const handlePlaceOrder = async () => {

  //   try {
  //     setLoading(true);
  //     // Make API call to place order
  //     const res = await api.post("/orders", {
  //       type: checkoutType,
  //       productId: buyNowData?.productId,
  //       variantId: buyNowData?.variantId,
  //       buyNowQty,
  //       paymentMethod: paymentMode
  //     });
  //     console.log("Place order response:", res.data);

  //     if (paymentMode === "online") {
  //       openRazorpay(res.data);
  //     } else {

  //       setOrderId(res.data.order.orderId);
  //       setSuccess(res.data && res.data.status === "success");
  //       setLoading(false);

  //       // Redirect to order confirmation or orders page
  //       if (res.data && res.data.status === "success") {
  //         setTimeout(() => {
  //           setSuccess(false);
  //           document.body.style.overflow = "auto";
  //           navigate("/profile/orders");
  //         }, 3000); // 3 sec delay
  //       }

  //       // COD success
  //       navigate("/order-success");
  //     }


  //     // Clear buy now data from session storage
  //     sessionStorage.removeItem("checkout_buy_now");

  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //   }
  // }

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      const res = await api.post("/orders", {
        type: checkoutType,
        productId: buyNowData?.productId,
        variantId: buyNowData?.variantId,
        buyNowQty,
        paymentMethod: paymentMode
      });

      if (paymentMode === "online") {
        openRazorpay(res.data, navigate);
        return;
      }

      // COD flow
      if (res.data.status === "success") {
        navigate(`/profile/orders/${res.data.order.orderDocId}`, {
          replace: true,
          state: { justPlaced: true }
        });
      } else {
        navigate("/checkout?payment=failed", { replace: true });
      }

    } catch (error) {
      console.error("Error placing order:", error);
      navigate("/checkout?payment=failed", { replace: true });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!checkoutType || (checkoutType === "BUY_NOW" && !buyNowData))
      navigate("/");

    if (checkoutType === "BUY_NOW") {
      const updated = {
        ...buyNowData,
        quantity: buyNowQty
      };

      sessionStorage.setItem(
        "checkout_buy_now",
        JSON.stringify(updated)
      );
    }
  }, [buyNowQty]);




  useEffect(() => {
    (async () => {
      setPageLoading(true);
      await getPreview();
      setPageLoading(false);
    })()
  }, []);


  useScrollToTop();


  if (pageLoading)
    return <CartSkeleton />



  return (
    <div className="min-h-screen bg-gray-50 px-4 lg:px-16 py-10">
      {failed && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
          Payment failed. Please try again.
        </div>
      )}

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">

        <h1 className="text-4xl font-semibold text-gray-900">
          Checkout
        </h1>

        <p className="text-gray-500 mt-1">
          Review your order and complete purchase
        </p>

      </div>


      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-4 lg:gap-8">

        {/* LEFT */}
        <div className="col-span-12 lg:col-span-8 space-y-6">


          {/* CART */}
          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
              Your Items
            </h2>


            {previewData?.cartItems?.length ? (

              previewData.cartItems.map((item, index, array) => (

                <div key={index}>

                  <div className="flex items-center gap-4">

                    <Link to={`../products/${item.productId}${item.attributes.color ? `?color=${item.attributes.color.colorName}` : ""}`} className="w-24 h-24 flex-shrink-0"
                      target="_blank"
                    >
                      <img
                        src={item.mainImage}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                    </Link>


                    <div className="flex-1">

                      <p className="font-medium text-gray-900">
                        {item.title}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Size: {item.attributes.size.sizeName}
                      </p>

                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>


                      <div className="mt-2 flex items-center gap-2">

                        <span className="font-semibold text-lg">
                          ₹{item.price}
                        </span>

                        <span className="text-sm text-gray-400 line-through">
                          ₹{item.mrp}
                        </span>

                      </div>

                    </div>


                    {/* QTY CONTROL */}
                    <div className="flex items-center">

                      <button
                        onClick={() =>
                          checkoutType === "CART"
                            ? handleUpdateQuantityCart(item._id, "decrement")
                            : decrementQty()
                        }
                        disabled={item.quantity === 1}
                        className="px-3 py-1 bg-gray-100 rounded-l-lg hover:bg-gray-200 disabled:opacity-40"
                      >
                        -
                      </button>

                      <span className="px-3 py-1 bg-gray-100">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          checkoutType === "CART"
                            ? handleUpdateQuantityCart(item._id, "increment")
                            : incrementQty()
                        }
                        className="px-3 py-1 bg-gray-100 rounded-r-lg hover:bg-gray-200"
                      >
                        +
                      </button>

                    </div>

                  </div>


                  {array.length - 1 !== index && (
                    <div className="h-px bg-gray-200 my-4" />
                  )}

                </div>
              ))

            ) : (

              <p className="text-center text-gray-500">
                Cart is empty
              </p>

            )}

          </div>



          {/* ADDRESS */}
          <div className="bg-white rounded-2xl shadow p-6">

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-xl font-semibold">
                Delivery Address
              </h2>

              {previewData?.address && (
                <button
                  onClick={() => navigate("/profile/addresses")}
                  className="text-indigo-600 text-sm font-medium hover:underline"
                >
                  Change
                </button>
              )}

            </div>


            {/* ADDRESS FOUND */}
            {previewData?.address ? (

              <div className="space-y-1">

                <p className="font-medium text-gray-900">
                  {previewData.address.fullName}
                </p>

                <p className="text-sm text-gray-600 leading-relaxed">

                  {previewData.address.addressLine1}

                  {previewData.address.addressLine2 &&
                    `, ${previewData.address.addressLine2}`}

                  {previewData.address.landmark &&
                    `, Near ${previewData.address.landmark}`}

                  <br />

                  {previewData.address.city}, {previewData.address.state}
                  {" "}– {previewData.address.pincode}

                  <br />

                  India

                </p>

                <p className="text-sm text-gray-600">
                  Phone: {previewData.address.phone}
                </p>

                {previewData.address.alternatePhone && (
                  <p className="text-sm text-gray-600">
                    Alt: {previewData.address.alternatePhone}
                  </p>
                )}


                {/* DEFAULT BADGE */}
                {previewData.address.isDefault && (
                  <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                    Default Address
                  </span>
                )}

              </div>

            ) : (

              /* NO ADDRESS */
              <div
                // onClick={() => navigate("/profile/addresses/add?redirect=/checkout")}
                onClick={() => {
                  const redirectUrl =
                    location.pathname + location.search;

                  navigate(
                    `/profile/addresses/add?redirect=${encodeURIComponent(redirectUrl)}`
                  );
                }}

                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 transition"
              >

                <p className="text-gray-500 mb-1">
                  No address found
                </p>

                <p className="text-indigo-600 font-medium">
                  + Add New Address
                </p>

              </div>

            )}

          </div>




          {/* PAYMENT */}
          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
              Payment Method
            </h2>

            <div className="space-y-4">

              <label className="flex items-center gap-3 cursor-pointer text-gray-800">

                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  onChange={(e) => setPaymentMode(e.target.value)}
                />

                <span>Cash on Delivery</span>

              </label>


              <label className="flex items-center gap-3 cursor-pointer text-gray-800">

                <input type="radio"
                  name="payment"
                  value="online"
                  onChange={(e) => setPaymentMode(e.target.value)} />

                <span>Online Payment</span>

              </label>

            </div>

          </div>

        </div>


        {/* RIGHT SUMMARY */}
        {previewData?.cartSummary?.total > 0 && (

          <div className="col-span-12 lg:col-span-4">

            <div className="bg-white rounded-2xl shadow p-6 sticky top-24 space-y-4">

              <h2 className="text-xl font-semibold">
                Order Summary
              </h2>


              <Row
                label="Subtotal"
                value={previewData.cartSummary.subtotal}
              />

              <Row
                label="Discount"
                value={-previewData.cartSummary.discount}
                green
              />

              <Row
                label="Delivery"
                value={previewData.cartSummary.deliveryCharge}
              />


              <div className="h-px bg-gray-200" />


              <div className="flex justify-between text-lg font-semibold">

                <span>Total</span>

                <span>
                  ₹{previewData.cartSummary.finalTotal}
                </span>

              </div>


              <p className="text-xs text-gray-500 text-right">
                Inclusive of all taxes
              </p>




              <button
                onClick={handlePlaceOrder}
                disabled={loading || !isCheckoutValid}
                className={`w-full py-3 rounded-xl font-semibold flex justify-center items-center gap-2
    ${loading || !isCheckoutValid
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }
  `}
              >
                {loading && (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}

                {loading ? "Placing Order..." : "Place Order"}
              </button>




            </div>

          </div>
        )}

      </div>



    </div>
  );



}

export default Checkout;





const Row = ({ label, value, green }) => (
  <div className="flex justify-between text-sm">

    <span className="text-gray-500">
      {label}
    </span>

    <span className={`font-medium ${green ? "text-green-500" : ""}`}>
      ₹{Math.abs(value)}
    </span>

  </div>
);

