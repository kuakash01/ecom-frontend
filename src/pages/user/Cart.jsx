import React from "react";
import { BinIcon, DiscountIcon } from "../../icons";

function Cart() {
  return (
    <div className="px-2 lg:px-20 py-10">
      <h1 className="text-4xl font-bold ">YOUR CART</h1>

      <div className="grid grid-cols-12 my-8 gap-4">
        {/* cart items start*/}
        <div className="col-span-12  lg:col-span-8 h-fit p-5  space-y-5 border rounded-2xl border-gray-300">
          {[1, 2, 3, 4, 5, 6, 7].map((item, index, array) => (
            <>
              <div className="item flex items-center ">
                <img
                  className="w-fit h-30 aspect-square object-cover rounded-lg"
                  src="/product/product.jpg"
                  alt=""
                />
                <div className=" flex justify-between w-full h-30">
                  <div className="mx-4 flex flex-col justify-between">
                    <div>
                      <span className="font-medium text-xl">Product Name</span>
                      <span className="flex gap-1">
                        <p className=" text-sm">Size:</p>{" "}
                        <p className="text-gray-500 text-sm"> Large</p>
                      </span>
                      <span className="flex gap-1">
                        <p className=" text-sm">Color:</p>{" "}
                        <p className="text-gray-500 text-sm"> White</p>
                      </span>
                    </div>
                    <span className="pt-2 text-xl font-medium ">Rs. 145</span>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <button className="cursor-pointer">
                      <BinIcon className="text-red-500 text-xl" />
                    </button>
                    <div className="flex text-lg">
                      <button className="py-1 px-4 bg-stone-200  rounded-l-full cursor-pointer focus:ring-1 focus:ring-gray-600 focus:ring-inset box-border">
                        -
                      </button>

                      <span className="py-1 px-3 bg-stone-200  select-none">
                        1
                      </span>

                      <button className="py-1 px-4 bg-stone-200  rounded-r-full cursor-pointer focus:ring-1 focus:ring-gray-600 focus:ring-inset box-border">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {array.length - 1 !== index && (
                <div className="w-full border-b border-b-gray-300"></div>
              )}
            </>
          ))}
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
          <button className="px-8 py-2 bg-black rounded-full text-white">
            Go to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
