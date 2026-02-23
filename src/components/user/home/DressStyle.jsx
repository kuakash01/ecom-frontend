import React from "react";
import { Link } from "react-router-dom";

function DressStyle() {
  const styles = [
    {
      name: "Casual",
      type: "casual",
      img: "/images/dress-style/young-handsome-guy-tourist-looking-happy-wearing-straw-hat-travelling-standing-against-yellow-background.jpg",
    },
    {
      name: "Formal",
      type: "formal",
      img: "/images/dress-style/lifestyle-portrait-pretty-young-man-with-brunette-hair-beard-mustache-light-shirt-stylish-suit-looking-front-posing-against-violet-wall.jpg",
    },
    {
      name: "Party",
      type: "party",
      img: "/images/dress-style/portrait-smiling-young-woman-against-white-background_1048944-7532538.jpg",
    },
    {
      name: "Gym",
      type: "gym",
      img: "/images/dress-style/young-man-woman-training-together-bodybuilding.jpg",
    },
  ];

  return (
    <div className="my-16 px-4 md:px-20">
      <div className="bg-gray-50 rounded-3xl p-6 md:p-12 shadow-sm">

        {/* Heading */}
        <div className="text-center mb-10">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
            Browse by Dress Style
          </h3>

          <p className="text-gray-500 mt-2">
            Find your perfect look for every occasion
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {styles.map((item, index) => (
            <Link
              key={index}
              to={`/shop?type=${item.type}`}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <img
                src={`${import.meta.env.VITE_BASE_URL}${item.img}`}
                alt={item.name}
                className="w-full h-72 object-cover transform group-hover:scale-110 transition duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

              {/* Text */}
              <div className="absolute bottom-4 left-4 right-4">

                <h4 className="text-white text-xl font-semibold mb-1">
                  {item.name}
                </h4>

                <span className="text-sm text-gray-200">
                  Explore Collection →
                </span>

              </div>

            </Link>
          ))}

        </div>
      </div>
    </div>
  );
}

export default DressStyle;