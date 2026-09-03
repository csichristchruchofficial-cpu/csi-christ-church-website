"use client";

import { useEffect } from "react";

export default function ButtonAnimationProvider() {
  useEffect(() => {
    function handleButtonClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest(
        "button, a.btn-primary, a.btn-crimson, a.btn-royal, a.btn-outline, .btn-primary, .btn-crimson, .btn-royal, .btn-outline, [role='button']"
      ) as HTMLElement | null;

      if (!target) return;

      // Add gentle elegant press class
      target.classList.remove("btn-elegant-press");
      void target.offsetWidth; // force reflow
      target.classList.add("btn-elegant-press");

      // Soft, refined radial light sheen
      const rect = target.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height) * 1.6;
      const radius = diameter / 2;

      const sheen = document.createElement("span");
      sheen.className = "btn-elegant-sheen";
      sheen.style.width = `${diameter}px`;
      sheen.style.height = `${diameter}px`;
      sheen.style.left = `${e.clientX - rect.left - radius}px`;
      sheen.style.top = `${e.clientY - rect.top - radius}px`;

      const existing = target.querySelectorAll(".btn-elegant-sheen");
      existing.forEach((el) => el.remove());

      target.appendChild(sheen);

      setTimeout(() => {
        sheen.remove();
        target.classList.remove("btn-elegant-press");
      }, 500);
    }

    document.addEventListener("click", handleButtonClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleButtonClick, { capture: true });
    };
  }, []);

  return null;
}
