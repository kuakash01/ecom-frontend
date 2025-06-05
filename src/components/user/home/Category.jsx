import React from "react";

function Category() {
  return (
    <div className="my-8 px-4 md:px-20">
      <div className="bg-gray-200 rounded-[2rem] p-5 md:p-15">
        <h3 className="text-4xl text-center font-bold mb-6">
          BROWSE BY DRESS STYLE
        </h3>

        {/* Responsive layout: stacked on mobile, side-by-side with equal height on md+ */}
        <div className="grid gap-4 pt-5">
          <div className="flex flex-col h-96 md:h-72 md:flex-row gap-4">
            <div className="w-full md:w-1/3 overflow-hidden rounded-xl">
              <img
                className="w-full h-full aspect-video object-cover"
                src="https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg"
                alt="Style 1"
              />
            </div>
            <div className="w-full md:w-2/3 overflow-hidden rounded-xl">
              <img
                className="w-full h-full aspect-video object-cover"
                src="https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg"
                alt="Style 2"
              />
            </div>
          </div>
          <div className="flex flex-col h-96 md:h-72 md:flex-row gap-4">
            <div className="w-full md:w-2/3 overflow-hidden rounded-xl">
              <img
                className="w-full h-full aspect-video object-cover"
                src="https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg"
                alt="Style 1"
              />
            </div>
            <div className="w-full md:w-1/3 overflow-hidden rounded-xl">
              <img
                className="w-full h-full aspect-video object-cover"
                src="https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg"
                alt="Style 2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Category;
