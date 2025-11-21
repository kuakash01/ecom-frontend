import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useScrollToTop(smooth = false) {
    const { pathname } = useLocation();

    useEffect(() => {
        if (smooth) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname, smooth]);
}
