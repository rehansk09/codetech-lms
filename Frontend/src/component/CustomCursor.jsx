import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return undefined;

    const desktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let hideTimer;
    const moveCursorX = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" });
    const moveCursorY = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" });
    const showCursor = () => {
      window.clearTimeout(hideTimer);
      gsap.to(cursor, { autoAlpha: 1, duration: 0.15, overwrite: true });
    };
    const hideCursor = () => gsap.to(cursor, { autoAlpha: 0, duration: 0.2, overwrite: true });
    const hideTouchCursor = (event) => {
      if (event.pointerType === "touch") {
        hideTimer = window.setTimeout(hideCursor, 700);
      }
    };

    gsap.set(cursor, {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      xPercent: -50,
      yPercent: -50,
      autoAlpha: desktopPointer ? 1 : 0,
    });

    const moveCursor = (event) => {
      moveCursorX(event.clientX);
      moveCursorY(event.clientY);
      showCursor();
    };

    window.addEventListener("pointermove", moveCursor);
    window.addEventListener("pointerdown", moveCursor);
    window.addEventListener("pointerup", hideTouchCursor);
    window.addEventListener("pointercancel", hideTouchCursor);
    window.addEventListener("blur", hideCursor);

    return () => {
      window.removeEventListener("pointermove", moveCursor);
      window.removeEventListener("pointerdown", moveCursor);
      window.removeEventListener("pointerup", hideTouchCursor);
      window.removeEventListener("pointercancel", hideTouchCursor);
      window.removeEventListener("blur", hideCursor);
      window.clearTimeout(hideTimer);
      gsap.killTweensOf(cursor);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
};

export default CustomCursor;
