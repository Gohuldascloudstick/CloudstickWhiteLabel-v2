import { useState, useEffect, useRef } from "react";

/**
 * A custom hook to determine if an element should be visible based on scroll direction.
 * @param threshold The scroll distance in pixels before the effect starts.
 * @returns {boolean} `true` if the element should be visible (scrolling up or near the top), `false` otherwise.
 */
export function useScrollVisible(threshold = 50) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      const isScrollingUp = currentScrollY < lastScrollY.current;
      const isNearTop = currentScrollY <= threshold;

      if (isNearTop) {
        setIsVisible(true);
      } else if (isScrollingUp) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return isVisible;
}