import { useEffect, useState } from "react";
import api from "../../config/apiUser";
import {
  useLocation,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice";
import CartItemSkeleton from "../../components/user/loadingSkeleton/CartItemSkeleton";
import CartSummarySkeleton from "../../components/user/loadingSkeleton/CartSummarySkeleton";
import useScrollToTop from "../../hooks/useScrollToTop";
import openRazorpay from "../../utils/openRazorpay";

const Checkout = () => {
  const [previewData, setPreviewData] = useState(null);
  const [paymentMode, setPaymentMode] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // 🔥 NEW STATES
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const [searchParams] = useSearchParams();
  const checkoutType = searchParams.get("type");
  const failed = searchParams.get("payment") === "failed";

  const storedData = sessionStorage.getItem("checkout_buy_now");
  const buyNowData = location.state || (storedData && JSON.parse(storedData));
  const [buyNowQty, setBuyNowQty] = useState(buyNowData?.quantity || 1);

  const isCheckoutValid =
    previewData?.cartItems?.length > 0 && previewData?.address && paymentMode;

  useScrollToTop();

  // 🔥 TOAST
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 2000);
  };

  // ================= PREVIEW =================
  const getPreview = async () => {
    try {
      const res = await api.post("/checkout/preview", {
        type: checkoutType,
        productId: buyNowData?.productId,
        variantId: buyNowData?.variantId,
        buyNowQty,
      });

      if (
        res.data.status === "success" &&
        res.data.data.cartItems.length === 0
      ) {
        navigate("/cart");
        return;
      }

      setPreviewData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= CART QTY UPDATE =================
  const handleUpdateQuantityCart = async (cartItemId, type, quantity = 1) => {
    try {
      setUpdatingItemId(cartItemId);

      const res = await api.patch(`/cart/items/${cartItemId}`, {
        quantity,
        type,
      });

      dispatch(
        setUserData({
          ...userData,
          cartCount: res.data.cart.cartCount,
        }),
      );

      await getPreview();

      showToast(
        type === "increment" ? "Quantity increased" : "Quantity decreased",
      );
    } catch (error) {
      console.error("Error updating cart", error);
    } finally {
      setUpdatingItemId(null);
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    (async () => {
      setPageLoading(true);
      await getPreview();
      setPageLoading(false);
    })();
  }, []);

  // ================= PLACE ORDER =================
  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      const res = await api.post("/orders", {
        type: checkoutType,
        productId: buyNowData?.productId,
        variantId: buyNowData?.variantId,
        buyNowQty,
        paymentMethod: paymentMode,
      });

      if (paymentMode === "online") {
        openRazorpay(res.data, navigate);
        return;
      }

      if (res.data.status === "success") {
        navigate(`/profile/orders/${res.data.order.orderDocId}`, {
          replace: true,
          state: { justPlaced: true },
        });
      } else {
        navigate("/checkout?payment=failed", { replace: true });
      }
    } catch (error) {
      navigate("/checkout?payment=failed", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 lg:px-16 py-10">
      {failed && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
          Payment failed. Please try again.
        </div>
      )}

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-semibold text-gray-900">Checkout</h1>

        <p className="text-gray-500 mt-1">
          Review your order and complete purchase
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-4 lg:gap-8">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* ITEMS */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Items</h2>

            {pageLoading ? (
              <CartItemSkeleton />
            ) : previewData?.cartItems?.length ? (
              previewData.cartItems.map((item, index, array) => (
                <div key={index}>
                  <div className="flex items-start sm:items-center gap-4">
                    <Link
                      to={`/products/${item.productId}${item.attributes.color.colorName ? `?color=${item.attributes.color.colorName}` : ""}`}
                      className="w-24 flex-shrink-0"
                    >
                      <img
                        src={item.mainImage}
                        className="w-24 object-cover rounded-xl"
                        alt={item.title}
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 line-clamp-2">
                        {item.title}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Size: {item.attributes.size.sizeName}
                      </p>

                      {/* 🔥 QTY WITH LOADING */}
                      <div className="mt-2 flex items-center">
                        <button
                          disabled={
                            item.quantity === 1 || updatingItemId === item._id
                          }
                          onClick={() =>
                            handleUpdateQuantityCart(item._id, "decrement")
                          }
                          className="px-3 py-1 bg-gray-100 rounded-l-lg hover:bg-gray-200 disabled:opacity-40"
                        >
                          {updatingItemId === item._id ? "..." : "-"}
                        </button>

                        <span className="px-3 py-1 bg-gray-100">
                          {item.quantity}
                        </span>

                        <button
                          disabled={updatingItemId === item._id}
                          onClick={() =>
                            handleUpdateQuantityCart(item._id, "increment")
                          }
                          className="px-3 py-1 bg-gray-100 rounded-r-lg hover:bg-gray-200 disabled:opacity-40"
                        >
                          {updatingItemId === item._id ? "..." : "+"}
                        </button>
                      </div>

                      <div className="flex gap-2 m-2 items-center">
                        <div className="font-semibold">₹{item.price}</div>
                        <div className="text-xs  line-through text-gray-500">
                          ₹{item.mrp}
                        </div>
                      </div>
                    </div>
                  </div>

                  {array.length - 1 !== index && (
                    <div className="h-px bg-gray-200 my-4" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Cart is empty</p>
            )}
          </div>
          {/* ADDRESS */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Delivery Address</h2>

              {previewData?.address && (
                <button
                  onClick={() => navigate("/profile/addresses")}
                  className="text-indigo-600 text-sm font-medium hover:underline"
                >
                  Change
                </button>
              )}
            </div>

            {previewData?.address ? (
              <div className="space-y-1">
                <p className="font-medium text-gray-900">
                  {previewData.address.fullName}
                </p>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {previewData.address.addressLine1},{previewData.address.city},
                  {previewData.address.state} - {previewData.address.pincode}
                </p>

                <p className="text-sm text-gray-600">
                  Phone: {previewData.address.phone}
                </p>
              </div>
            ) : (
              <div
                onClick={() =>
                  navigate(
                    `/profile/addresses/add?redirect=${encodeURIComponent(
                      location.pathname + location.search,
                    )}`,
                  )
                }
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 transition"
              >
                <p className="text-gray-500 mb-1">No address found</p>
                <p className="text-indigo-600 font-medium">+ Add New Address</p>
              </div>
            )}
          </div>
          {/* PAYMENT */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

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
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                <span>Online Payment</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        {pageLoading ? (
          <div className="col-span-12 lg:col-span-4">
            <CartSummarySkeleton />
          </div>
        ) : (
          previewData?.cartSummary?.total > 0 && (
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-white rounded-2xl shadow p-6 sticky top-24 space-y-4">
                <h2 className="text-xl font-semibold">Order Summary</h2>

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
                  <span>₹{previewData.cartSummary.finalTotal}</span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || !isCheckoutValid}
                  className={`w-full py-3 rounded-xl font-semibold flex justify-center items-center gap-2
                  ${
                    loading || !isCheckoutValid
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
          )
        )}
      </div>

      {/* 🔥 TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-2 rounded-full shadow-lg text-sm">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Checkout;

const Row = ({ label, value, green }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className={`font-medium ${green ? "text-green-500" : ""}`}>
      ₹{Math.abs(value || 0)}
    </span>
  </div>
);
