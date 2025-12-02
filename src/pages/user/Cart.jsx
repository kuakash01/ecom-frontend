import React, { useState, useEffect } from "react";
import api from "../../config/axios";
import { BinIcon, DiscountIcon } from "../../icons";
import { useSelector, useDispatch } from "react-redux";
import { ArrowDownIcon } from "../../icons";
import { setIsAuthModalOpen } from "../../redux/userSlice";
import { Link } from "react-router-dom";

function Cart() {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const [cartData, setCartData] = useState([]);
  const [cartSummary, setCartSummary] = useState({});
  const [cartUpdated, setCartUpdated] = useState("")
  const dispatch = useDispatch();

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
  }

  useEffect(() => {
    if (isAuthenticated) {
      getCartUser();
    } else {
      getCartGuest();
    }
  }, [isAuthenticated, cartUpdated])

  return (
    <div className="px-2 lg:px-20 py-10">
      <h1 className="text-4xl font-bold ">YOUR CART</h1>

      <div className="grid grid-cols-12 my-8 gap-4">
        {/* cart items start*/}
        <div className="col-span-12  lg:col-span-8 h-fit p-5 overflow-auto  border rounded-2xl border-gray-300">
          {cartData && cartData.length > 0 ? cartData.map((item, index, array) => (
            <div key={index}>

              <div className="item flex items-center ">
                <Link to={`../products/${item.productId}?color=${item.attributes.color.colorName}`}>
                  <img
                    className="h-30 aspect-square object-cover rounded-lg cursor-pointer"
                    src={item.mainImage}
                    alt=""
                  />
                </Link>
                <div className=" flex justify-between w-full h-30">
                  <div className="mx-4 flex flex-col justify-between">
                    <div>
                      <span className="font-medium text-xl">{item.title}</span>
                      <span className="flex gap-1">
                        <p className=" text-sm">Size:</p>{" "}
                        <p className="text-gray-500 text-sm flex"> {item.attributes.size.sizeValue} <ArrowDownIcon className="text-gray-500" /></p>
                      </span>
                      <span className="flex gap-1">
                        <p className=" text-sm">Qty:</p>{" "}
                        <p className="text-gray-500 text-sm flex"> {item.quantity} <ArrowDownIcon className="text-gray-500" /></p>
                      </span>
                      {/* <span className="flex gap-1">
                        <p className=" text-sm">Color:</p>{" "}
                        <span style={{ backgroundColor: item.attributes.color }} className="w-6 h-6 rounded-full"></span>
                      </span> */}
                    </div>
                    <div className="space-x-2">
                      <span className="pt-2 text-xl font-medium ">Rs. {item.price}</span>
                      <span className="pt-2 text-sm font-medium text-gray-400 line-through">Rs. {item.mrp}</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <button onClick={() => isAuthenticated ? handleDeleteItemUser(item._id) : handleDeleteItemGuest(item.productId, item.variantId)} className="cursor-pointer">
                      <BinIcon className="text-red-500 text-xl" />
                    </button>
                    <div className="flex text-lg ">
                      <button onClick={() => isAuthenticated ? handleUpdateQuantityUser(item._id, "decrement") : handleUpdateQuantityLocal(item.productId, item.variantId, "decrement")} className={`${item.quantity === 1 ? "cursor-not-allowed " : "cursor-pointer focus:ring-1 focus:ring-gray-600 focus:ring-inset"} py-1 px-4 bg-stone-200  rounded-l-full  box-border`}>
                        -
                      </button>

                      <span className="py-1 px-3 bg-stone-200  select-none">
                        {item.quantity}
                      </span>

                      <button onClick={() => isAuthenticated ? handleUpdateQuantityUser(item._id, "increment") : handleUpdateQuantityLocal(item.productId, item.variantId, "increment")} className="py-1 px-4 bg-stone-200  rounded-r-full cursor-pointer focus:ring-1 focus:ring-gray-600 focus:ring-inset box-border">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {
                array.length - 1 !== index && (
                  <div className="w-full border-b border-b-gray-300 my-4"></div>
                )
              }
            </div>
          )) : <div className="text-center">Cart is empty</div>}
        </div>
        {/* cart items end */}
        <div className="col-span-12  lg:col-span-4 p-5 sticky top-20 border h-fit border-gray-300 rounded-2xl flex flex-col gap-4">
          <p className="text-xl font-medium">Order Summary</p>
          <div className="flex justify-between">
            <p className="text-gray-500">Subtotal</p>{" "}
            <p className="font-medium">Rs. 456</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-500">Discount</p>{" "}
            <p className="font-medium text-red-500"> Rs.-456</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-500">Delivery Fee</p>{" "}
            <p className="font-medium">Rs. 456</p>
          </div>
          <div className="w-full border-b border-b-gray-300"></div>
          <div className="flex justify-between">
            <p className="text-gray-700">Total</p>{" "}
            <p className="font-medium">Rs. 456</p>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 ">
              <DiscountIcon className="absolute translate-y-[80%] translate-x-3 text-gray-600" />
              <input
                placeholder="Add promo code"
                type="text"
                className="w-full bg-stone-200  focus:outline-0 pl-10 p-2 rounded-full placeholder:text-sm"
              />
            </div>
            <button className="px-8 py-2 bg-black rounded-full text-white">
              Apply
            </button>
          </div>
          <button onClick={handleCheckOut} className="px-8 py-2 bg-black rounded-full text-white cursor-pointer">
            Go to Checkout
          </button>
        </div>
      </div>
    </div >
  );
}

export default Cart;
