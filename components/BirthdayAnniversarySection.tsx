"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import {
  Cake,
  Heart,
  Sparkles,
  Calendar,
  Search,
  PartyPopper,
  RefreshCw,
  Gift,
  BookOpen,
  Sun,
  Sunrise,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { CelebrationEvent } from "@/lib/celebrations/date-utils";

// Tab Filter: Today, Tomorrow, Birthdays, and Anniversaries.
type TabFilter = "today" | "tomorrow" | "birthdays" | "anniversaries";

/**
 * Luxury Midnight-Navy Birthday Background (Inspired by gold balloons, stardust bokeh & glitter)
 */
function LuxuryBirthdayBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      {/* Deep Midnight Blue / Royal Navy Base */}
      <div className="absolute inset-0 bg-[#060B1E]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A1633] via-[#060B1E] to-[#040815]" />

      {/* Ambient center and top glow */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-400/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 right-0 w-48 h-32 bg-amber-500/10 rounded-full blur-2xl" />

      {/* SVG Layer for Metallic Balloons, Streamers, Glitter & Sparkles */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic Gold Gradient */}
          <radialGradient id="lux-gold-balloon" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="30%" stopColor="#F5C042" />
            <stop offset="70%" stopColor="#D98A18" />
            <stop offset="100%" stopColor="#784405" />
          </radialGradient>

          {/* Pearl White Gradient */}
          <radialGradient id="lux-pearl-balloon" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#F1F5F9" />
            <stop offset="85%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </radialGradient>

          {/* Glitter Gold Gradient */}
          <radialGradient id="lux-glitter-balloon" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#854D0E" />
          </radialGradient>

          {/* Star Flare Glow */}
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* TOP LEFT BALLOONS & RIBBONS */}
        <path
          d="M-10 -10 C 15 25, 5 50, 20 80 C 25 90, 15 105, 22 120"
          stroke="#EAB308"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.65"
          fill="none"
        />
        <path
          d="M25 20 C 35 45, 20 65, 38 95 C 42 105, 35 115, 40 128"
          stroke="#FDE047"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.5"
          fill="none"
        />

        {/* Balloon 1: Pearl White behind */}
        <ellipse cx="22" cy="14" rx="18" ry="24" fill="url(#lux-pearl-balloon)" opacity="0.85" />
        <ellipse cx="17" cy="8" rx="4" ry="8" fill="white" opacity="0.75" transform="rotate(-20 17 8)" />

        {/* Balloon 2: Metallic Gold front left */}
        <ellipse cx="-4" cy="6" rx="20" ry="26" fill="url(#lux-gold-balloon)" />
        <ellipse cx="-9" cy="0" rx="4" ry="9" fill="white" opacity="0.8" transform="rotate(-20 -9 0)" />

        {/* Balloon 3: Glitter Gold accent */}
        <ellipse cx="44" cy="4" rx="14" ry="19" fill="url(#lux-glitter-balloon)" opacity="0.9" />
        <ellipse cx="40" cy="0" rx="3" ry="6" fill="white" opacity="0.7" transform="rotate(-20 40 0)" />

        {/* TOP RIGHT BALLOONS & RIBBONS */}
        <path
          d="M410 -10 C 385 25, 395 50, 380 80 C 375 90, 385 105, 378 120"
          stroke="#EAB308"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.65"
          fill="none"
        />
        <path
          d="M375 20 C 365 45, 380 65, 362 95 C 358 105, 365 115, 360 128"
          stroke="#FDE047"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.5"
          fill="none"
        />

        {/* Balloon 1: Pearl White behind */}
        <ellipse cx="378" cy="14" rx="18" ry="24" fill="url(#lux-pearl-balloon)" opacity="0.85" />
        <ellipse cx="373" cy="8" rx="4" ry="8" fill="white" opacity="0.75" transform="rotate(-20 373 8)" />

        {/* Balloon 2: Metallic Gold front right */}
        <ellipse cx="404" cy="6" rx="20" ry="26" fill="url(#lux-gold-balloon)" />
        <ellipse cx="399" cy="0" rx="4" ry="9" fill="white" opacity="0.8" transform="rotate(-20 399 0)" />

        {/* Balloon 3: Glitter Gold accent */}
        <ellipse cx="356" cy="4" rx="14" ry="19" fill="url(#lux-glitter-balloon)" opacity="0.9" />
        <ellipse cx="352" cy="0" rx="3" ry="6" fill="white" opacity="0.7" transform="rotate(-20 352 0)" />

        {/* FLOATING GOLD SPARKLES & STARS */}
        <g transform="translate(68, 22) scale(0.7)" filter="url(#gold-glow)">
          <path d="M 0 -12 Q 0 0 12 0 Q 0 0 0 12 Q 0 0 -12 0 Q 0 0 0 -12 Z" fill="#FFFBEB" />
          <circle cx="0" cy="0" r="3" fill="#FDE047" />
        </g>
        <g transform="translate(330, 26) scale(0.6)" filter="url(#gold-glow)">
          <path d="M 0 -12 Q 0 0 12 0 Q 0 0 0 12 Q 0 0 -12 0 Q 0 0 0 -12 Z" fill="#FFFBEB" />
          <circle cx="0" cy="0" r="2.5" fill="#FDE047" />
        </g>
        <g transform="translate(200, 16) scale(0.5)" filter="url(#gold-glow)">
          <path d="M 0 -12 Q 0 0 12 0 Q 0 0 0 12 Q 0 0 -12 0 Q 0 0 0 -12 Z" fill="#FFFBEB" />
        </g>

        {/* Bokeh dots along top */}
        <circle cx="95" cy="18" r="2" fill="#FDE047" opacity="0.7" />
        <circle cx="120" cy="10" r="1.5" fill="#FCD34D" opacity="0.6" />
        <circle cx="280" cy="12" r="1.5" fill="#FCD34D" opacity="0.6" />
        <circle cx="305" cy="20" r="2.5" fill="#FDE047" opacity="0.7" />
        <circle cx="160" cy="22" r="1" fill="#FEF08A" opacity="0.8" />
        <circle cx="240" cy="24" r="1.2" fill="#FEF08A" opacity="0.8" />

        {/* BOTTOM CORNERS: GOLD GLITTER DUST */}
        <g filter="url(#gold-glow)">
          <circle cx="14" cy="182" r="3.5" fill="#FDE047" opacity="0.8" />
          <circle cx="28" cy="190" r="2" fill="#FEF08A" opacity="0.9" />
          <circle cx="42" cy="184" r="2.5" fill="#F59E0B" opacity="0.75" />
          <circle cx="22" cy="172" r="1.8" fill="#FFFBEB" opacity="0.9" />
          <circle cx="8" cy="165" r="1.5" fill="#FCD34D" opacity="0.6" />
          <circle cx="35" cy="168" r="1.2" fill="#FEF08A" opacity="0.7" />
          <circle cx="55" cy="188" r="1.5" fill="#FDE047" opacity="0.6" />
          <g transform="translate(18, 175) scale(0.4)">
            <path d="M 0 -12 Q 0 0 12 0 Q 0 0 0 12 Q 0 0 -12 0 Q 0 0 0 -12 Z" fill="#FFFBEB" />
          </g>
        </g>

        <g filter="url(#gold-glow)">
          <circle cx="386" cy="182" r="3.5" fill="#FDE047" opacity="0.8" />
          <circle cx="372" cy="190" r="2" fill="#FEF08A" opacity="0.9" />
          <circle cx="358" cy="184" r="2.5" fill="#F59E0B" opacity="0.75" />
          <circle cx="378" cy="172" r="1.8" fill="#FFFBEB" opacity="0.9" />
          <circle cx="392" cy="165" r="1.5" fill="#FCD34D" opacity="0.6" />
          <circle cx="365" cy="168" r="1.2" fill="#FEF08A" opacity="0.7" />
          <circle cx="345" cy="188" r="1.5" fill="#FDE047" opacity="0.6" />
          <g transform="translate(382, 175) scale(0.4)">
            <path d="M 0 -12 Q 0 0 12 0 Q 0 0 0 12 Q 0 0 -12 0 Q 0 0 0 -12 Z" fill="#FFFBEB" />
          </g>
        </g>
      </svg>

      {/* Luxury Metallic Gold Inner Border */}
      <div className="absolute inset-0 rounded-3xl border border-amber-400/40 pointer-events-none" />
      <div className="absolute inset-[3px] rounded-[22px] border border-amber-300/20 pointer-events-none" />
    </div>
  );
}

