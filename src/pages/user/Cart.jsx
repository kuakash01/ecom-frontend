import React, { useState, useEffect } from "react";
import api from "../../config/axios";
import { BinIcon, DiscountIcon } from "../../icons";
import { useSelector, useDispatch } from "react-redux";
import { ArrowDownIcon } from "../../icons";
import { setIsAuthModalOpen } from "../../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
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
      console.log("user cart details ", res.data.data);
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

  // return (
  //   <div className="px-2 lg:px-20 py-10">
  //     <h1 className="text-4xl font-bold ">YOUR CART</h1>

  //     <div className="grid grid-cols-12 my-8 gap-4">
  //       {/* cart items start*/}
  //       <div className="col-span-12  lg:col-span-8 h-fit p-5 overflow-auto  border rounded-2xl border-gray-300">
  //         {cartData && cartData.length > 0 ? cartData.map((item, index, array) => (
  //           <div key={index}>

  //             <div className="item flex items-center ">
  //               <Link to={`../products/${item.productId}?color=${item.attributes.color.colorName}`}>
  //                 <img
  //                   className="h-30 aspect-square object-cover rounded-lg cursor-pointer"
  //                   src={item.mainImage}
  //                   alt=""
  //                 />
  //               </Link>
  //               <div className=" flex justify-between w-full h-30">
  //                 <div className="mx-4 flex flex-col justify-between">
  //                   <div>
  //                     <span className="font-medium text-xl">{item.title}</span>
  //                     <span className="flex gap-1">
  //                       <p className=" text-sm">Size:</p>{" "}
  //                       <p className="text-gray-500 text-sm flex"> {item.attributes.size.sizeName} </p>
  //                     </span>
  //                     <span className="flex gap-1">
  //                       <p className=" text-sm">Qty:</p>{" "}
  //                       <p className="text-gray-500 text-sm flex"> {item.quantity} </p>
  //                     </span>
  //                     {/* <span className="flex gap-1">
  //                       <p className=" text-sm">Color:</p>{" "}
  //                       <span style={{ backgroundColor: item.attributes.color }} className="w-6 h-6 rounded-full"></span>
  //                     </span> */}
  //                   </div>
  //                   <div className="space-x-2">
  //                     <span className="pt-2 text-xl font-medium ">Rs. {item.price}</span>
  //                     <span className="pt-2 text-sm font-medium text-gray-400 line-through">Rs. {item.mrp}</span>
  //                   </div>
  //                 </div>
  //                 <div className="flex flex-col justify-between items-end">
  //                   <button onClick={() => isAuthenticated ? handleDeleteItemUser(item._id) : handleDeleteItemGuest(item.productId, item.variantId)} className="cursor-pointer">
  //                     <BinIcon className="text-red-500 text-xl" />
  //                   </button>
  //                   <div className="flex text-lg ">
  //                     <button onClick={() => isAuthenticated ? handleUpdateQuantityUser(item._id, "decrement") : handleUpdateQuantityLocal(item.productId, item.variantId, "decrement")} className={`${item.quantity === 1 ? "cursor-not-allowed " : "cursor-pointer focus:ring-1 focus:ring-gray-600 focus:ring-inset"} py-1 px-4 bg-stone-200  rounded-l-full  box-border`}>
  //                       -
  //                     </button>

  //                     <span className="py-1 px-3 bg-stone-200  select-none">
  //                       {item.quantity}
  //                     </span>

  //                     <button onClick={() => isAuthenticated ? handleUpdateQuantityUser(item._id, "increment") : handleUpdateQuantityLocal(item.productId, item.variantId, "increment")} className="py-1 px-4 bg-stone-200  rounded-r-full cursor-pointer focus:ring-1 focus:ring-gray-600 focus:ring-inset box-border">
  //                       +
  //                     </button>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //             {
  //               array.length - 1 !== index && (
  //                 <div className="w-full border-b border-b-gray-300 my-4"></div>
  //               )
  //             }
  //           </div>
  //         )) : <div className="text-center">Cart is empty</div>}
  //       </div>
  //       {/* cart items end */}
  //       {cartSummary?.total > 0 && <div className="col-span-12  lg:col-span-4 p-5 sticky top-20 border h-fit border-gray-300 rounded-2xl flex flex-col gap-4">
  //         <p className="text-xl font-medium">Order Summary</p>
  //         <div className="flex justify-between">
  //           <p className="text-gray-500">Subtotal</p>{" "}
  //           <p className="font-medium">Rs. {cartSummary.subtotal}</p>
  //         </div>
  //         <div className="flex justify-between">
  //           <p className="text-gray-500">Discount</p>{" "}
  //           <p className="font-medium text-red-500"> Rs.-{cartSummary.discount}</p>
  //         </div>
  //         <div className="flex justify-between">
  //           <p className="text-gray-500">Delivery Fee</p>{" "}
  //           <p className="font-medium">Rs. {cartSummary.deliveryCharge}</p>
  //         </div>
  //         <div className="w-full border-b border-b-gray-300"></div>
  //         <div >
  //           <div className="flex justify-between text-lg">
  //             <p className="font-medium">Total</p>{" "}
  //             <p className="font-bold">Rs. {cartSummary?.finalTotal || 0}</p>
  //           </div>
  //           <p className="text-xs text-gray-500 mt-1 text-right">
  //             Inclusive of all taxes
  //           </p>
  //         </div>

  //         {/* <div className="flex gap-2">
  //           <div className="flex-1 ">
  //             <DiscountIcon className="absolute translate-y-[80%] translate-x-3 text-gray-600" />
  //             <input
  //               placeholder="Add promo code"
  //               type="text"
  //               className="w-full bg-stone-200  focus:outline-0 pl-10 p-2 rounded-full placeholder:text-sm"
  //             />
  //           </div>
  //           <button className="px-8 py-2 bg-black rounded-full text-white">
  //             Apply
  //           </button>
  //         </div> */}
  //         <button onClick={handleCheckOut} className="w-full py-3 rounded-lg text-white font-semibold bg-black hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2">
  //           Go to Checkout
  //         </button>
  //       </div>}
  //     </div>
  //   </div >
  // );


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


      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">


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
