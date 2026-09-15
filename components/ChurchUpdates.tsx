"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { ChurchUpdate } from "@/data/updates";
import ScrollReveal from "./ScrollReveal";
import PushNotificationPrompt from "./PushNotificationPrompt";

function formatDate(dateString: string) {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateString;
  }
}

const categoryStyles = {
  Announcement: {
    badge: "bg-royal/30 text-blue-200 border-royal/40",
    label: "அறிவிப்பு • Announcement",
    icon: "📢",
  },
  Prayer: {
    badge: "bg-gold/30 text-amber-200 border-gold/40",
    label: "ஜெபம் • Prayer",
    icon: "🙏",
  },
  Event: {
    badge: "bg-crimson/30 text-rose-200 border-crimson/40",
    label: "நிகழ்வு • Event",
    icon: "📅",
  },
};

export default function ChurchUpdates({
  initialUpdates = [],
}: {
  initialUpdates?: ChurchUpdate[];
}) {
  const [updates, setUpdates] = useState<ChurchUpdate[]>(initialUpdates);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const refresh = async () => {
      try {
        const response = await fetch("/api/updates", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { updates?: ChurchUpdate[] };
        if (isMounted && data.updates) {
          setUpdates(data.updates);
        }
      } catch {
        // Keep existing updates if refresh fails temporarily.
      }
    };

    // Initial fetch on mount
    refresh();

    // 60-second periodic poll
    const timer = window.setInterval(refresh, 60_000);
    return () => {
      isMounted = false;
      window.clearInterval(timer);
    };
  }, []);

  // Auto-advance every 7 seconds when more than 1 update and not hovered
  useEffect(() => {
    if (updates.length <= 1 || isPaused) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % updates.length);
    }, 7000);

    return () => window.clearInterval(interval);
  }, [updates.length, isPaused]);

  // Keep index within bounds if list shrinks
  useEffect(() => {
    if (currentIndex >= updates.length && updates.length > 0) {
      setCurrentIndex(0);
    }
  }, [updates.length, currentIndex]);

  const prevUpdate = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + updates.length) % updates.length);
  }, [updates.length]);

  const nextUpdate = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % updates.length);
  }, [updates.length]);

  const current = updates[currentIndex] || updates[0];
  const style = current
    ? categoryStyles[current.category] || categoryStyles.Announcement
    : categoryStyles.Announcement;

  return (
    <ScrollReveal direction="pop" delay={350} className="mt-8 max-w-2xl mx-auto w-full">
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative overflow-hidden rounded-2xl border border-white/20 bg-navy-950/80 p-4 sm:p-5 text-left shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-gold/50"
      >
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/15 blur-2xl" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-wide text-gold-light flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5 text-gold" />
              <span>திருச்சபை நேரலை அறிவிப்பு</span>
              <span className="hidden sm:inline text-white/40">•</span>
              <span className="hidden sm:inline text-xs font-medium text-slate-300">
                Live Church Updates
              </span>
            </span>
          </div>

          {/* Navigation Controls when > 1 */}
          {updates.length > 1 && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">
                {currentIndex + 1} / {updates.length}
              </span>
              <button
                onClick={prevUpdate}
                aria-label="Previous announcement"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 hover:text-gold"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextUpdate}
                aria-label="Next announcement"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 hover:text-gold"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Announcement Body */}
        {current ? (
          <div className="pt-3">
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style.badge}`}
              >
                <span>{style.icon}</span>
                <span>{style.label}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <CalendarDays className="h-3 w-3" />
                {formatDate(current.publishedAt)}
              </span>
            </div>
            <p className="whitespace-pre-line text-sm sm:text-base font-medium leading-relaxed text-slate-100">
              {current.message}
            </p>
          </div>
        ) : (
          <div className="py-2 text-center text-xs text-slate-400">
            தற்போது புதிய அறிவிப்புகள் ஏதுமில்லை. (No new announcements at the moment)
          </div>
        )}

        {/* Card Footer: Push Notification Prompt & Dot Indicators */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap">
          <PushNotificationPrompt variant="pill" />

          {/* Indicator Dots when multiple */}
          {updates.length > 1 && (
            <div className="flex items-center gap-1.5 ml-auto">
              {updates.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to announcement ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-6 bg-gold"
                      : "w-1.5 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}
