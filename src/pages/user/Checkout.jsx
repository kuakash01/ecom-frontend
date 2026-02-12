import { useEffect, useState } from "react";
import api from "../../config/axios";
import AddCheckoutAddress from "../../components/user/AddressModel/AddCheckoutAddress";
import { useLocation, Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowDownIcon, BinIcon, DiscountIcon } from "../../icons";



const Checkout = () => {
  const [previewData, setPreviewData] = useState(null);
  const [updateFlag, setUpdateFlag] = useState(false);

  // Buy Now Checkout Data
  const location = useLocation();
  const storedData = sessionStorage.getItem("checkout_buy_now");
  const buyNowData = location.state || storedData;
  const [buyNowQty, setBuyNowQty] = useState(
    buyNowData?.quantity || 1
  );

  const [paymentMode, setPaymentMode] = useState("cod");

  // order place states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const checkoutType = searchParams.get("type");

  const getPreview = async () => {
    try {
      const res = await api.post("/checkout/preview", {
        type: checkoutType,
        productId: buyNowData?.productId,
        variantId: buyNowData?.variantId,
        buyNowQty
      });
      console.log("Checkout Preview Data:", res.data);
      if(res.data && res.data.status === "success" && res.data.data.cartItems.length === 0) {
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
    setUpdateFlag(prev => !prev);
  };

  const decrementQty = () => {
    if (buyNowQty > 1) {
      setBuyNowQty(prev => prev - 1);
      setUpdateFlag(prev => !prev);
    }
  };

  const handleUpdateQuantityCart = async (cartItemId, type, quantity = 1) => {
    try {
      const res = await api.patch(`/cart/items/${cartItemId}`, {
        quantity,
        type
      })
      setUpdateFlag(!updateFlag);
      console.log("user cart update response", res.data);
    } catch (error) {
      console.error("Error updating user cart", error);
    }
  }

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      // Make API call to place order
      const res = await api.post("/orders", {
        type: checkoutType,
        productId: buyNowData?.productId,
        variantId: buyNowData?.variantId,
        buyNowQty,
        paymentMethod: paymentMode
      });
      console.log("Place order response:", res.data);


      setOrderId(res.data.order.orderId);
      setSuccess(res.data && res.data.status === "success");
      setLoading(false);
      // Clear buy now data from session storage
      sessionStorage.removeItem("checkout_buy_now");
      // Redirect to order confirmation or orders page
      if (res.data && res.data.status === "success") {
        setTimeout(() => {
          document.body.style.overflow = "auto";
          navigate(`/profile/orders`);
        }, 2500);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  }


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
    if (success) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [success]);


  useEffect(() => {
    getPreview();
  }, [updateFlag]);

  // return (
  //   <div className="px-2 lg:px-20 py-10">
  //     <h1 className="text-4xl font-bold">CHECKOUT</h1>

  //     <div className="grid grid-cols-12 my-8 gap-4">
  //       {/* LEFT SIDE */}
  //       <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
  //         {/* Cart Items */}
  //         <div className="border rounded-2xl border-gray-300 p-5">
  //           {previewData && previewData.cartItems.length > 0 ? previewData.cartItems.map((item, index, array) => (
  //             <div key={index}>

  //               <div className="item flex items-center ">
  //                 <Link to={`../products/${item.productId}?color=${item.attributes.color.colorName}`}>
  //                   <img
  //                     className="h-30 aspect-square object-cover rounded-lg cursor-pointer"
  //                     src={item.mainImage}
  //                     alt=""
  //                   />
  //                 </Link>
  //                 <div className=" flex justify-between w-full h-30">
  //                   <div className="mx-4 flex flex-col justify-between">
  //                     <div>
  //                       <span className="font-medium text-xl">{item.title}</span>
  //                       <span className="flex gap-1">
  //                         <p className=" text-sm">Size:</p>{" "}
  //                         <p className="text-gray-500 text-sm flex"> {item.attributes.size.sizeName} </p>
  //                       </span>
  //                       <span className="flex gap-1">
  //                         <p className=" text-sm">Qty:</p>{" "}
  //                         <p className="text-gray-500 text-sm flex"> {item.quantity} </p>
  //                       </span>

  //                     </div>
  //                     <div className="space-x-2">
  //                       <span className="pt-2 text-xl font-medium ">Rs. {item.price}</span>
  //                       <span className="pt-2 text-sm font-medium text-gray-400 line-through">Rs. {item.mrp}</span>
  //                     </div>
  //                   </div>
  //                   <div className="flex flex-col justify-end items-end">
  //                     <div className="flex text-lg ">
  //                       <button onClick={() => checkoutType === "CART" ? handleUpdateQuantityCart(item._id, "decrement") : decrementQty()} className={`${item.quantity === 1 ? "cursor-not-allowed " : "cursor-pointer focus:ring-1 focus:ring-gray-600 focus:ring-inset"} py-1 px-4 bg-stone-200  rounded-l-full  box-border`}>
  //                         -
  //                       </button>

  //                       <span className="py-1 px-3 bg-stone-200  select-none">
  //                         {item.quantity}
  //                       </span>

  //                       <button onClick={() => checkoutType === "CART" ? handleUpdateQuantityCart(item._id, "increment") : incrementQty()} className="py-1 px-4 bg-stone-200  rounded-r-full cursor-pointer focus:ring-1 focus:ring-gray-600 focus:ring-inset box-border">
  //                         +
  //                       </button>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </div>
  //               {
  //                 array.length - 1 !== index && (
  //                   <div className="w-full border-b border-b-gray-300 my-4"></div>
  //                 )
  //               }
  //             </div>
  //           )) : <div className="text-center">Cart is empty</div>}
  //         </div>
  //         {/* ADDRESS */}
  //         <div className="bg-white rounded-2xl shadow p-6">

  //           <div className="flex justify-between items-center mb-4">

  //             <h2 className="text-xl font-semibold">
  //               Delivery Address
  //             </h2>

  //             {previewData?.address && (
  //               <button
  //                 onClick={() => navigate("/profile/addresses")}
  //                 className="text-indigo-600 text-sm font-medium hover:underline"
  //               >
  //                 Change
  //               </button>
  //             )}

  //           </div>


  //           {/* ADDRESS FOUND */}
  //           {previewData?.address ? (

  //             <div className="space-y-1">

  //               <p className="font-medium text-gray-900">
  //                 {previewData.address.fullName}
  //               </p>

  //               <p className="text-sm text-gray-600 leading-relaxed">

  //                 {previewData.address.addressLine1}

  //                 {previewData.address.addressLine2 &&
  //                   `, ${previewData.address.addressLine2}`}

  //                 {previewData.address.landmark &&
  //                   `, Near ${previewData.address.landmark}`}

  //                 <br />

  //                 {previewData.address.city}, {previewData.address.state}
  //                 {" "}– {previewData.address.pincode}

  //                 <br />

  //                 India

  //               </p>

  //               <p className="text-sm text-gray-600">
  //                 Phone: {previewData.address.phone}
  //               </p>

  //               {previewData.address.alternatePhone && (
  //                 <p className="text-sm text-gray-600">
  //                   Alt: {previewData.address.alternatePhone}
  //                 </p>
  //               )}


  //               {/* DEFAULT BADGE */}
  //               {previewData.address.isDefault && (
  //                 <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
  //                   Default Address
  //                 </span>
  //               )}

  //             </div>

  //           ) : (

  //             /* NO ADDRESS */
  //             <div
  //               // onClick={() => navigate("/profile/addresses/add?redirect=/checkout")}
  //               onClick={() => {
  //                 const redirectUrl =
  //                   location.pathname + location.search;

  //                 navigate(
  //                   `/profile/addresses/add?redirect=${encodeURIComponent(redirectUrl)}`
  //                 );
  //               }}

  //               className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 transition"
  //             >

  //               <p className="text-gray-500 mb-1">
  //                 No address found
  //               </p>

  //               <p className="text-indigo-600 font-medium">
  //                 + Add New Address
  //               </p>

  //             </div>

  //           )}

  //         </div>


  //         {/* Delivery Option */}
  //         <div className="border border-gray-300 rounded-2xl p-5">
  //           <h2 className="text-xl font-medium mb-4">Delivery Options</h2>

  //           <div className="flex justify-between items-center border p-4 rounded-xl">
  //             <div>
  //               <p className="font-medium">Standard Delivery</p>
  //               <p className="text-sm text-gray-500">3–5 business days</p>
  //             </div>
  //             <p className="font-medium">FREE</p>
  //           </div>
  //         </div>

  //         {/* Payment */}
  //         <div className="border border-gray-300 rounded-2xl p-5">
  //           <h2 className="text-xl font-medium mb-4">Payment Method</h2>

  //           <div className="space-y-3">
  //             <label className="flex items-center gap-3 cursor-pointer">
  //               <input type="radio" name="payment" defaultChecked onChange={(e) => setPaymentMode(e.target.value)} value="cod" />
  //               <span>Cash on Delivery</span>
  //             </label>

  //             <label className="flex items-center gap-3 cursor-pointer text-gray-400">
  //               <input type="radio" name="payment" value="online" disabled onChange={(e) => setPaymentMode(e.target.value)} />
  //               <span>Online Payment (Coming Soon)</span>
  //             </label>
  //           </div>
  //         </div>

  //       </div>

  //       {/* RIGHT SIDE SUMMARY */}
  //       {previewData?.cartSummary?.total > 0 && <div className="col-span-12 lg:col-span-4 p-5 sticky top-20 border h-fit border-gray-300 rounded-2xl flex flex-col gap-4">
  //         <p className="text-xl font-medium">Order Summary</p>

  //         <div className="flex justify-between">
  //           <p className="text-gray-500">Subtotal</p>
  //           <p className="font-medium">Rs. {previewData?.cartSummary?.subtotal || 0}</p>
  //         </div>

  //         <div className="flex justify-between">
  //           <p className="text-gray-500">Discount</p>
  //           <p className="font-medium text-red-500">
  //             Rs. {previewData?.cartSummary?.discount || 0}
  //           </p>
  //         </div>

  //         <div className="flex justify-between">
  //           <p className="text-gray-500">Delivery Fee</p>
  //           <p className="font-medium">Rs. {previewData?.cartSummary?.deliveryCharge || 0}</p>
  //         </div>

  //         <div className="w-full border-b border-gray-300"></div>

  //         {/* <div className="flex justify-between text-lg">
  //           <p className="font-medium">Total</p>
  //           <p className="font-bold">Rs. {previewData?.cartSummary?.total || 0}</p>
  //         </div> */}
  //         <div >
  //           <div className="flex justify-between text-lg">
  //             <p className="font-medium">Total</p>{" "}
  //             <p className="font-bold">Rs. {previewData?.cartSummary?.finalTotal || 0}</p>
  //           </div>
  //           <p className="text-xs text-gray-500 mt-1 text-right">
  //             Inclusive of all taxes
  //           </p>
  //         </div>

  //         {!success && (
  //           <button
  //             onClick={handlePlaceOrder}
  //             disabled={loading}
  //             // className="px-8 py-3 bg-black rounded-full text-white font-medium"
  //             className="w-full py-3 rounded-lg text-white font-semibold bg-black hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
  //           >
  //             {loading && (
  //               <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
  //             )}
  //             {loading ? "Placing order..." : "Place Order"}
  //           </button>
  //         )}
  //       </div>}
  //     </div>
  //     {success && (
  //       <div className="
  //   fixed inset-0 z-50
  //   bg-black/40 backdrop-blur-sm
  //   flex items-center justify-center
  // ">

  //         <div className="
  //     bg-white rounded-2xl shadow-xl
  //     px-8 py-10
  //     w-[90%] max-w-md
  //     text-center
  //     animate-fadeIn
  //   ">

  //           {/* Check Icon */}
  //           <div className="
  //       mx-auto w-20 h-20 rounded-full bg-green-100
  //       flex items-center justify-center
  //       animate-scaleIn
  //     ">
  //             <svg
  //               className="w-10 h-10 text-green-600"
  //               fill="none"
  //               stroke="currentColor"
  //               strokeWidth="3"
  //               viewBox="0 0 24 24"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 d="M5 13l4 4L19 7"
  //               />
  //             </svg>
  //           </div>

  //           {/* Text */}
  //           <h2 className="mt-4 text-2xl font-bold text-gray-800">
  //             Order Placed Successfully 🎉
  //           </h2>

  //           <p className="mt-2 text-gray-600">
  //             Order ID: <span className="font-medium">{orderId}</span>
  //           </p>

  //           <p className="mt-1 text-sm text-gray-500">
  //             Redirecting to your orders…
  //           </p>

  //         </div>
  //       </div>
  //     )}

  //   </div>
  // );



  return (
  <div className="min-h-screen bg-gray-50 px-4 lg:px-16 py-10">

    {/* HEADER */}
    <div className="max-w-6xl mx-auto mb-8">

      <h1 className="text-4xl font-semibold text-gray-900">
        Checkout
      </h1>

      <p className="text-gray-500 mt-1">
        Review your order and complete purchase
      </p>

    </div>


    <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">

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
        {/* KEEP YOUR NEW ADDRESS SECTION HERE */}


        {/* DELIVERY */}
        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Delivery Method
          </h2>

          <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4">

            <div>
              <p className="font-medium">
                Standard Delivery
              </p>

              <p className="text-sm text-gray-500">
                3–5 business days
              </p>

            </div>

            <span className="font-semibold text-green-600">
              FREE
            </span>

          </div>

        </div>


        {/* PAYMENT */}
        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Payment Method
          </h2>

          <div className="space-y-4">

            <label className="flex items-center gap-3 cursor-pointer">

              <input
                type="radio"
                name="payment"
                defaultChecked
                value="cod"
                onChange={(e) => setPaymentMode(e.target.value)}
              />

              <span>Cash on Delivery</span>

            </label>


            <label className="flex items-center gap-3 text-gray-400">

              <input type="radio" disabled />

              <span>Online Payment (Coming Soon)</span>

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
              red
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


            {!success && (

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60 flex justify-center items-center gap-2"
              >

                {loading && (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}

                {loading ? "Placing Order..." : "Place Order"}

              </button>

            )}

          </div>

        </div>
      )}

    </div>
  </div>
);



}

export default Checkout;





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
