import React from "react";

function DressStyle() {
  return (
    <div className="my-8 px-4 md:px-20">
      <div className="bg-gray-200 rounded-[2rem] p-5 md:p-15">
        <h3 className="text-4xl text-center font-bold mb-6">
          BROWSE BY DRESS STYLE
        </h3>

        {/* Responsive layout: stacked on mobile, side-by-side with equal height on md+ */}
        <div className="grid gap-4 pt-5">
          <div className="flex flex-col h-96 md:h-72 md:flex-row gap-4">
            <div className="w-full md:w-5/12 overflow-hidden rounded-xl relative">
              <img
                className="w-full h-full aspect-video object-cover object-top"
                src={`${import.meta.env.VITE_BASE_URL}/images/dress-style/young-handsome-guy-tourist-looking-happy-wearing-straw-hat-travelling-standing-against-yellow-background.jpg`}
              />
              <span className="absolute top-4 left-4 font-bold text-2xl">Casual</span>
            </div>
            <div className="w-full md:w-7/12 overflow-hidden rounded-xl relative">
              <img
                className="w-full h-full aspect-video object-cover object-top"
                src={`${import.meta.env.VITE_BASE_URL}/images/dress-style/lifestyle-portrait-pretty-young-man-with-brunette-hair-beard-mustache-light-shirt-stylish-suit-looking-front-posing-against-violet-wall.jpg`}
              />
               <span className="absolute top-4 left-4 font-bold text-2xl">Formal</span>
            </div>
          </div>
          <div className="flex flex-col h-96 md:h-72 md:flex-row gap-4">
            <div className="w-full md:w-7/12 overflow-hidden rounded-xl relative">
              <img
                className="w-full h-full aspect-video object-cover "
                src={`${import.meta.env.VITE_BASE_URL}/images/dress-style/portrait-smiling-young-woman-against-white-background_1048944-7532538.jpg`}
              />
               <span className="absolute top-4 left-4 font-bold text-2xl">Party</span>
            </div>
            <div className="w-full md:w-5/12 overflow-hidden rounded-xl relative">
              <img
                className="w-full h-full aspect-video object-cover"
                src={`${import.meta.env.VITE_BASE_URL}/images/dress-style/young-man-woman-training-together-bodybuilding.jpg`}
              />
               <span className="absolute top-4 left-4 font-bold text-2xl">Gym</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DressStyle;
