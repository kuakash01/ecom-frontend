import React from "react";

function ProductSection() {
  return (
    <div className=" my-4  rounded-lg ">
      <h3 className="text-center text-4xl font-bold my-10">New Arrivals</h3>
      <div className="grid grid-cols-12 m-0 md:mx-20 ">
      {Array(4).fill(0).map((_, i) => (
          <div key={i} className="col-span-6 md:col-span-3 bg-white rounded-2xl  p-2">
            <img
              className="aspect-[14/16] object-cover rounded-2xl w-full"
              src="/product/product.jpg"
              alt="product"
            />
            <div className="mt-2">
              <p className="text-xl font-bold">Product Name</p>
              <p className="text-sm">⭐️⭐️⭐️⭐️☆</p>
              <p className="text-lg font-semibold">₹ 1599</p>
            </div>
          </div>
        ))} 
      </div>
      <div className="flex justify-center mt-4">
      <a href="">view all</a>
      </div>
    </div>
  );
}

export default ProductSection;
