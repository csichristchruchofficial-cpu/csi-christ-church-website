"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { churchInfo, navLinks } from "@/data/church";
import { Phone, Clock, ArrowUp } from "lucide-react";
import PushNotificationPrompt from "./PushNotificationPrompt";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const lastScrollYRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;

      // Track whether page has scrolled away from top
      setIsScrolled(currentY > 20);

      // Track reading / scroll progress
      const totalDocHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalDocHeight > 0) {
        setScrollProgress(
          Math.min(100, Math.max(0, (currentY / totalDocHeight) * 100))
        );
      }

      // If near the top, ALWAYS keep header visible
      if (currentY <= 20) {
        setIsVisible(true);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        return;
      }

      // ONLY WHEN SCROLLING: go invisible!
      setIsVisible(false);

      // When the user stops scrolling, reappear smoothly after a brief moment (700ms)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 700);
    }

    function handleMouseMove(e: MouseEvent) {
      // If user moves mouse towards the top 50px of the viewport, reveal the header
      if (e.clientY <= 50) {
        setIsVisible(true);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      {/* ============================================================== */}
      {/* 1. MAIN HEADER (Church Identity & Priority Action)             */}
      {/* ============================================================== */}
      <div
        className={`w-full bg-white/98 backdrop-blur-md border-b transition-all duration-300 ${
          isScrolled ? "py-2 shadow-sm border-slate-200/80" : "py-3 sm:py-3.5 border-slate-200"
        }`}
      >
        <div className="container-page flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Church Name */}
          <Link
            href="/"
            className="group flex items-center gap-2 sm:gap-3.5 min-w-0 flex-1"
          >
            <div
              className={`relative shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-0.5 shadow-sm ring-2 ring-gold/60 transition-all duration-300 group-hover:ring-crimson ${
                isScrolled ? "h-9 w-9 sm:h-12 sm:w-12" : "h-10 w-10 sm:h-14 sm:w-14"
              }`}
            >
              <Image
                src={churchInfo.logo}
                alt={churchInfo.name}
                width={56}
                height={56}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className={`font-black text-navy-900 tracking-tight leading-tight transition-all duration-300 group-hover:text-royal truncate ${
                  isScrolled ? "text-xs sm:text-base md:text-lg" : "text-sm sm:text-lg md:text-xl"
                }`}
              >
                <span className="church-name-ta-source">{churchInfo.name}</span>
                <span className="church-name-en-override notranslate" translate="no">
                  {churchInfo.nameEnglish}
                </span>
              </span>
              <span className="text-[9px] sm:text-xs font-black tracking-wider text-crimson uppercase truncate notranslate" translate="no">
                CSI Christ Church Kallidai
              </span>
            </div>
          </Link>

          {/* Main Header Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Quick Worship Timing Hint (Desktop only) */}
            <div className="hidden md:flex items-center gap-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 px-3.5 py-1.5 text-xs">
              <Clock size={15} className="text-gold-dark shrink-0" />
              <div>
                <span className="block font-bold text-navy-900 leading-tight">ஞாயிறு ஆராதனை</span>
                <span className="text-amber-800 font-semibold text-[11px] notranslate" translate="no">காலை 09:00 - 11:30 AM</span>
              </div>
            </div>

            {/* JOIN US Button */}
            <Link
              href="/contact"
              className="btn-primary !py-1.5 !px-2.5 sm:!py-2 sm:!px-5 !text-[11px] sm:!text-sm font-bold shadow-sm hover:shadow-glow-gold/30 transition-all shrink-0"
            >
              <span className="church-name-ta-source">இணையுங்கள்</span>
              <span className="church-name-en-override notranslate" translate="no">Join Us</span>
              <span className="hidden sm:inline text-xs font-semibold opacity-90 notranslate" translate="no"> (Join Us)</span>
            </Link>

            {/* Receive Notification Option (Replaces Mobile Menu) */}
            <PushNotificationPrompt variant="header" />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. NAVIGATION BAR                                              */}
      {/* ============================================================== */}
      <div
        className={`relative text-white border-b-2 border-gold/40 transition-all duration-300 ${
          isScrolled
            ? "bg-navy-950/98 backdrop-blur-xl shadow-lg"
            : "bg-navy-950 shadow-md"
        }`}
      >
        {/* Desktop View: Full Row with Phone & Back-to-Top */}
        <div className="hidden lg:flex container-page h-11 xl:h-12 items-center justify-between">
          <nav className="flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative rounded-lg px-3 py-1.5 text-xs xl:text-sm font-bold text-slate-200 transition-all duration-200 hover:bg-white/10 hover:text-gold-light group"
              >
                <span className="church-name-ta-source">{link.label}</span>
                <span className="church-name-en-override notranslate" translate="no">{link.labelEnglish}</span>
                <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gold rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
            {isScrolled && (
              <button
                type="button"
                onClick={scrollToTop}
                title="மேல்நோக்கி செல்ல (Back to top)"
                className="inline-flex items-center gap-1 text-[11px] text-gold-light bg-white/10 hover:bg-gold hover:text-navy-950 px-2.5 py-1 rounded-full transition-all duration-200 notranslate"
                translate="no"
              >
                <ArrowUp size={12} />
                <span>மேலே</span>
              </button>
            )}

            <a
              href={`tel:${churchInfo.phone}`}
              className="flex items-center gap-1.5 text-slate-300 hover:text-gold transition-colors notranslate"
              translate="no"
            >
              <Phone size={13} className="text-gold" />
              <span>{churchInfo.phone}</span>
            </a>
          </div>
        </div>

        {/* Mobile View: High-Contrast Scrollable Quick-Pill Bar */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full bg-white/10 px-3.5 py-1 text-xs font-black text-slate-100 border border-white/20 hover:bg-gold hover:text-navy-950 transition-all active:scale-95 shadow-sm"
            >
              <span className="church-name-ta-source">{link.label}</span>
              <span className="church-name-en-override notranslate" translate="no">{link.labelEnglish}</span>
            </Link>
          ))}
        </div>

        {/* Dynamic Neat Scroll Progress Indicator */}
        <div
          className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-crimson via-gold to-cyan transition-all duration-150 ease-out pointer-events-none opacity-90"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
  );
}
