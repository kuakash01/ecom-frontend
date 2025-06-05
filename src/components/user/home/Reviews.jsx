import React from "react";

function Reviews() {
  return (
    <div className=" my-8 px-4 md:px-20">
      <div
        className="flex justify-between
       "
      >
        <h2 className="text-4xl font-bold">OUR HAPPY CUSTOMERS</h2>
        <div className="flex gap-2">
          <button className="">prev</button>
          <button className="">next</button>
        </div>
      </div>

      {/* Review card */}
      <div className="w-full max-w-6xl mx-auto overflow-x-auto">
        <div className="grid grid-cols-12 space-x-4 py-5">
          <div className="col-span-4 space-y-3 border border-gray-300 p-5 rounded-xl">
            <div>⭐️⭐️⭐️⭐️⭐️</div>
            <p className="text-md font-bold">name</p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor ut
              illo, eveniet minus ad possimus ullam aspernatur ab porro
              deserunt!
            </p>
          </div>
          <div className="col-span-4 space-y-3 border border-gray-300 p-5 rounded-xl">
            <div>⭐️⭐️⭐️⭐️⭐️</div>
            <p className="text-md font-bold">name</p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor ut
              illo, eveniet minus ad possimus ullam aspernatur ab porro
              deserunt!
            </p>
          </div>
          <div className="col-span-4 space-y-3 border border-gray-300 p-5 rounded-xl">
            <div>⭐️⭐️⭐️⭐️⭐️</div>
            <p className="text-md font-bold">name</p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor ut
              illo, eveniet minus ad possimus ullam aspernatur ab porro
              deserunt!
            </p>
          </div>
        </div>
      </div>
      {/* <div className="w-full max-w-6xl mx-auto overflow-x-auto">
        <div className="flex space-x-4 py-5">
          {["card1", "card2", "card3", "card4", "card5", "card6"].map(
            (card, i) => (
              <div
                key={i}
                className="w-[80%] sm:w-[45%] md:w-[45%] lg:w-[23%] flex-shrink-0 border border-red-400 p-4"
              >
                {card}
              </div>
            )
          )}
        </div>
      </div> */}
    </div>
  );
}

export default Reviews;