/**
 * Luxury Midnight-Plum Anniversary Background (Inspired by glowing hearts, rose gold & starlight)
 */
function LuxuryAnniversaryBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      {/* Deep Royal Midnight Wine / Velvet Plum-Navy */}
      <div className="absolute inset-0 bg-[#0E0412]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1C0824] via-[#0E0412] to-[#08020A]" />

      {/* Ambient center and top glow */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-rose-500/15 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 right-0 w-48 h-32 bg-pink-500/10 rounded-full blur-2xl" />

      {/* SVG Layer for Glowing Hearts, Ribbons, Rings & Sparkles */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Rose Gold Gradient */}
          <radialGradient id="lux-rosegold-heart" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FED7E2" />
            <stop offset="35%" stopColor="#F472B6" />
            <stop offset="75%" stopColor="#DB2777" />
            <stop offset="100%" stopColor="#831843" />
          </radialGradient>

          {/* Champagne Gold Gradient */}
          <radialGradient id="lux-champagne-heart" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="40%" stopColor="#F5C042" />
            <stop offset="85%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </radialGradient>

          {/* Ruby Heart Gradient */}
          <radialGradient id="lux-ruby-heart" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="40%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#4C0519" />
          </radialGradient>

          {/* Heart Glow Filter */}
          <filter id="heart-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* TOP LEFT HEARTS & RIBBONS */}
        <path
          d="M-5 -5 C 18 20, 8 45, 24 75 C 28 85, 18 100, 25 115"
          stroke="#F472B6"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
          fill="none"
        />
        <path
          d="M22 15 C 32 40, 18 60, 36 90 C 40 100, 32 110, 38 122"
          stroke="#FDE047"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.5"
          fill="none"
        />

        {/* Champagne Heart behind */}
        <g transform="translate(16, 2) scale(0.65) rotate(-15)">
          <path d="M30 18 C20 4, 6 18, 30 42 C54 18, 40 4, 30 18 Z" fill="url(#lux-champagne-heart)" opacity="0.85" />
        </g>

        {/* Ruby Heart front */}
        <g transform="translate(-10, -5) scale(0.85) rotate(-10)">
          <path d="M30 18 C20 4, 6 18, 30 42 C54 18, 40 4, 30 18 Z" fill="url(#lux-rosegold-heart)" />
          <ellipse cx="24" cy="14" rx="2.5" ry="5" fill="white" opacity="0.75" transform="rotate(-25 24 14)" />
        </g>

        {/* Small floating heart accent */}
        <g transform="translate(38, 0) scale(0.5) rotate(15)">
          <path d="M30 18 C20 4, 6 18, 30 42 C54 18, 40 4, 30 18 Z" fill="url(#lux-ruby-heart)" opacity="0.9" />
        </g>

        {/* TOP RIGHT HEARTS & RIBBONS */}
        <path
          d="M405 -5 C 382 20, 392 45, 376 75 C 372 85, 382 100, 375 115"
          stroke="#F472B6"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
          fill="none"
        />
        <path
          d="M378 15 C 368 40, 382 60, 364 90 C 360 100, 368 110, 362 122"
          stroke="#FDE047"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.5"
          fill="none"
        />

        {/* Champagne Heart behind right */}
        <g transform="translate(355, 2) scale(0.65) rotate(15)">
          <path d="M30 18 C20 4, 6 18, 30 42 C54 18, 40 4, 30 18 Z" fill="url(#lux-champagne-heart)" opacity="0.85" />
        </g>

        {/* Rose-Gold Heart front right */}
        <g transform="translate(380, -5) scale(0.85) rotate(10)">
          <path d="M30 18 C20 4, 6 18, 30 42 C54 18, 40 4, 30 18 Z" fill="url(#lux-rosegold-heart)" />
          <ellipse cx="24" cy="14" rx="2.5" ry="5" fill="white" opacity="0.75" transform="rotate(-25 24 14)" />
        </g>

        {/* Small floating heart accent right */}
        <g transform="translate(340, 0) scale(0.5) rotate(-15)">
          <path d="M30 18 C20 4, 6 18, 30 42 C54 18, 40 4, 30 18 Z" fill="url(#lux-ruby-heart)" opacity="0.9" />
        </g>

        {/* FLOATING ROSE-GOLD & GOLD SPARKLES */}
        <g transform="translate(68, 22) scale(0.6)" filter="url(#heart-glow)">
          <path d="M 0 -12 Q 0 0 12 0 Q 0 0 0 12 Q 0 0 -12 0 Q 0 0 0 -12 Z" fill="#FED7E2" />
          <circle cx="0" cy="0" r="2.5" fill="#F472B6" />
        </g>
        <g transform="translate(330, 24) scale(0.6)" filter="url(#heart-glow)">
          <path d="M 0 -12 Q 0 0 12 0 Q 0 0 0 12 Q 0 0 -12 0 Q 0 0 0 -12 Z" fill="#FFFBEB" />
          <circle cx="0" cy="0" r="2.5" fill="#FDE047" />
        </g>
        <g transform="translate(200, 16) scale(0.45)" filter="url(#heart-glow)">
          <path d="M 0 -12 Q 0 0 12 0 Q 0 0 0 12 Q 0 0 -12 0 Q 0 0 0 -12 Z" fill="#FED7E2" />
        </g>

        {/* Bokeh dots along top */}
        <circle cx="95" cy="18" r="2" fill="#F472B6" opacity="0.7" />
        <circle cx="120" cy="10" r="1.5" fill="#FDE047" opacity="0.6" />
        <circle cx="280" cy="12" r="1.5" fill="#FDE047" opacity="0.6" />
        <circle cx="305" cy="20" r="2.5" fill="#F472B6" opacity="0.7" />

        {/* Intertwined Golden Wedding Rings Symbol */}
        <g transform="translate(192, 10) scale(0.7)" opacity="0.5">
          <circle cx="8" cy="8" r="6" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
          <circle cx="16" cy="8" r="6" stroke="#FBBF24" strokeWidth="1.5" fill="none" />
        </g>

        {/* BOTTOM CORNERS: ROSE-GOLD & GOLD GLITTER DUST */}
        <g filter="url(#heart-glow)">
          <circle cx="14" cy="182" r="3.5" fill="#F472B6" opacity="0.8" />
          <circle cx="28" cy="190" r="2" fill="#FEF08A" opacity="0.9" />
          <circle cx="42" cy="184" r="2.5" fill="#E11D48" opacity="0.75" />
          <circle cx="22" cy="172" r="1.8" fill="#FED7E2" opacity="0.9" />
          <circle cx="8" cy="165" r="1.5" fill="#FBBF24" opacity="0.6" />
          <circle cx="35" cy="168" r="1.2" fill="#F472B6" opacity="0.7" />
          <circle cx="55" cy="188" r="1.5" fill="#FDE047" opacity="0.6" />
        </g>
        <g filter="url(#heart-glow)">
          <circle cx="386" cy="182" r="3.5" fill="#F472B6" opacity="0.8" />
          <circle cx="372" cy="190" r="2" fill="#FEF08A" opacity="0.9" />
          <circle cx="358" cy="184" r="2.5" fill="#E11D48" opacity="0.75" />
          <circle cx="378" cy="172" r="1.8" fill="#FED7E2" opacity="0.9" />
          <circle cx="392" cy="165" r="1.5" fill="#FCD34D" opacity="0.6" />
          <circle cx="365" cy="168" r="1.2" fill="#F472B6" opacity="0.7" />
          <circle cx="345" cy="188" r="1.5" fill="#FDE047" opacity="0.6" />
        </g>
      </svg>

      {/* Luxury Metallic Rose-Gold Inner Border */}
      <div className="absolute inset-0 rounded-3xl border border-rose-400/40 pointer-events-none" />
      <div className="absolute inset-[3px] rounded-[22px] border border-rose-300/20 pointer-events-none" />
    </div>
  );
}

