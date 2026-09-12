"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Folder,
  FolderOpen,
  ArrowLeft,
  ArrowRight,
  Images,
  Sparkles,
  Heart,
  Church,
} from "lucide-react";
import { galleryAlbums, galleryImages, GalleryAlbum } from "@/data/church";

export default function Gallery() {
  // Currently opened album ID (null means showing folder overview)
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Active album details if one is selected
  const activeAlbum = galleryAlbums.find((a) => a.id === selectedAlbumId) || null;

  // Images in the currently opened album (or all images if none selected)
  const currentImages = activeAlbum
    ? galleryImages.filter((img) => img.category === activeAlbum.category)
    : galleryImages;

  // Keyboard navigation for lightbox
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev! > 0 ? prev! - 1 : currentImages.length - 1
        );
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev! < currentImages.length - 1 ? prev! + 1 : 0
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, currentImages.length]);

  function openAlbum(albumId: string) {
    setSelectedAlbumId(albumId);
    // Smooth scroll to gallery container
    window.scrollTo({ top: 350, behavior: "smooth" });
  }

  function closeAlbum() {
    setSelectedAlbumId(null);
  }

  function prevImage() {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev! > 0 ? prev! - 1 : currentImages.length - 1
    );
  }

  function nextImage() {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev! < currentImages.length - 1 ? prev! + 1 : 0
    );
  }

  // Icon mapping for albums
  function getAlbumIcon(id: string) {
    switch (id) {
      case "festivals-events":
        return <Sparkles size={20} className="text-amber-400" />;
      case "child-ministry":
        return <Heart size={20} className="text-rose-400" />;
      case "church-sanctuary":
        return <Church size={20} className="text-royal-light" />;
      default:
        return <Folder size={20} className="text-gold" />;
    }
  }

  return (
    <div>
      {/* ============================================================== */}
      {/* 1. ROOT FOLDER / ALBUM SELECTION VIEW                          */}
      {/* ============================================================== */}
      {selectedAlbumId === null ? (
        <div className="space-y-8 animate-overlay-fade-in">
          {/* Top Banner Info */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1 text-xs font-black text-navy-950 border border-gold/30">
              <Folder size={14} className="text-gold-dark" />
              <span>திருச்சபை புகைப்பட ஆல்பங்கள் (Photo Albums)</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-navy-900">
              நிகழ்வுகள் & ஊழியங்கள் வாரியான தொகுப்புகள்
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              விரும்பிய ஆல்பத்தை கிளிக் செய்து அதிலுள்ள புகைப்படங்களை தனித்தனியாகக் காணலாம்.
            </p>

            {/* Total Counters Badge */}
            <div className="pt-1 flex items-center justify-center gap-3 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1 shadow-sm">
                <Folder size={13} className="text-gold-dark" />
                {galleryAlbums.length} ஆல்பங்கள் (Albums)
              </span>
              <span className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1 shadow-sm">
                <Images size={13} className="text-crimson" />
                {galleryImages.length} புகைப்படங்கள்
              </span>
            </div>
          </div>

          {/* Grid of Folders / Albums with Stacked Tactile Cover Effect */}
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {galleryAlbums.map((album) => {
              const albumPhotosCount = galleryImages.filter(
                (img) => img.category === album.category
              ).length;

              return (
                <div
                  key={album.id}
                  onClick={() => openAlbum(album.id)}
                  className="group relative cursor-pointer"
                >
                  {/* Layered Stacked Photo Effect Behind (Tactile physical album look) */}
                  <div className="absolute -inset-1.5 rounded-[28px] bg-gradient-to-r from-gold/30 via-crimson/20 to-royal/30 opacity-60 blur-sm group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-3xl bg-slate-800/20 border border-slate-300/40 rotate-[1.5deg] pointer-events-none group-hover:rotate-[3deg] transition-transform duration-300" />

                  {/* Main Folder Card */}
                  <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-card transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:border-gold/60 flex flex-col justify-between h-full">
                    {/* Folder Tab Header */}
                    <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 px-5 py-3 text-white flex items-center justify-between border-b border-white/10">
                      <div className="flex items-center gap-2">
                        {getAlbumIcon(album.id)}
                        <span className="text-xs font-black tracking-wide text-gold-light">
                          {album.tag}
                        </span>
                      </div>
                      <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-black text-slate-200 border border-white/20">
                        {albumPhotosCount} படங்கள்
                      </span>
                    </div>

                    {/* High-Resolution Album Cover Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                      <Image
                        src={album.coverImage}
                        alt={album.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent" />

                      {/* Click to Open Pill Badge (Hover) */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-black text-navy-950 shadow-xl shadow-gold/30 scale-95 group-hover:scale-100 transition-transform">
                          <FolderOpen size={16} />
                          ஆல்பத்தைத் திறக்க (Open Album)
                        </span>
                      </div>

                      {/* Bottom Image Caption inside cover */}
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                          {album.nameEnglish}
                        </span>
                        <h4 className="text-base font-black text-white drop-shadow-md">
                          {album.name}
                        </h4>
                      </div>
                    </div>

                    {/* Album Description & Action Footer */}
                    <div className="p-5 flex flex-col justify-between flex-1 bg-white">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                        {album.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-navy-900 group-hover:text-crimson transition-colors">
                        <span className="flex items-center gap-1 text-gold-dark font-black">
                          <Images size={14} />
                          {albumPhotosCount} புகைப்படங்கள்
                        </span>
                        <span className="inline-flex items-center gap-1 font-black text-royal group-hover:translate-x-1 transition-transform">
                          பார்க்க →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* 2. OPENED ALBUM / FOLDER VIEW (ANIMATED WITH STAGGERED PHOTOS) */
        /* ============================================================== */
        <div className="animate-album-open space-y-8">
          {/* Back to Albums Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 p-4 sm:p-6 text-white shadow-xl border-2 border-gold/40">
            <div className="space-y-1">
              <button
                type="button"
                onClick={closeAlbum}
                className="group inline-flex items-center gap-2 text-xs font-black text-gold-light hover:text-white transition-colors mb-1.5"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>← அனைத்து ஆல்பங்களுக்கும் திரும்பு (Back to All Albums)</span>
              </button>
              <div className="flex items-center gap-2.5">
                {activeAlbum && getAlbumIcon(activeAlbum.id)}
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {activeAlbum?.name}
                </h3>
              </div>
              <p className="text-xs text-slate-300 max-w-xl">
                {activeAlbum?.description}
              </p>
            </div>

            {/* Photo Count Chip in Header */}
            <div className="shrink-0 flex items-center gap-3">
              <span className="rounded-2xl bg-white/10 border border-white/20 px-4 py-2 text-xs font-black text-gold-light shadow-inner">
                {currentImages.length} புகைப்படங்கள்
              </span>
              <button
                type="button"
                onClick={closeAlbum}
                className="rounded-2xl bg-white/15 hover:bg-crimson px-3 py-2 text-xs font-bold text-white transition-colors"
                title="ஆல்பத்தை மூடு"
              >
                ✕ மூடு
              </button>
            </div>
          </div>

          {/* Quick-Switch Between Other Albums Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-bold text-slate-500 shrink-0">மற்ற ஆல்பங்கள்:</span>
            {galleryAlbums.map((alb) => {
              const isCurrent = alb.id === selectedAlbumId;
              const count = galleryImages.filter((img) => img.category === alb.category).length;

              return (
                <button
                  key={alb.id}
                  type="button"
                  onClick={() => openAlbum(alb.id)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? "bg-navy-900 text-gold-light border-2 border-gold shadow-sm scale-102"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-gold hover:text-navy-950 shadow-sm"
                  }`}
                >
                  <span>{alb.name}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                      isCurrent ? "bg-gold text-navy-950" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Photos Grid Inside Active Album */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxIndex(i)}
                style={{ animationDelay: `${i * 45}ms` }}
                className="animate-album-item group relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-950 shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-slate-200/80 hover:border-gold/60 text-left"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-108"
                />

                {/* Dark Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent opacity-70 transition-opacity group-hover:opacity-90" />

                {/* Photo Index Badge (Top-Right) */}
                <div className="absolute top-3.5 right-3.5 z-10">
                  <span className="rounded-full bg-navy-950/80 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-black text-gold-light border border-white/15">
                    #{i + 1}
                  </span>
                </div>

                {/* Center Zoom Hover Indicator */}
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
                  <p className="mt-1 text-xs font-bold text-white truncate drop-shadow">
                    {img.alt}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Bottom Back Button */}
          <div className="pt-6 text-center">
            <button
              type="button"
              onClick={closeAlbum}
              className="btn-outline inline-flex items-center gap-2 !py-2.5 !px-6"
            >
              <ArrowLeft size={16} />
              <span>அனைத்து ஆல்பங்களுக்கும் திரும்பு (Back to Albums)</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. FULLSCREEN INTERACTIVE LIGHTBOX MODAL                       */}
      {/* ============================================================== */}
      {lightboxIndex !== null && currentImages[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/95 p-4 sm:p-8 backdrop-blur-md animate-overlay-fade-in"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button
            type="button"
            aria-label="மூடு"
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-crimson hover:scale-110"
            onClick={() => setLightboxIndex(null)}
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
              src={currentImages[lightboxIndex].src}
              alt={currentImages[lightboxIndex].alt}
              fill
              className="object-contain"
            />
            {/* Overlay Info Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950/90 via-navy-950/60 to-transparent p-4 text-center">
              <span className="badge-vibrant bg-gold text-navy-950 font-black text-[11px]">
                {currentImages[lightboxIndex].category}
              </span>
              <p className="mt-1 text-sm font-bold text-white">
                {currentImages[lightboxIndex].alt}
              </p>
              <span className="text-[11px] text-slate-300">
                {lightboxIndex + 1} / {currentImages.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
