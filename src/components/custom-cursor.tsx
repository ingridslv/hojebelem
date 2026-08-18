"use client";
import { useEffect, useRef } from "react";
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null),
    dotRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const ring = ringRef.current,
      dot = dotRef.current;
    if (!ring || !dot) return;
    let frame = 0,
      x = -100,
      y = -100,
      ringX = x,
      ringY = y;
    const animate = () => {
      ringX += (x - ringX) * 0.18;
      ringY += (y - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = window.requestAnimationFrame(animate);
    };
    const move = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      document.body.classList.add("custom-cursor-visible");
    };
    const hover = (event: MouseEvent) => {
      const interactive = (event.target as Element | null)?.closest(
        "a, button, input, textarea, select, [role='button']",
      );
      ring.classList.toggle("cursor-hover", Boolean(interactive));
    };
    const hide = () => document.body.classList.remove("custom-cursor-visible");
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", hover);
    document.documentElement.addEventListener("mouseleave", hide);
    frame = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", hover);
      document.documentElement.removeEventListener("mouseleave", hide);
    };
  }, []);
  return (
    <div className="custom-cursor" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
