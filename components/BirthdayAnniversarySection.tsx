"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Cake,
  Heart,
  Sparkles,
  Calendar,
  Search,
  PartyPopper,
  RefreshCw,
  Gift,
} from "lucide-react";
import type { CelebrationEvent } from "@/lib/celebrations/date-utils";
import ScrollReveal from "./ScrollReveal";

type TabFilter = "all" | "today" | "birthdays" | "anniversaries";

export default function BirthdayAnniversarySection() {
  const [birthdays, setBirthdays] = useState<CelebrationEvent[]>([]);
  const [anniversaries, setAnniversaries] = useState<CelebrationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Combined list sorted chronologically
  const allCelebrations = useMemo(() => {
    const list = [...birthdays, ...anniversaries];
    return list.sort((a, b) => a.daysRemaining - b.daysRemaining || a.name.localeCompare(b.name));
  }, [birthdays, anniversaries]);

  const todayCelebrations = useMemo(() => {
    return allCelebrations.filter((item) => item.isToday);
  }, [allCelebrations]);

  // Filtered items based on active tab and search query
  const filteredCelebrations = useMemo(() => {
    let list = allCelebrations;

    if (activeTab === "today") {
      list = todayCelebrations;
    } else if (activeTab === "birthdays") {
      list = birthdays;
    } else if (activeTab === "anniversaries") {
      list = anniversaries;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      list = list.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        item.displayDayMonth.toLowerCase().includes(query) ||
        item.displayDayMonthTa.includes(query)
      );
    }

    return list;
  }, [allCelebrations, todayCelebrations, birthdays, anniversaries, activeTab, searchQuery]);

  // Don't render the section if there's no data and loading is done,
  // or render with a warm invitation if admin hasn't populated yet.
  const totalCount = allCelebrations.length;

  return (
    <section
      id="celebrations"
      className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-white via-amber-50/30 to-rose-50/20"
    >
      {/* Decorative background glow accents */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-crimson/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-royal/5 blur-3xl" />

      <div className="container-page relative z-10">
        {/* Section Heading with Festive Badge */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 px-4 py-1.5 shadow-sm backdrop-blur-sm">
            <PartyPopper className="h-4 w-4 text-gold-dark animate-bounce" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-amber-900">
              மகிழ்ச்சியான திருச்சபை விழாக்கள் • Church Family Celebrations
            </span>
            <Sparkles className="h-4 w-4 text-crimson-light" />
          </div>

          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-navy-900">
            பிறந்தநாள் மற்றும் திருமண நாள் வாழ்த்துக்கள்
          </h2>
          <p className="mt-2 text-base sm:text-lg font-medium text-slate-600">
            CSI கிறிஸ்து நாதர் ஆலயம், கல்லிடைக்குறிச்சி திருச்சபை குடும்பங்களுக்கு அன்பின் நல்வாழ்த்துக்கள்!
          </p>

          <div className="mt-4 h-1.5 w-28 rounded-full bg-gradient-to-r from-crimson via-gold to-royal shadow-sm mx-auto" />

          {/* Scriptural Blessing Banner */}
          <div className="mt-6 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-amber-50 p-4 sm:p-5 shadow-sm">
            <p className="text-sm sm:text-base font-semibold text-amber-950 italic">
              “கர்த்தர் உன்னை ஆசீர்வதித்து, உன்னைக் காக்கக்கடவர்; கர்த்தர் தம்முடைய முகத்தை உன்மேல் பிரகாசிக்கப்பண்ணி, உன்மேல் கிருபையாயிருக்கக்கடவர்.”
            </p>
            <p className="mt-1 text-xs sm:text-sm font-bold text-amber-800 tracking-wide">
              — எண்ணாகமம் (Numbers) 6:24-25
            </p>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="mt-10 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 shadow-inner w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "all"
                  ? "bg-white text-navy-950 shadow-md scale-102"
                  : "text-slate-600 hover:text-navy-900 hover:bg-white/50"
              }`}
            >
              <span>அனைத்தும்</span>
              <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">
                {totalCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("today")}
              className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "today"
                  ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-rose-500/20 scale-102"
                  : "text-slate-600 hover:text-navy-900 hover:bg-white/50"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>இன்று</span>
              {todayCelebrations.length > 0 && (
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
                {todayCelebrations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("birthdays")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "birthdays"
                  ? "bg-white text-amber-900 shadow-md scale-102"
                  : "text-slate-600 hover:text-navy-900 hover:bg-white/50"
              }`}
            >
              <Cake className="h-3.5 w-3.5 text-amber-600" />
              <span>பிறந்தநாள்</span>
              <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                {birthdays.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("anniversaries")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "anniversaries"
                  ? "bg-white text-rose-900 shadow-md scale-102"
                  : "text-slate-600 hover:text-navy-900 hover:bg-white/50"
              }`}
            >
              <Heart className="h-3.5 w-3.5 text-rose-600" />
              <span>திருமண நாள்</span>
              <span className="ml-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-800">
                {anniversaries.length}
              </span>
            </button>
          </div>

          {/* Search Input & Refresh Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="பெயர் தேடுக... / Search name"
                className="w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs sm:text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 shadow-sm"
              />
            </div>
            <button
              onClick={() => fetchCelebrations(true)}
              title="புதுப்பிக்கவும் (Refresh)"
              className="p-2 rounded-2xl border border-slate-200 bg-white text-slate-500 hover:text-navy-900 hover:border-slate-300 shadow-sm transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-gold-dark" : ""}`} />
            </button>
          </div>
        </div>

        {/* Celebrations Grid or States */}
        <div className="mt-10">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : filteredCelebrations.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-amber-200 bg-white/70 max-w-xl mx-auto shadow-sm">
              <Gift className="h-12 w-12 text-amber-500 mx-auto opacity-70 mb-3" />
              <h3 className="text-lg sm:text-xl font-bold text-navy-950">
                {searchQuery ? "பொருத்தமான நபர்கள் கிடைக்கவில்லை" : "அடுத்த 30 நாட்களில் விசேஷங்கள் இல்லை"}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500">
                {searchQuery
                  ? `"${searchQuery}" என்ற பெயரில் அடுத்த 30 நாட்களில் பிறந்தநாள் அல்லது திருமண நாள் விசேஷங்கள் காணப்படவில்லை.`
                  : "அடுத்த 30 நாட்களில் திருச்சபை உறுப்பினர்களின் பிறந்தநாள் அல்லது திருமண நாள் நிகழ்வுகள் எதுவும் இல்லை."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-royal bg-royal/10 hover:bg-royal/20 transition-all"
                >
                  தேடலை மீட்டமைக்க (Clear Search)
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCelebrations.map((item, idx) => {
                const isBday = item.type === "birthday";
                const isToday = item.isToday;

                return (
                  <ScrollReveal
                    key={`${item.id}-${item.type}-${item.nextDate}`}
                    direction="up"
                    delay={Math.min(idx * 60, 400)}
                    className="h-full"
                  >
                    <div
                      className={`relative flex flex-col justify-between h-full rounded-3xl p-6 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-card-hover ${
                        isToday
                          ? "bg-gradient-to-br from-amber-50 via-white to-rose-50 border-2 border-amber-400 shadow-glow-gold"
                          : "bg-white border border-slate-200/90 shadow-card hover:border-gold/40"
                      }`}
                    >
                      {/* Top Row: Icon + Badge */}
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          {/* Festive Icon Circle */}
                          <div
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 hover:rotate-6 ${
                              isToday
                                ? isBday
                                  ? "bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-amber-300"
                                  : "bg-gradient-to-tr from-rose-500 to-pink-400 text-white shadow-rose-300"
                                : isBday
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-rose-100 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {isBday ? (
                              <Cake className="h-7 w-7" />
                            ) : (
                              <Heart className="h-7 w-7 fill-current" />
                            )}
                          </div>

                          {/* Days remaining or Today badge */}
                          <div>
                            {isToday ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 px-3.5 py-1 text-xs font-extrabold text-white shadow-md shadow-rose-500/30 animate-pulse">
                                <Sparkles className="h-3 w-3" />
                                {item.daysRemainingText}
                              </span>
                            ) : (
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold border ${
                                  item.daysRemaining === 1
                                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                    : "bg-slate-100 text-slate-700 border-slate-200"
                                }`}
                              >
                                <Calendar className="h-3 w-3 text-slate-400" />
                                {item.daysRemainingText}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Name & Event Type */}
                        <div className="mt-4">
                          <span
                            className={`inline-block text-[11px] font-bold uppercase tracking-wider ${
                              isBday ? "text-amber-800" : "text-rose-800"
                            }`}
                          >
                            {isBday ? "🎂 பிறந்தநாள் விழா • Birthday" : "💐 திருமண நாள் • Wedding Anniversary"}
                          </span>

                          <h3 className="mt-1 text-lg sm:text-xl font-extrabold text-navy-950 leading-snug tracking-tight">
                            {item.name}
                          </h3>
                        </div>

                        {/* Date display */}
                        <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-navy-900 border border-slate-200/70">
                            {item.displayDayMonthTa}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">{item.displayDayMonth}</span>
                        </div>
                      </div>

                      {/* Bottom Blessing Message */}
                      <div className="mt-5 pt-4 border-t border-slate-100">
                        <p
                          className={`text-xs sm:text-[13px] font-medium leading-relaxed ${
                            isToday ? "text-amber-900 font-semibold" : "text-slate-600"
                          }`}
                        >
                          {item.tamilGreeting}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

