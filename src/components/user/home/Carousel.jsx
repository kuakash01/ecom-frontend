import React, { useEffect, useState, useRef } from "react";
import api from "../../../config/apiUser";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BannerSkeleton from "../../user/loadingSkeleton/BannerSkeleton";

function Carousel() {
  const [carouselData, setCarouselData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const { isMobileOpen } = useSelector((state) => state.theme);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  const TRANSITION_TIME = 800;
  const AUTO_TIME = 4000;


  // redirect handling
  const handleRedirect = (item) => {
    if (!item?.redirectType || !item?.redirectValue) return;

    switch (item.redirectType) {

      case "product":
        navigate(`/products/${item.redirectValue}`);
        break;

      case "category":
        navigate(`/${item.redirectValue}`);
        break;

      case "filter":
        navigate(`/shop?${item.redirectValue}`);
        break;

      case "landing":
        navigate(`/landing/${item.redirectValue}`);
        break;

      case "external":
        window.open(item.redirectValue, "_blank");
        break;

      default:
        break;
    }
  };

  // Fetch carousel
  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        setLoading(true);
        const res = await api.get("/carousel");
        setCarouselData(res.data?.data || []);
      } catch (error) {
        console.error("Carousel fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarousel();
  }, []);

  // Extended slides (for infinite effect)
  const extendedSlides =
    carouselData.length > 0
      ? [
        carouselData[carouselData.length - 1],
        ...carouselData,
        carouselData[0],
      ]
      : [];

  // Auto play
  const startAuto = () => {
    stopAuto();
    intervalRef.current = setInterval(() => {
      nextSlide(true);
    }, AUTO_TIME);
  };

  const stopAuto = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (carouselData.length) startAuto();
    return stopAuto;
  }, [carouselData]);

  const nextSlide = (auto = false) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => prev + 1);

    if (!auto) {
      stopAuto();
      startAuto();
    }
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => prev - 1);
    stopAuto();
    startAuto();
  };

  // Infinite handling
  useEffect(() => {
    const handleTransitionEnd = () => {
      const total = carouselData.length;

      if (current === total + 1) {
        sliderRef.current.style.transition = "none";
        setCurrent(1);
      }

      if (current === 0) {
        sliderRef.current.style.transition = "none";
        setCurrent(total);
      }

      setTimeout(() => {
        sliderRef.current.style.transition = `transform ${TRANSITION_TIME}ms ease`;
      }, 20);

      setIsAnimating(false);
    };

    const slider = sliderRef.current;
    slider?.addEventListener("transitionend", handleTransitionEnd);
    return () =>
      slider?.removeEventListener("transitionend", handleTransitionEnd);
  }, [current, carouselData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause autoplay
        stopAuto();
      } else {
        // Reset animation state
        setIsAnimating(false);

        if (!sliderRef.current) return;

        // Disable transition
        sliderRef.current.style.transition = "none";

        setCurrent((prev) => {
          const total = carouselData.length;

          if (prev > total) return 1;
          if (prev < 1) return total;

          return prev;
        });

        // Re-enable transition + restart autoplay
        setTimeout(() => {
          if (sliderRef.current) {
            sliderRef.current.style.transition = `transform ${TRANSITION_TIME}ms ease`;
          }

          startAuto();
        }, 50);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [carouselData]);

  if (!carouselData.length && !loading) return null;
  if (loading) return <BannerSkeleton />;

  return (
    <div className="relative w-full h-full md:h-full overflow-hidden group">

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
          <div
            key={index}
            className="w-full flex-shrink-0 overflow-y-auto cursor-pointer hover:opacity-95 transition"
            onClick={() => handleRedirect(item)}
          >

            <img
              src={
                isMobileOpen
                  ? item?.mobileImage?.url
                  : item?.desktopImage?.url
              }
              alt="banner"
              className={`w-full h-full ${isMobileOpen
                ? "object-contain"
                : "object-cover"
                }`}
            />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 
                   bg-white/20 backdrop-blur-md
                   p-2 rounded-full
                   opacity-0 group-hover:opacity-100
                   transition-all duration-300
                   hover:bg-white/40"
      >
        <ChevronLeft className="text-white" size={28} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 
                   bg-white/20 backdrop-blur-md
                   p-2 rounded-full
                   opacity-0 group-hover:opacity-100
                   transition-all duration-300
                   hover:bg-white/40"
      >
        <ChevronRight className="text-white" size={28} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {carouselData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index + 1)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${current === index + 1
              ? "bg-white w-6"
              : "bg-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;