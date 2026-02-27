import { useEffect, useRef, useState } from "react";
import api from "../../../config/apiAdmin";
import { X } from "lucide-react";

function AnnouncementBar() {
  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);

  const textRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await api.get("/announcement");

        if (res.data?.data?.isActive) {
          const hidden = sessionStorage.getItem("hideAnnouncement");
          if (!hidden) {
            setData(res.data.data);
            setTimeout(() => setVisible(true), 100);
          }
        }
      } catch (err) {
        console.error("Failed to fetch announcement");
      }
    };

    fetchAnnouncement();
  }, []);

  // Check if text overflows
  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    const textWidth = textRef.current.scrollWidth;
    const containerWidth = containerRef.current.offsetWidth;

    if (textWidth > containerWidth) {
      setShouldScroll(true);
    }
  }, [data]);

  const handleClose = () => {
    setVisible(false);
    sessionStorage.setItem("hideAnnouncement", "true");
  };

  if (!data) return null;

  return (
    <div
      style={{
        backgroundColor: data.backgroundColor,
        color: data.textColor,
      }}
      className={`
        w-full overflow-hidden
        transition-all duration-500 ease-in-out
        ${visible ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}
      `}
    >
      <div
        ref={containerRef}
        className="relative flex items-center py-1 md:py-2 text-xs md:text-sm font-medium overflow-hidden"
      >
        {/* Sliding Text */}
        <div
          className={`flex whitespace-nowrap ${
            shouldScroll ? "animate-marquee" : ""
          }`}
          onClick={() => data.link && window.open(data.link, "_self")}
        >
          <span ref={textRef} className="px-6 cursor-pointer">
            {data.message}
          </span>

          {/* Duplicate for seamless loop */}
          {shouldScroll && (
            <span className="px-6">{data.message}</span>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 opacity-70 hover:opacity-100 transition"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default AnnouncementBar;