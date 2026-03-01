import React, { useState, useEffect } from "react";
import api from "../../config/apiUser";
import { BinIcon } from "../../icons";
import { useSelector, useDispatch } from "react-redux";
import { setIsAuthModalOpen, setUserData } from "../../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import CartItemSkeleton from "../../components/user/loadingSkeleton/CartItemSkeleton";
import CartSummarySkeleton from "../../components/user/loadingSkeleton/CartSummarySkeleton";
import useScrollToTop from "../../hooks/useScrollToTop";

function Cart() {
  const { isAuthenticated, userData } = useSelector((state) => state.user);

  const [cartData, setCartData] = useState([]);
  const [cartSummary, setCartSummary] = useState({});
  const [loading, setLoading] = useState(true);

  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useScrollToTop();

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 2000);
  };

  // ================= FETCH GUEST =================
  const getCartGuest = async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];

      if (localCart.length === 0) {
        setCartData([]);
        return;
      }

      const res = await api.post("/cart/guest", { items: localCart });

      setCartData(res.data.data.cart);
      setCartSummary(res.data.data.cartSummary);
    } catch (error) {
      console.error("Error fetching guest cart", error);
    }
  };

  // ================= FETCH USER =================
  const getCartUser = async () => {
    try {
      const res = await api.get("/cart");
      setCartData(res.data.data.cart);
      setCartSummary(res.data.data.cartSummary);
    } catch (error) {
      console.error("Error fetching user cart", error);
    }
  };

  // ================= UPDATE GUEST =================
  const handleUpdateQuantityLocal = async (productId, variantId, type) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(
      (item) => item.productId === productId && item.variantId === variantId,
    );

    if (!existing) return;

    if (type === "increment") existing.quantity++;
    if (type === "decrement" && existing.quantity > 1) existing.quantity--;

    setUpdatingItemId(variantId);

    localStorage.setItem("cart", JSON.stringify(cart));

    await getCartGuest();

    showToast(
      type === "increment" ? "Quantity increased" : "Quantity decreased",
    );

    setUpdatingItemId(null);
  };

  // ================= UPDATE USER =================
  const handleUpdateQuantityUser = async (cartItemId, type, quantity = 1) => {
    try {
      setUpdatingItemId(cartItemId);

      const res = await api.patch(`/cart/items/${cartItemId}`, {
        quantity,
        type,
      });

      await getCartUser();

      dispatch(
        setUserData({
          ...userData,
          cartCount: res.data.cart.cartCount,
        }),
      );

      showToast(
        type === "increment" ? "Quantity increased" : "Quantity decreased",
      );
    } catch (error) {
      console.error("Error updating user cart", error);
    } finally {
      setUpdatingItemId(null);
    }
  };

  // ================= DELETE =================
  const handleDeleteItemUser = async (cartItemId) => {
    try {
      setUpdatingItemId(cartItemId);
      await api.delete(`/cart/items/${cartItemId}`);
      await getCartUser();
      showToast("Item removed");
    } catch (error) {
      console.error("Error deleting item", error);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleDeleteItemGuest = async (productId, variantId) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const updatedCart = cart.filter((item) => item.variantId !== variantId);

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    setUpdatingItemId(variantId);

    await getCartGuest();

    showToast("Item removed");

    setUpdatingItemId(null);
  };

  // ================= CHECKOUT =================
  const handleCheckOut = () => {
    if (!isAuthenticated) {
      dispatch(setIsAuthModalOpen(true));
      return;
    }
    navigate("/checkout?type=CART");
  };

  // ================= FETCH =================
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      if (isAuthenticated) {
        await getCartUser();
      } else {
        await getCartGuest();
      }
      setLoading(false);
    };

    fetchCart();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 lg:px-16 py-10">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-semibold text-gray-900">Your Cart</h1>

        <p className="text-gray-500 mt-1">Review your items before checkout</p>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white rounded-2xl shadow p-6 space-y-6">
            <h2 className="text-xl font-semibold">Shopping Cart</h2>

            {loading ? (
              <CartItemSkeleton />
            ) : cartData.length ? (
              cartData.map((item) => {
                const id = isAuthenticated ? item._id : item.variantId;

                return (
                  <div key={id}>
                    <div className="flex gap-4">
                      <Link
                        to={`/products/${item.productId}${item.attributes.color.colorName ? `?color=${item.attributes.color.colorName}` : ""}`}
                        className="w-24 flex-shrink-0"
                      >
                        <img
                          src={item.mainImage}
                          className="w-24 rounded-xl"
                          alt={item.title}
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium line-clamp-2">{item.title}</p>

                        <p className="text-sm text-gray-500 mt-1">
                          Size: {item.attributes.size.sizeName}
                        </p>

                        {/* QTY */}
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            disabled={
                              updatingItemId === id || item.quantity === 1
                            }
                            onClick={() =>
                              isAuthenticated
                                ? handleUpdateQuantityUser(
                                    item._id,
                                    "decrement",
                                  )
                                : handleUpdateQuantityLocal(
                                    item.productId,
                                    item.variantId,
                                    "decrement",
                                  )
                            }
                            className="px-3 py-1 bg-gray-100 rounded"
                          >
                            {updatingItemId === id ? "..." : "-"}
                          </button>

                          <span className="px-3 py-1 bg-gray-100">
                            {item.quantity}
                          </span>

                          <button
                            disabled={updatingItemId === id}
                            onClick={() =>
                              isAuthenticated
                                ? handleUpdateQuantityUser(
                                    item._id,
                                    "increment",
                                  )
                                : handleUpdateQuantityLocal(
                                    item.productId,
                                    item.variantId,
                                    "increment",
                                  )
                            }
                            className="px-3 py-1 bg-gray-100 rounded"
                          >
                            {updatingItemId === id ? "..." : "+"}
                          </button>
                        </div>

                        <div className="flex gap-2 m-2 items-center">
                          <div className="font-semibold">₹{item.price}</div>
                          <div className="text-xs  line-through text-gray-500">
                            ₹{item.mrp}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          isAuthenticated
                            ? handleDeleteItemUser(item._id)
                            : handleDeleteItemGuest(
                                item.productId,
                                item.variantId,
                              )
                        }
                        className="text-red-500"
                      >
                        <BinIcon />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-10">
                Your cart is empty 🛒
              </p>
            )}
          </div>
        </div>

        {/* RIGHT */}
        {loading ? (
          <div className="col-span-12 lg:col-span-4">
            <CartSummarySkeleton />
          </div>
        ) : (
          cartSummary.total > 0 && (
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-white rounded-2xl shadow p-6 sticky top-24 space-y-4">
                <h2 className="text-xl font-semibold">Order Summary</h2>

                <Row label="Subtotal" value={cartSummary.subtotal} />
                <Row label="Discount" value={-cartSummary.discount} green />
                <Row label="Delivery" value={cartSummary.deliveryCharge} />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{cartSummary.finalTotal}</span>
                </div>

                <button
                  onClick={handleCheckOut}
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-2 rounded-full shadow-lg text-sm">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default Cart;

const Row = ({ label, value, green }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className={`font-medium ${green ? "text-green-500" : ""}`}>
      ₹{Math.abs(value)}
    </span>
  </div>
);
