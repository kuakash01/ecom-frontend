import React, { useEffect, useState, useRef } from "react";
import api from "../../../config/axios";
import { toast } from "react-toastify";

function Carousel() {
  const [carouselData, setCarouselData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  const TRANSITION_TIME = 1500;  // 1s animation
  const AUTO_TIME = 4000;        // 4s auto scroll

  const getCarousel = async () => {
    try {
      const res = await api.get("/carousel");
      if (!res.data?.data) {
        toast.error("Failed to get carousel");
        return;
      }
      setCarouselData(res.data.data);
    } catch (error) {
      console.log("Error fetching carousel", error);
    }
  };

  useEffect(() => {
    getCarousel();
  }, []);

  // Start autoplay
  const startAuto = () => {
    stopAuto();
    intervalRef.current = setInterval(() => {
      nextSlide(true);
    }, AUTO_TIME);
  };

  // Stop autoplay
  const stopAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Start autoplay after data loads
  useEffect(() => {
    if (carouselData.length) startAuto();
    return stopAuto;
  }, [carouselData]);

  const nextSlide = (auto = false) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrent(prev => prev + 1);

    if (!auto) {
      stopAuto();
      startAuto();
    }
  };

  const prevSlide = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrent(prev => prev - 1);

    stopAuto();
    startAuto();
  };

  // Handle infinite loop
  useEffect(() => {
    const handleTransitionEnd = () => {
      const total = carouselData.length;

      if (current === total + 1) {
        sliderRef.current.style.transition = "none";
        setCurrent(1);

        setTimeout(() => {
          sliderRef.current.style.transition = `transform ${TRANSITION_TIME}ms ease`;
        }, 20);
      }

      if (current === 0) {
        sliderRef.current.style.transition = "none";
        setCurrent(total);

        setTimeout(() => {
          sliderRef.current.style.transition = `transform ${TRANSITION_TIME}ms ease`;
        }, 20);
      }

      setIsAnimating(false);
    };

    const slider = sliderRef.current;
    slider.addEventListener("transitionend", handleTransitionEnd);
    return () => slider.removeEventListener("transitionend", handleTransitionEnd);
  }, [current, carouselData]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        stopAuto(); // freeze everything
      } else {
        // Fix broken transitions after returning
        sliderRef.current.style.transition = "none";

        setCurrent(prev => {
          const total = carouselData.length;
          if (prev > total) return 1;
          if (prev < 1) return total;
          return prev;
        });

        setTimeout(() => {
          sliderRef.current.style.transition = `transform ${TRANSITION_TIME}ms ease`;
          startAuto();
        }, 50);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [carouselData]);


  const extendedSlides = [
    carouselData[carouselData.length - 1],
    ...carouselData,
    carouselData[0],
  ];

  // return (
  //   <div className="relative overflow-hidden w-full h-full">
  //     {/* Navigation Zones */}
  //     <div
  //       onClick={prevSlide}
  //       className="absolute left-0 top-0 h-full w-[12%] cursor-pointer z-20
  //            group"
  //     >
  //       <div
  //         className="
  //     absolute left-0 top-0 h-full w-[2px]
  //     pointer-events-none bg-transparent
  //     group-hover:shadow-[-50px_0_70px_rgba(0,0,0,0.5)]
  //     transition-shadow duration-300
  //   "
  //       ></div>
  //     </div>




  //     <div
  //       onClick={nextSlide}
  //       className="absolute right-0 top-0 h-full w-[12%] cursor-pointer z-20 
  //            hover:shadow-[inset_-40px_0_60px_rgba(0,0,0,0.35)] transition-shadow duration-300"
  //     ></div>



  //     {/* Slider */}
  //     <div
  //       ref={sliderRef}
  //       className="flex h-full"
  //       style={{
  //         transform: `translateX(-${current * 100}%)`,
  //         transition: `transform ${TRANSITION_TIME}ms ease`,
  //       }}
  //     >
  //       {extendedSlides.map((item, index) => (
  //         <img
  //           key={index}
  //           src={item?.image?.url}
  //           alt="carousel"
  //           className="w-full flex-shrink-0 object-cover"
  //         />
  //       ))}
  //     </div>



  //   </div>
  // );

  return (
    <div className="relative overflow-hidden w-full h-full">

      {/* LEFT Navigation Zone */}
      <div
        onClick={prevSlide}
        className="absolute left-0 top-0 h-full w-[12%] cursor-pointer z-20 
             bg-gradient-to-r from-black/30 to-transparent
             opacity-0 hover:opacity-100 transition-opacity duration-300"
      ></div>


      {/* RIGHT Navigation Zone */}
      <div
        onClick={nextSlide}
        className="absolute right-0 top-0 h-full w-[12%] cursor-pointer z-20 
             bg-gradient-to-l from-black/30 to-transparent
             opacity-0 hover:opacity-100 transition-opacity duration-300"
      ></div>


      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex h-full"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: `transform ${TRANSITION_TIME}ms ease`,
        }}
      >
        {extendedSlides.map((item, index) => (
          <img
            key={index}
            src={item?.image?.url}
            alt="carousel"
            className="w-full flex-shrink-0 object-cover"
          />
        ))}
      </div>

    </div>
  );


}

export default Carousel;
