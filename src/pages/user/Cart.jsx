import React, { useState, useEffect } from "react";
import api from "../../config/apiUser";
import { BinIcon, DiscountIcon } from "../../icons";
import { useSelector, useDispatch } from "react-redux";
import { ArrowDownIcon } from "../../icons";
import { setIsAuthModalOpen } from "../../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { setUserData } from "../../redux/userSlice";

function Cart() {
  const { isAuthenticated, userData } = useSelector(state => state.user);
  const [cartData, setCartData] = useState([]);
  const [cartSummary, setCartSummary] = useState({});
  const [cartUpdated, setCartUpdated] = useState("")
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getCartGuest = async () => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (localCart.length === 0) {
      setCartData([]);
      return
    }
    console.log("local cart", localCart);
    let localCartCount = localCart.reduce((total, item) => total + item.quantity, 0);
    dispatch(setUserData({ ...userData, cartCount: localCartCount }));
    try {
      const res = await api.post("/cart/guest", { items: localCart });
      setCartData(res.data.data.cart);
      setCartSummary(res.data.data.cartSummary);
      console.log("guest cart details ", res.data.data);
    } catch (error) {
      console.error("Error fething guest cart", error);
    }
  }

  const getCartUser = async () => {
    try {
      const res = await api.get("/cart");
      setCartData(res.data.data.cart);
      setCartSummary(res.data.data.cartSummary);
      // console.log("user cart details ", res.data.data);
    } catch (error) {
      console.error("Error fething user cart", error);
    }
  }

  const handleUpdateQuantityLocal = (productId, variantId, type) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(
      item => item.productId === productId && item.variantId === variantId
    );

    if (existing) {
      if (type === "increment")
        existing.quantity++;
      else if (type === "decrement" && existing.quantity > 1)
        existing.quantity--;
    }

    setCartUpdated(Date.now());

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cartCount", cart.length);

  }

  const handleUpdateQuantityUser = async (cartItemId, type, quantity = 1) => {
    try {
      const res = await api.patch(`/cart/items/${cartItemId}`, {
        quantity,
        type
      })
      setCartUpdated(Date.now());
      console.log("user cart update response", res.data);
    } catch (error) {
      console.error("Error updating user cart", error);
    }
  }


  const handleDeleteItemGuest = (productId, variantId) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const updatedCart = cart.filter(
      item => item.variantId !== variantId
    );
    setCartUpdated(Date.now());

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    localStorage.setItem("cartCount", cart.length);
  }
  const handleDeleteItemUser = async (cartItemId) => {
    try {
      const res = await api.delete(`/cart/items/${cartItemId}`);
      setCartUpdated(Date.now());
    } catch (error) {
      console.error("error deleting user cart item", error);
    }
  }

  const handleCheckOut = () => {
    if (!isAuthenticated) {
      dispatch(setIsAuthModalOpen(true));
      return;
    }
    // proceed to checkout
    navigate("/checkout?type=CART");
    // navigate("/checkout", { state: { type: 'CART' } });
  }

  useEffect(() => {
    if (isAuthenticated) {
      getCartUser();
    } else {
      getCartGuest();
    }
  }, [isAuthenticated, cartUpdated])


  return (
    <div className="min-h-screen bg-gray-50 px-4 lg:px-16 py-10">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">

        <h1 className="text-4xl font-semibold text-gray-900">
          Your Cart
        </h1>

        <p className="text-gray-500 mt-1">
          Review your items before checkout
        </p>

      </div>


      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-4 lg:gap-8">


        {/* LEFT — CART ITEMS */}
        <div className="col-span-12 lg:col-span-8 space-y-6">


          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
              Shopping Cart
            </h2>


            {cartData?.length ? (

              cartData.map((item, index, array) => (

                <div key={index}>


                  <div className="flex items-center gap-4">


                    <Link to={`../products/${item.productId}`}>
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


                    {/* ACTIONS */}
                    <div className="flex flex-col items-end justify-between gap-3">


                      {/* DELETE */}
                      <button
                        onClick={() =>
                          isAuthenticated
                            ? handleDeleteItemUser(item._id)
                            : handleDeleteItemGuest(item.productId, item.variantId)
                        }
                        className="text-red-500 hover:text-red-600"
                      >
                        <BinIcon className="text-xl" />
                      </button>


                      {/* QTY */}
                      <div className="flex items-center">


                        <button
                          disabled={item.quantity === 1}
                          onClick={() =>
                            isAuthenticated
                              ? handleUpdateQuantityUser(item._id, "decrement")
                              : handleUpdateQuantityLocal(
                                item.productId,
                                item.variantId,
                                "decrement"
                              )
                          }
                          className="px-3 py-1 bg-gray-100 rounded-l-lg hover:bg-gray-200 disabled:opacity-40"
                        >
                          -
                        </button>


                        <span className="px-3 py-1 bg-gray-100">
                          {item.quantity}
                        </span>


                        <button
                          onClick={() =>
                            isAuthenticated
                              ? handleUpdateQuantityUser(item._id, "increment")
                              : handleUpdateQuantityLocal(
                                item.productId,
                                item.variantId,
                                "increment"
                              )
                          }
                          className="px-3 py-1 bg-gray-100 rounded-r-lg hover:bg-gray-200"
                        >
                          +
                        </button>

                      </div>

                    </div>

                  </div>


                  {array.length - 1 !== index && (
                    <div className="h-px bg-gray-200 my-4" />
                  )}

                </div>
              ))

            ) : (

              <p className="text-center text-gray-500 py-10">
                Your cart is empty 🛒
              </p>

            )}

          </div>

        </div>


        {/* RIGHT — SUMMARY */}
        {cartSummary?.total > 0 && (

          <div className="col-span-12 lg:col-span-4">


            <div className="bg-white rounded-2xl shadow p-6 sticky top-24 space-y-4">


              <h2 className="text-xl font-semibold">
                Order Summary
              </h2>


              <Row label="Subtotal" value={cartSummary.subtotal} />

              <Row
                label="Discount"
                value={-cartSummary.discount}
                red
              />

              <Row
                label="Delivery"
                value={cartSummary.deliveryCharge}
              />


              <div className="h-px bg-gray-200" />


              <div className="flex justify-between text-lg font-semibold">

                <span>Total</span>

                <span>
                  ₹{cartSummary.finalTotal}
                </span>

              </div>


              <p className="text-xs text-gray-500 text-right">
                Inclusive of all taxes
              </p>


              <button
                onClick={handleCheckOut}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Proceed to Checkout
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );

}

export default Cart;



const Row = ({ label, value, red }) => (
  <div className="flex justify-between text-sm">

    <span className="text-gray-500">
      {label}
    </span>

    <span className={`font-medium ${red ? "text-red-500" : ""}`}>
      ₹{Math.abs(value)}
    </span>

  </div>
);
