import React, { useState, useEffect } from "react";
import api from "../../../config/axios";
import { Link } from "react-router-dom";

function NewArrivals() {
  const [newArrivals, setNewArrivals] = useState([]);
  const getNewArrivals = async () => {
    try {
      const res = await api.get("products/newArrivals");
      console.log("new arrivals", res.data);
      setNewArrivals(res.data.data);
    } catch (error) {
      console.error("error fetching new arrivals", error);
    }
  }

  useEffect(() => {
    getNewArrivals();
  }, [])
  return (
    <div className=" my-4  rounded-lg ">
      <h3 className="text-center text-4xl font-bold my-10">New Arrivals</h3>
      <div className="grid grid-cols-12 m-0 md:mx-20 ">
        {newArrivals && newArrivals.map((item, i) => (
          <div key={i} className="col-span-6 md:col-span-3 bg-white rounded-2xl cursor-pointer p-2 group">
            <Link to={`/products/${item._id}`}>
              <img
                className="aspect-[14/16] object-cover rounded-2xl w-full group-hover:scale-105 duration-150"
                src={item.thumbnail.url}
                alt="product"
              />
              <div className="mt-2">
                <p className="text-sm text-gray-400">{item.category}</p>
                <p className="text-lg font-medium">{item.title}</p>
                <div className="flex gap-2 items-center">
                  <p className="text-md font-semibold">₹ {item.price}</p>
                  <p className="text-sm line-through">₹ {item.mrp}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <Link to="/" className="py-2 px-10 block border mx-auto border-gray-200 rounded-full">
          View all
        </Link>
      </div>
    </div>
  );
}

export default NewArrivals;
