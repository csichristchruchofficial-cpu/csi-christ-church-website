"use client";

import { Bell, CalendarDays, MessageCircleMore } from "lucide-react";
import { useEffect, useState } from "react";
import type { ChurchUpdate } from "@/data/updates";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

const categoryStyles = {
  Announcement: "bg-royal/10 text-royal-dark",
  Prayer: "bg-gold/15 text-gold-amber",
  Event: "bg-crimson/10 text-crimson-dark",
};

export default function ChurchUpdates({ initialUpdates }: { initialUpdates: ChurchUpdate[] }) {
  const [updates, setUpdates] = useState(initialUpdates);

  useEffect(() => {
    const refresh = async () => {
      try {
        const response = await fetch("/api/updates", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { updates?: ChurchUpdate[] };
        if (data.updates) setUpdates(data.updates);
      } catch {
        // Keep the server-rendered updates available if the refresh fails.
      }
    };

    refresh();
    const timer = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section aria-labelledby="church-updates-title" className="bg-navy-950 py-20 sm:py-28">
      <div className="container-page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="badge-vibrant bg-gold text-navy-950">
              <MessageCircleMore size={15} aria-hidden="true" /> Church feed
            </span>
            <h2 id="church-updates-title" className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Church Updates & Notifications
            </h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              Selected announcements from the church WhatsApp group, shared here for everyone to see.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gold-light">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
            Latest approved updates
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {updates.map((update) => (
            <article key={update.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-gold/15 p-3 text-gold-light">
                  <Bell size={20} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${categoryStyles[update.category]}`}>
                      {update.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                      <CalendarDays size={14} aria-hidden="true" /> {formatDate(update.publishedAt)}
                    </span>
                  </div>
                  <p className="mt-4 whitespace-pre-line text-base leading-7 text-slate-100">{update.message}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
