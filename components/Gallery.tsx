"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { galleryCategories, galleryImages } from "@/data/church";

export default function Gallery() {
  const [active, setActive] = useState<string>("அனைத்தும்");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    active === "அனைத்தும்"
      ? galleryImages
      : galleryImages.filter((g) => g.category === active);

  function openLightbox(index: number) {
    setLightboxIndex(index);
  }

  function closeLightbox() {
    setLightboxIndex(null);
  }

  function prevImage() {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filtered.length - 1));
  }

  function nextImage() {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! < filtered.length - 1 ? prev! + 1 : 0));
  }

  return (
    <div>
      {/* Category Filter Pills with Item Count Badges */}
      <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
        {["அனைத்தும்", ...galleryCategories].map((cat) => {
          const count =
            cat === "அனைத்தும்"
              ? galleryImages.length
              : galleryImages.filter((img) => img.category === cat).length;

          const isSelected = active === cat;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                isSelected
                  ? "bg-gradient-to-r from-crimson via-gold to-royal text-white shadow-md shadow-crimson/25 scale-105"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-gold hover:text-navy-900 shadow-sm"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  isSelected
                    ? "bg-white/25 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Gallery Photos Grid */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openLightbox(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-950 shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover border border-slate-200/80 hover:border-gold/50 text-left"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent opacity-70 transition-opacity group-hover:opacity-90" />

            {/* Center Zoom Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-navy-950 shadow-glow-gold">
                <ZoomIn size={22} />
              </span>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-4 left-4 right-4 text-left">
              <span className="inline-block rounded-full bg-crimson px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                {img.category}
              </span>
              <p className="mt-1.5 text-xs font-bold text-white truncate drop-shadow">
                {img.alt}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Interactive Lightbox Popup Modal */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/95 p-4 sm:p-8 backdrop-blur-md animate-overlay-fade-in"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            type="button"
            aria-label="மூடு"
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-crimson hover:scale-110"
            onClick={closeLightbox}
          >
            <X size={24} />
          </button>

          {/* Prev Button */}
          <button
            type="button"
            aria-label="முந்தைய படம்"
            className="absolute left-4 sm:left-8 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition-all hover:bg-gold hover:text-navy-950 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            <ChevronLeft size={28} />
          </button>

          {/* Next Button */}
          <button
            type="button"
            aria-label="அடுத்த படம்"
            className="absolute right-4 sm:right-8 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition-all hover:bg-gold hover:text-navy-950 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            <ChevronRight size={28} />
          </button>

          {/* Active Image Frame */}
          <div
            className="relative max-h-[82vh] w-full max-w-5xl aspect-[16/10] overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl bg-black animate-popup-spring"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].alt}
              fill
              className="object-contain"
            />
            {/* Overlay Info Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950/90 via-navy-950/60 to-transparent p-4 text-center">
              <span className="badge-vibrant bg-gold text-navy-950 font-black text-[11px]">
                {filtered[lightboxIndex].category}
              </span>
              <p className="mt-1 text-sm font-bold text-white">
                {filtered[lightboxIndex].alt}
              </p>
              <span className="text-[11px] text-slate-300">
                {lightboxIndex + 1} / {filtered.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
