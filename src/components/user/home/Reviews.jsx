
import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Reviews() {
  const scrollRef = useRef(null);

  const reviews = [
    {
      name: "Aarav Sharma",
      rating: 5,
      review: "Absolutely loved the quality. Super fast delivery.",
    },
    {
      name: "Priya Mehta",
      rating: 5,
      review: "Perfect fit and beautiful color. Very happy!",
    },
    {
      name: "Rohan Verma",
      rating: 4,
      review: "Good packaging and responsive support.",
    },
    {
      name: "Sneha Kapoor",
      rating: 5,
      review: "Material and finishing are top notch.",
    },
    {
      name: "Aditya Rao",
      rating: 4,
      review: "Value for money. Will explore more.",
    },
  ];

  // Clone for infinite loop
  const loopItems = [
    ...reviews,
    ...reviews,
    ...reviews,
  ];

  const CARD_WIDTH = 360; // card + gap (adjust if needed)

  // Start from middle
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft =
        reviews.length * CARD_WIDTH;
    }
  }, []);

  // Handle infinite jump
  const handleScroll = () => {
    if (!scrollRef.current) return;

    const el = scrollRef.current;
    const maxScroll = el.scrollWidth / 3;

    // If scrolled too left → jump to middle
    if (el.scrollLeft <= CARD_WIDTH) {
      el.scrollLeft += maxScroll;
    }

    // If scrolled too right → jump back
    if (el.scrollLeft >= maxScroll * 2) {
      el.scrollLeft -= maxScroll;
    }
  };

  // Button scroll
  const scroll = (dir) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: dir === "left" ? -CARD_WIDTH : CARD_WIDTH,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-gray-50 py-14">

      <div className="max-w-[1600px] mx-auto px-4 md:px-10 relative">

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-10">
          Loved by Our Customers
        </h2>

        {/* Left Button */}
        <button
          onClick={() => scroll("left")}
          className="
            hidden lg:flex
            absolute left-0 top-1/2 -translate-y-1/2 z-10
            w-10 h-10 rounded-full bg-white shadow-lg
            items-center justify-center
            hover:bg-gray-100
          "
        >
          ◀
        </button>

        {/* Right Button */}
        <button
          onClick={() => scroll("right")}
          className="
            hidden lg:flex
            absolute right-0 top-1/2 -translate-y-1/2 z-10
            w-10 h-10 rounded-full bg-white shadow-lg
            items-center justify-center
            hover:bg-gray-100
          "
        >
          ▶
        </button>
        

        {/* Slider */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="
            flex gap-6
            overflow-x-auto
            scroll-smooth
            hide-scrollbar
            pb-6
          "
        >

          {loopItems.map((item, i) => (

            <div
              key={i}
              className="
                flex-shrink-0

                w-[260px]
                sm:w-[300px]
                lg:w-[340px]

                bg-white rounded-2xl
                p-6 shadow-md

                hover:shadow-xl
                transition
              "
            >
              {/* Stars */}
              <div className="text-yellow-400 mb-3">
                {"★".repeat(item.rating)}
              </div>

              {/* Review */}
              <p className="text-gray-600 text-sm mb-5">
                “{item.review}”
              </p>

              {/* User */}
              <p className="font-semibold text-sm">
                — {item.name}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default Reviews;



// import React from "react";

// function Reviews() {

//   const reviews = [
//     {
//       name: "Aarav Sharma",
//       rating: 5,
//       review:
//         "Absolutely loved the quality! Fabric feels premium and delivery was super fast. Will order again.",
//     },
//     {
//       name: "Priya Mehta",
//       rating: 5,
//       review:
//         "Perfect fit and beautiful color. Exactly as shown in pictures. Highly satisfied!",
//     },
//     {
//       name: "Rohan Verma",
//       rating: 4,
//       review:
//         "Good packaging and responsive support. Overall great shopping experience.",
//     },
//     {
//       name: "Sneha Kapoor",
//       rating: 5,
//       review:
//         "Exceeded my expectations. Material and finishing are top notch.",
//     },
//     {
//       name: "Aditya Rao",
//       rating: 4,
//       review:
//         "Value for money. Will definitely explore more products.",
//     },
//   ];

//   return (
//     <section className="bg-gradient-to-b from-gray-50 to-white py-14">

//       <div className="max-w-[1600px] mx-auto px-4 md:px-10">

//         {/* ================= HEADER ================= */}
//         <div className="mb-10 text-center">

//           <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
//             Loved by Our Customers
//           </h2>

//           <p className="mt-2 text-gray-500 text-sm sm:text-base">
//             Real reviews from people who trust our brand
//           </p>

//         </div>


//         {/* ================= SCROLL ROW ================= */}
//         <div
//           className="
//             flex
//             gap-6

//             overflow-x-auto
//             scroll-smooth
//             pb-6

//             hide-scrollbar
//           "
//         >

//           {reviews.map((item, i) => (

//             <div
//               key={i}
//               className="
//                 flex-shrink-0

//                 w-[260px]
//                 sm:w-[300px]
//                 lg:w-[340px]

//                 rounded-2xl
//                 bg-white/80
//                 backdrop-blur

//                 p-6

//                 shadow-md
//                 hover:shadow-xl

//                 transition-all
//                 duration-300
//               "
//             >

//               {/* Stars */}
//               <div className="text-yellow-400 text-sm mb-3">
//                 {"★".repeat(item.rating)}
//               </div>

//               {/* Review */}
//               <p className="text-gray-600 text-sm leading-relaxed mb-5">
//                 “{item.review}”
//               </p>

//               {/* User */}
//               <div className="flex items-center gap-3">

//                 {/* Fake Avatar */}
//                 <div
//                   className="
//                     w-10 h-10
//                     rounded-full
//                     bg-gradient-to-tr
//                     from-indigo-400
//                     to-pink-400

//                     flex items-center justify-center
//                     text-white
//                     font-semibold
//                     text-sm
//                   "
//                 >
//                   {item.name.charAt(0)}
//                 </div>

//                 <div>
//                   <p className="font-semibold text-sm text-gray-900">
//                     {item.name}
//                   </p>

//                   <p className="text-xs text-gray-400">
//                     Verified Buyer
//                   </p>
//                 </div>

//               </div>

//             </div>
//           ))}

//         </div>

//       </div>
//     </section>
//   );
// }

// export default Reviews;












