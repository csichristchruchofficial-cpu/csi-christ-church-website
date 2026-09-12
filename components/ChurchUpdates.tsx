"use client";

import { Bell, CalendarDays, MessageCircleMore } from "lucide-react";
import { useEffect, useState } from "react";
import type { ChurchUpdate } from "@/data/updates";

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
  Announcement: "bg-royal/20 text-royal-light border border-royal/30",
  Prayer: "bg-gold/20 text-amber-300 border border-gold/30",
  Event: "bg-crimson/20 text-red-300 border border-crimson/30",
};

export default function ChurchUpdates({
  initialUpdates = [],
}: {
  initialUpdates?: ChurchUpdate[];
}) {
  const [updates, setUpdates] = useState<ChurchUpdate[]>(initialUpdates);

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

    // 60-second periodic poll as specified
    const timer = window.setInterval(refresh, 60_000);
    return () => {
      isMounted = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section aria-labelledby="church-updates-title" className="bg-navy-950 py-20 sm:py-28">
      <div className="container-page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="badge-vibrant bg-gold text-navy-950 font-bold">
              <MessageCircleMore size={15} aria-hidden="true" /> திருச்சபை அறிவிப்புகள்
            </span>
            <h2
              id="church-updates-title"
              className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
            >
              Church Updates & Notifications
            </h2>
            <p className="mt-3 max-w-2xl text-slate-300 text-sm sm:text-base">
              சபையின் முக்கிய அறிவிப்புகள், நிகழ்வுகள் மற்றும் ஜெபக் குறிப்புகள் இங்கே பகிரப்படுகின்றன.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gold-light shrink-0">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            நேரலை அறிவிப்புகள் (Live Feed)
          </div>
        </div>

        {updates.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-white/15 bg-white/5 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-light mb-3">
              <Bell size={24} />
            </div>
            <h3 className="text-base font-bold text-white">
              தற்போது புதிய அறிவிப்புகள் ஏதுமில்லை
            </h3>
            <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
              No new announcements published at the moment. Approved church notifications and prayer items will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {updates.map((update) => (
              <article
                key={update.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-sm transition-all hover:border-gold/30 hover:bg-white/[0.07]"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-gold/15 p-3 text-gold-light shrink-0">
                    <Bell size={20} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                          categoryStyles[update.category] || categoryStyles.Announcement
                        }`}
                      >
                        {update.category === "Announcement"
                          ? "அறிவிப்பு"
                          : update.category === "Prayer"
                          ? "ஜெபம்"
                          : "நிகழ்வு"}{" "}
                        ({update.category})
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                        <CalendarDays size={14} aria-hidden="true" />{" "}
                        {formatDate(update.publishedAt)}
                      </span>
                    </div>
                    <p className="mt-4 whitespace-pre-line text-base leading-7 text-slate-100">
                      {update.message}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
