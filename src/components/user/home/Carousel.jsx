import React, { useEffect, useState, useRef } from "react";
import api from "../../../config/apiUser";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BannerSkeleton from "../../user/loadingSkeleton/BannerSkeleton";

function Carousel() {
  const [carouselData, setCarouselData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const sliderRef = useRef(null);
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const navigate = useNavigate();

  const TRANSITION_TIME = 600;
  const AUTO_TIME = 4000;

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        setLoading(true);
        const res = await api.get("/carousel");
        setCarouselData(res.data?.data || []);
      } catch (err) {
        console.error("Carousel fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarousel();
  }, []);

  /* ================= INFINITE SETUP ================= */

  const extendedSlides =
    carouselData.length > 0
      ? [
          carouselData[carouselData.length - 1],
          ...carouselData,
          carouselData[0],
        ]
      : [];

  /* ================= AUTO SLIDE ================= */

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
    if (carouselData.length > 0) startAuto();
    return stopAuto;
  }, [carouselData]);

  /* ================= SLIDE FUNCTIONS ================= */

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

  /* ================= INFINITE RESET ================= */

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
        if (sliderRef.current) {
          sliderRef.current.style.transition = `transform ${TRANSITION_TIME}ms ease`;
        }
      }, 20);

      setIsAnimating(false);
    };

    const slider = sliderRef.current;
    slider?.addEventListener("transitionend", handleTransitionEnd);

    return () =>
      slider?.removeEventListener("transitionend", handleTransitionEnd);
  }, [current, carouselData]);

  /* ================= TOUCH SUPPORT ================= */

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;

    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  /* ================= REDIRECT ================= */

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

  /* ================= VISIBILITY FIX ================= */

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) stopAuto();
      else startAuto();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [carouselData]);

  if (!carouselData.length && !loading) return null;
  if (loading) return <BannerSkeleton />;

  return (
    <div className="relative w-full overflow-hidden group">

      <div
        ref={sliderRef}
        className="flex w-full"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: `transform ${TRANSITION_TIME}ms ease`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {extendedSlides.map((item, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 cursor-pointer"
            onClick={() => handleRedirect(item)}
          >
            <img
              src={
                window.innerWidth < 768
                  ? item?.mobileImage?.url
                  : item?.desktopImage?.url
              }
              alt="banner"
              className="w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 
                   bg-white/20 backdrop-blur-md p-2 rounded-full
                   opacity-0 md:group-hover:opacity-100 transition"
      >
        <ChevronLeft className="text-white" size={28} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 
                   bg-white/20 backdrop-blur-md p-2 rounded-full
                   opacity-0 md:group-hover:opacity-100 transition"
      >
        <ChevronRight className="text-white" size={28} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {carouselData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index + 1)}
            className={`h-2 w-2 rounded-full transition-all ${
              current === index + 1
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


