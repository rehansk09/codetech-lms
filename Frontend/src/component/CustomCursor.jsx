import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;

    const cursor = cursorRef.current;
    if (!cursor) return undefined;

    let hideTimer;
    const showCursor = () => {
      window.clearTimeout(hideTimer);
      gsap.to(cursor, { autoAlpha: 1, duration: 0.15 });
    };
    const hideCursor = () =>
      gsap.to(cursor, { autoAlpha: 0, duration: 0.2, overwrite: true });
    const moveCursorX = gsap.quickTo(cursor, "x", {
      duration: 0.14,
      ease: "power3.out",
    });
    const moveCursorY = gsap.quickTo(cursor, "y", {
      duration: 0.14,
      ease: "power3.out",
    });

    gsap.set(cursor, {
      x: 0,
      y: 0,
      xPercent: -50,
      yPercent: -50,
      autoAlpha: 0,
    });

    const moveCursor = (event) => {
      moveCursorX(event.clientX);
      moveCursorY(event.clientY);
      showCursor();
    };
    const moveTouchCursor = (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      moveCursor(touch);
    };
    const hideTouchCursor = (event) => {
      if (event.type === "touchend" || event.type === "touchcancel") {
        hideTimer = window.setTimeout(hideCursor, 650);
      }
    };

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("touchstart", moveTouchCursor, { passive: true });
    document.addEventListener("touchmove", moveTouchCursor, { passive: true });
    document.addEventListener("touchend", hideTouchCursor, { passive: true });
    document.addEventListener("touchcancel", hideTouchCursor, {
      passive: true,
    });
    window.addEventListener("blur", hideCursor);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("touchstart", moveTouchCursor);
      document.removeEventListener("touchmove", moveTouchCursor);
      document.removeEventListener("touchend", hideTouchCursor);
      document.removeEventListener("touchcancel", hideTouchCursor);
      window.removeEventListener("blur", hideCursor);
      window.clearTimeout(hideTimer);
      gsap.killTweensOf(cursor);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
};

export default CustomCursor;