export default function BirthdayAnniversarySection() {
  const [birthdays, setBirthdays] = useState<CelebrationEvent[]>([]);
  const [anniversaries, setAnniversaries] = useState<CelebrationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Carousel ref & scroll arrow states
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const fetchCelebrations = async (showLoader = false) => {
    if (showLoader) setIsRefreshing(true);
    try {
      const res = await fetch("/api/celebrations", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setBirthdays(data.birthdays || []);
        setAnniversaries(data.anniversaries || []);
      }
    } catch (err) {
      console.error("Failed to load celebrations:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCelebrations();
  }, []);

  // ONLY Today and Tomorrow events (daysRemaining === 0 or daysRemaining === 1)
  const todayAndTomorrowList = useMemo(() => {
    const list = [...birthdays, ...anniversaries].filter(
      (item) => item.daysRemaining === 0 || item.daysRemaining === 1
    );
    return list.sort((a, b) => a.daysRemaining - b.daysRemaining || a.name.localeCompare(b.name));
  }, [birthdays, anniversaries]);

  const todayList = useMemo(() => {
    return todayAndTomorrowList.filter((item) => item.daysRemaining === 0);
  }, [todayAndTomorrowList]);

  const tomorrowList = useMemo(() => {
    return todayAndTomorrowList.filter((item) => item.daysRemaining === 1);
  }, [todayAndTomorrowList]);

  const birthdayList = useMemo(() => {
    return todayAndTomorrowList.filter((item) => item.type === "birthday");
  }, [todayAndTomorrowList]);

  const anniversaryList = useMemo(() => {
    return todayAndTomorrowList.filter((item) => item.type === "anniversary");
  }, [todayAndTomorrowList]);

  // Adjust default tab if today has 0 celebrations but tomorrow has celebrations
  useEffect(() => {
    if (!loading && todayList.length === 0 && tomorrowList.length > 0 && activeTab === "today") {
      setActiveTab("tomorrow");
    }
  }, [loading, todayList.length, tomorrowList.length, activeTab]);

  // Filtered items based on active tab and search query
  const filteredCelebrations = useMemo(() => {
    let list = todayList;

    if (activeTab === "today") {
      list = todayList;
    } else if (activeTab === "tomorrow") {
      list = tomorrowList;
    } else if (activeTab === "birthdays") {
      list = birthdayList;
    } else if (activeTab === "anniversaries") {
      list = anniversaryList;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.displayDayMonth.toLowerCase().includes(query) ||
          item.displayDayMonthTa.includes(query)
      );
    }

    return list;
  }, [todayList, tomorrowList, birthdayList, anniversaryList, activeTab, searchQuery]);

  // Update carousel scroll button visibility
  const updateScrollButtons = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const timer = setTimeout(() => {
      updateScrollButtons();
    }, 150);

    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [filteredCelebrations, updateScrollButtons]);

  // Reset scroll to start when tab or search changes
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [activeTab, searchQuery]);

  // Smooth scroll handler for carousel buttons
  const handleScroll = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const firstCard = el.querySelector("article");
    const cardWidth = firstCard ? firstCard.clientWidth + 24 : el.clientWidth * 0.8;
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section
      id="celebrations"
      className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-amber-50/40 via-white to-rose-50/30"
    >
      {/* Decorative festive background accents */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-amber-400/5 blur-3xl" />

      <div className="container-page relative z-10">
        {/* ============================================================== */}
        {/* 1. MAIN TITLE & CHURCH GREETING                                */}
        {/* ============================================================== */}
        <div className="text-center max-w-4xl mx-auto px-4">
          {/* Festive Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50/95 px-5 py-1.5 shadow-sm backdrop-blur-sm">
            <PartyPopper className="h-4 w-4 text-amber-600 animate-bounce" />
            <span className="text-xs sm:text-sm font-bold tracking-wide text-amber-950">
              CSI கிறிஸ்து ஆலயம் • கல்லிடைக்குறிச்சி
            </span>
            <Sparkles className="h-4 w-4 text-rose-500" />
          </div>

          {/* Main Title (Prominent, High-contrast, Bold) */}
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-navy-950 leading-tight">
            பிறந்தநாள் மற்றும் திருமண நாள் வாழ்த்துக்கள்
          </h2>

          {/* Subtitle */}
          <p className="mt-3 text-base sm:text-lg md:text-xl font-bold text-slate-700 max-w-2xl mx-auto leading-relaxed">
            CSI கிறிஸ்து நாதர் ஆலயம், கல்லிடைக்குறிச்சி திருச்சபை குடும்பங்களுக்கு அன்பின் நல்வாழ்த்துக்கள்!
          </p>

          {/* Decorative Divider */}
          <div className="mt-4 h-1.5 w-32 rounded-full bg-gradient-to-r from-crimson via-gold to-royal shadow-sm mx-auto" />
        </div>

        {/* ============================================================== */}
        {/* 2. ONE COMMON SCRIPTURE BLESSING BANNER AT THE TOP              */}
        {/* ============================================================== */}
        <div className="mt-7 max-w-3xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl border-2 border-amber-300/80 bg-gradient-to-br from-amber-50 via-white to-amber-100/70 p-5 sm:p-7 shadow-lg shadow-amber-900/5 text-center">
            {/* Subtle background glow */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-300/30 blur-2xl" />
            <div className="pointer-events-none absolute -left-8 -bottom-8 h-28 w-28 rounded-full bg-rose-300/20 blur-2xl" />

            {/* Header Badge */}
            <div className="relative z-10 inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1 text-xs sm:text-sm font-black text-amber-950 mb-3">
              <BookOpen className="h-4 w-4 text-amber-600" />
              <span>ஆசீர்வாத தேவ வசனம் • Scripture Blessing</span>
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            </div>

            {/* Common Blessing Bible Verse */}
            <blockquote className="relative z-10 text-base sm:text-lg md:text-xl font-bold text-navy-950 leading-relaxed tracking-tight">
              “கர்த்தர் உன்னை ஆசீர்வதித்து, உன்னைக் காக்கக்கடவர்; கர்த்தர் தம்முடைய முகத்தை உன்மேல் பிரகாசிக்கப்பண்ணி, உன்மேல் கிருபையாயிருக்கக்கடவர்; கர்த்தர் தம்முடைய முகத்தை உன்மேல் பிரசன்னமாக்கி, உனக்குச் சமாதானம் கட்டளையிடக்கடவர்.”
            </blockquote>

            {/* Scripture Reference */}
            <div className="relative z-10 mt-3 flex items-center justify-center gap-2 text-xs sm:text-sm font-black text-amber-900">
              <span className="h-0.5 w-6 bg-amber-400/60 rounded-full" />
              <span>எண்ணாகமம் (Numbers) 6:24-26</span>
              <span className="h-0.5 w-6 bg-amber-400/60 rounded-full" />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. CONTROLS BAR: TABS & SEARCH                                 */}
        {/* ============================================================== */}
        <div className="mt-8 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/90 rounded-2xl border border-amber-200 shadow-sm w-full sm:w-auto">
              {/* Today Tab */}
              <button
                type="button"
                onClick={() => setActiveTab("today")}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === "today"
                    ? "bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-md shadow-rose-500/20 scale-102"
                    : "text-slate-600 hover:text-navy-900 hover:bg-slate-100"
                }`}
              >
                <Sun className="h-3.5 w-3.5" />
                <span>✨ இன்று (Today)</span>
                {todayList.length > 0 && (
                  <span className="relative flex h-2 w-2 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                )}
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                    activeTab === "today" ? "bg-white/30 text-white" : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {todayList.length}
                </span>
              </button>

              {/* Tomorrow Tab */}
              <button
                type="button"
                onClick={() => setActiveTab("tomorrow")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === "tomorrow"
                    ? "bg-navy-950 text-white shadow-md scale-102"
                    : "text-slate-600 hover:text-navy-900 hover:bg-slate-100"
                }`}
              >
                <Sunrise className="h-3.5 w-3.5 text-amber-400" />
                <span>🌅 நாளை (Tomorrow)</span>
                <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-800">
                  {tomorrowList.length}
                </span>
              </button>

              {/* Birthdays Tab */}
              <button
                type="button"
                onClick={() => setActiveTab("birthdays")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === "birthdays"
                    ? "bg-amber-500 text-white shadow-md scale-102"
                    : "text-slate-600 hover:text-navy-900 hover:bg-slate-100"
                }`}
              >
                <Cake className="h-3.5 w-3.5" />
                <span>🎂 பிறந்தநாள் (Birthdays)</span>
                <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900">
                  {birthdayList.length}
                </span>
              </button>

              {/* Anniversaries Tab */}
              <button
                type="button"
                onClick={() => setActiveTab("anniversaries")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === "anniversaries"
                    ? "bg-rose-600 text-white shadow-md scale-102"
                    : "text-slate-600 hover:text-navy-900 hover:bg-slate-100"
                }`}
              >
                <Heart className="h-3.5 w-3.5" />
                <span>💐 திருமண நாள் (Anniversaries)</span>
                <span className="ml-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-900">
                  {anniversaryList.length}
                </span>
              </button>
            </div>

            {/* Search Input & Refresh */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="பெயர் மூலம் தேடுக... (Search name)"
                  className="w-full rounded-2xl border border-amber-200 bg-white pl-9 pr-3 py-2 text-xs sm:text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200 shadow-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => fetchCelebrations(true)}
                title="புதுப்பிக்கவும் (Refresh)"
                className="p-2 rounded-2xl border border-amber-200 bg-white text-slate-500 hover:text-navy-900 hover:border-amber-300 shadow-sm transition-all"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-gold-dark" : ""}`} />
              </button>
            </div>
          </div>

          {/* Celebrations Carousel / States */}
          <div className="mt-8">
            {loading ? (
              /* Skeleton Loader in Short Horizontal Cards */
              <div className="flex flex-nowrap items-stretch gap-5 overflow-hidden py-4 px-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex-none w-[85%] sm:w-[340px] md:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] h-44 rounded-3xl bg-slate-900/90 p-5 shadow-lg animate-pulse flex flex-col justify-between border border-amber-400/30"
                  >
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-slate-700 rounded-full w-28" />
                      <div className="h-6 bg-slate-700 rounded-full w-20" />
                    </div>
                    <div className="h-7 bg-amber-400/20 rounded-xl w-3/4 mx-auto" />
                    <div className="h-6 bg-slate-700 rounded-full w-40 mx-auto" />
                  </div>
                ))}
              </div>
            ) : filteredCelebrations.length === 0 ? (
              /* Empty State */
              <div className="text-center py-14 px-4 rounded-3xl border-2 border-dashed border-amber-300 bg-white/80 max-w-xl mx-auto shadow-sm">
                <Gift className="h-12 w-12 text-amber-500 mx-auto opacity-80 mb-3 animate-bounce" />
                <h3 className="text-lg sm:text-xl font-bold text-navy-950">
                  {searchQuery
                    ? "பொருத்தமான நபர்கள் கிடைக்கவில்லை"
                    : activeTab === "today"
                    ? "இன்று விசேஷங்கள் எதுவும் இல்லை"
                    : activeTab === "tomorrow"
                    ? "நாளை விசேஷங்கள் எதுவும் இல்லை"
                    : "இன்றும் நாளையும் விசேஷங்கள் எதுவும் இல்லை"}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500">
                  {searchQuery
                    ? `"${searchQuery}" என்ற பெயரில் விசேஷங்கள் காணப்படவில்லை.`
                    : activeTab === "today"
                    ? "இன்று திருச்சபை உறுப்பினர்களின் பிறந்தநாள் அல்லது திருமண நாள் நிகழ்வுகள் எதுவும் இல்லை."
                    : activeTab === "tomorrow"
                    ? "நாளை திருச்சபை உறுப்பினர்களின் பிறந்தநாள் அல்லது திருமண நாள் நிகழ்வுகள் எதுவும் இல்லை."
                    : "இன்றும் நாளையும் திருச்சபை உறுப்பினர்களின் பிறந்தநாள் அல்லது திருமண நாள் விசேஷங்கள் இல்லை."}
                </p>
                {activeTab === "today" && tomorrowList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("tomorrow")}
                    className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-navy-950 bg-amber-400 hover:bg-amber-300 shadow transition-all"
                  >
                    🌅 நாளை கொண்டாடுபவர்களைப் பார்க்க ({tomorrowList.length} நபர்கள்)
                  </button>
                )}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-royal bg-royal/10 hover:bg-royal/20 transition-all"
                  >
                    தேடலை மீட்டமைக்க (Clear Search)
                  </button>
                )}
              </div>
            ) : (
              /* ============================================================== */
              /* 4. SHORT LUXURY HORIZONTAL SCROLLING CAROUSEL                  */
              /* ============================================================== */
              <div className="relative group/carousel">
                {/* Left Navigation Arrow (Desktop) */}
                {canScrollLeft && (
                  <button
                    type="button"
                    onClick={() => handleScroll("left")}
                    aria-label="Previous celebrations"
                    className="hidden md:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white text-navy-950 shadow-xl border border-amber-300 hover:bg-amber-500 hover:text-white hover:scale-105 transition-all active:scale-95"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                )}

                {/* Horizontal Scrollable Container */}
                <div
                  ref={carouselRef}
                  className="flex flex-nowrap items-stretch gap-5 overflow-x-auto overflow-y-hidden py-3 px-1 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  style={{
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {filteredCelebrations.map((item) => {
                    const isBday = item.type === "birthday";
                    const isToday = item.isToday;

                    return (
                      <article
                        key={`${item.id}-${item.type}-${item.nextDate}`}
                        className={`flex-none snap-start w-[85%] sm:w-[340px] md:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] relative flex flex-col justify-between rounded-3xl overflow-hidden p-5 sm:p-6 transition-all duration-300 transform hover:-translate-y-1.5 min-h-[175px] sm:min-h-[185px] ${
                          isToday
                            ? "ring-2 ring-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.35)]"
                            : "shadow-xl shadow-black/30 hover:shadow-2xl hover:shadow-amber-500/15"
                        }`}
                      >
                        {/* Luxury Background Graphic */}
                        {isBday ? <LuxuryBirthdayBg /> : <LuxuryAnniversaryBg />}

                        {/* =================================================== */}
                        {/* CARD CONTENT LAYER                                  */}
                        {/* =================================================== */}

                        {/* Top Row: Event Type Badge (Left) & Today/Tomorrow Badge (Right) */}
                        <div className="relative z-10 flex items-center justify-between gap-2">
                          {/* Event Type Badge */}
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-sm backdrop-blur-md border ${
                              isBday
                                ? "bg-amber-400/20 border-amber-400/40 text-amber-200"
                                : "bg-rose-400/20 border-rose-400/40 text-rose-200"
                            }`}
                          >
                            {isBday ? (
                              <>
                                <Cake className="h-3.5 w-3.5 text-amber-400 animate-bounce" />
                                <span className="tracking-wide">பிறந்தநாள் • Birthday</span>
                              </>
                            ) : (
                              <>
                                <Heart className="h-3.5 w-3.5 text-rose-400 fill-current animate-pulse" />
                                <span className="tracking-wide">திருமண நாள் • Anniversary</span>
                              </>
                            )}
                          </div>

                          {/* Today / Tomorrow Status Pill */}
                          <div>
                            {isToday ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 px-3 py-0.5 text-[11px] font-black text-navy-950 shadow-md shadow-amber-400/30 animate-pulse">
                                <Sparkles className="h-3 w-3 text-navy-950" />
                                <span>இன்று (Today)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 text-[11px] font-bold text-slate-300 backdrop-blur-md">
                                <Sunrise className="h-3 w-3 text-amber-300" />
                                <span>நாளை (Tomorrow)</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Center: Member / Couple Name (Large Gold Typography) */}
                        <div className="relative z-10 my-3 text-center px-1">
                          <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                            {item.name}
                          </h3>
                        </div>

                        {/* Bottom Row: Date Badge */}
                        <div className="relative z-10 flex items-center justify-center">
                          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 bg-white/10 border border-amber-400/30 text-xs font-bold text-amber-100 shadow-sm backdrop-blur-md">
                            <Calendar className="h-3.5 w-3.5 text-amber-400" />
                            <span>{item.displayDayMonthTa}</span>
                            <span className="text-amber-400/50">•</span>
                            <span className="text-slate-300 font-medium">{item.displayDayMonth}</span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Right Navigation Arrow (Desktop) */}
                {canScrollRight && (
                  <button
                    type="button"
                    onClick={() => handleScroll("right")}
                    aria-label="Next celebrations"
                    className="hidden md:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white text-navy-950 shadow-xl border border-amber-300 hover:bg-amber-500 hover:text-white hover:scale-105 transition-all active:scale-95"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}
              </div>
            )}

            {/* Mobile Swipe Hint */}
            {!loading && filteredCelebrations.length > 1 && (
              <div className="flex md:hidden items-center justify-center gap-1.5 mt-3 text-xs text-amber-900/60 font-semibold">
                <span>← பக்கவாட்டில் நகர்த்தவும் (Swipe to view more) →</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
