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
  BookOpen,
  Quote,
  Sun,
  Sunrise,
} from "lucide-react";
import type { CelebrationEvent } from "@/lib/celebrations/date-utils";
import ScrollReveal from "./ScrollReveal";

// Tab Filter: All (next 30 days) removed as requested. Only Today, Tomorrow, Birthdays, and Anniversaries.
type TabFilter = "today" | "tomorrow" | "birthdays" | "anniversaries";

// Curated Bible blessing verses for Birthdays
const BIRTHDAY_VERSES = [
  {
    verse: "அவர் உன் இருதயத்தின் விருப்பத்தின்படி உனக்குத் தந்தருளி, உன் ஆலோசனைகளையெல்லாம் நிறைவேற்றுவாராக.",
    ref: "சங்கீதம் (Psalms) 20:4",
  },
  {
    verse: "கர்த்தர் உன்னை ஆசீர்வதித்து, உன்னைக் காக்கக்கடவர்; கர்த்தர் தம்முடைய முகத்தை உன்மேல் பிரகாசிக்கப்பண்ணி, உன்மேல் கிருபையாயிருக்கக்கடவர்.",
    ref: "எண்ணாகமம் (Numbers) 6:24-25",
  },
  {
    verse: "நீ போகும் இடமெல்லாம் உன் தேவனாகிய கர்த்தர் உன்னோடே இருக்கிறார்; பலங்கொண்டு திடமனதாயிரு.",
    ref: "யோசுவா (Joshua) 1:9",
  },
  {
    verse: "உன் சமாதானம் நதியைப்போலவும், உன் நீதி சமுத்திரத்தின் அலைகளைப்போலவும் இருக்கும்.",
    ref: "ஏசாயா (Isaiah) 48:18",
  },
  {
    verse: "கர்த்தர் உன்னை எப்போதும் நடத்தி, வரட்சியான காலங்களில் உன் ஆத்துமாவைத் திருப்தியாக்கி, உன் எலும்புகளை நிணமுள்ளதாக்குவார்.",
    ref: "ஏசாயா (Isaiah) 58:11",
  },
  {
    verse: "நன்மையையும் கிருபையும் என் ஜீவனுள்ள நாளெல்லாம் என்னைத் தொடரும்; நான் கர்த்தருடைய வீட்டிலே நீடித்த நாட்களாய் நிலைத்திருப்பேன்.",
    ref: "சங்கீதம் (Psalms) 23:6",
  },
  {
    verse: "கர்த்தர் உன்மேல் பிரியமாயிருந்து, உனக்கு நன்மையை வரப்பண்ணுவார்.",
    ref: "உபாகமம் (Deuteronomy) 28:63",
  },
];

// Curated Bible blessing verses for Wedding Anniversaries
const ANNIVERSARY_VERSES = [
  {
    verse: "அன்பு சகலத்தையும் தாங்கும், சகலத்தையும் விசுவாசிக்கும், சகலத்தையும் நம்பும், சகலத்தையும் சகிக்கும். அன்பு ஒருக்காலும் ஒழியாது.",
    ref: "1 கொரிந்தியர் (1 Corinthians) 13:7-8",
  },
  {
    verse: "கர்த்தருக்குப் பயந்து, அவர் வழிகளில் நடக்கிற எவனும் பாக்கியவான். உன் மனைவியானவள் உன் வீட்டோரங்களில் கனிதரும் திராட்சக்கொடியைப்போல் இருப்பாள்.",
    ref: "சங்கீதம் (Psalms) 128:1,3",
  },
  {
    verse: "இருவர் கூடி வாழ்வது நலம்; முப்புரிநூல் சீக்கிரமாய் அறாது. கர்த்தர் உங்கள் குடும்பத்தை என்றென்றைக்கும் ஆசீர்வதிப்பாராக.",
    ref: "பிரசங்கி (Ecclesiastes) 4:9,12",
  },
  {
    verse: "தேவன் இணைத்ததை மனிதன் பிரிக்காதிருக்கக்கடவன். கர்த்தர் உங்கள் இல்லத்தை தம்முடைய தெய்வீக சமாதானத்தினால் நிரப்புவாராக.",
    ref: "மாற்கு (Mark) 10:9",
  },
  {
    verse: "கர்த்தர் உங்கள் வீட்டைக் கட்டி, உங்கள் குடும்பத்தை ஆசீர்வதித்து, தலைமுறை தலைமுறையாக உங்களைக் காப்பாராக.",
    ref: "சங்கீதம் (Psalms) 127:1",
  },
  {
    verse: "நாங்கள் ஒருவரையொருவர் நேசித்தால் தேவன் நமக்குள் நிலைத்திருப்பார்; அவருடைய அன்பும் நம்மிடம் பூரணப்படும்.",
    ref: "1 யோவான் (1 John) 4:12",
  },
];

function getBibleVerse(id: string, name: string, type: "birthday" | "anniversary") {
  const verses = type === "birthday" ? BIRTHDAY_VERSES : ANNIVERSARY_VERSES;
  let hash = 0;
  const str = id + name;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % verses.length;
  return verses[index];
}

// Festive Colorful Balloons Illustration for Birthday Theme
function BirthdayBalloonsGraphic({ className = "w-14 h-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="balloon-red" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FCA5A5" />
          <stop offset="40%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </radialGradient>
        <radialGradient id="balloon-gold" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>
        <radialGradient id="balloon-blue" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="40%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </radialGradient>
      </defs>

      {/* Strings */}
      <path d="M30 65 C32 80, 50 92, 50 108" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <path d="M70 65 C68 80, 50 92, 50 108" stroke="#1E3A8A" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <path d="M50 58 C50 75, 50 90, 50 108" stroke="#B91C1C" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />

      {/* Left Gold Balloon */}
      <g>
        <ellipse cx="32" cy="40" rx="16" ry="22" fill="url(#balloon-gold)" />
        <ellipse cx="27" cy="33" rx="3.5" ry="7" fill="white" opacity="0.6" transform="rotate(-20 27 33)" />
        <polygon points="30,61 34,61 32,64" fill="#B45309" />
      </g>

      {/* Right Blue Balloon */}
      <g>
        <ellipse cx="68" cy="40" rx="16" ry="22" fill="url(#balloon-blue)" />
        <ellipse cx="63" cy="33" rx="3.5" ry="7" fill="white" opacity="0.6" transform="rotate(-20 63 33)" />
        <polygon points="66,61 70,61 68,64" fill="#1E3A8A" />
      </g>

      {/* Center Front Red Balloon */}
      <g>
        <ellipse cx="50" cy="32" rx="18" ry="25" fill="url(#balloon-red)" />
        <ellipse cx="44" cy="24" rx="4" ry="8" fill="white" opacity="0.7" transform="rotate(-20 44 24)" />
        <polygon points="48,56 52,56 50,59" fill="#B91C1C" />
      </g>

      {/* Ribbon Knot */}
      <circle cx="50" cy="108" r="2.5" fill="#D97706" />
    </svg>
  );
}

// Romantic Glowing Hearts Illustration for Anniversary Theme
function AnniversaryHeartsGraphic({ className = "w-14 h-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="heart-red" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FDA4AF" />
          <stop offset="40%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#9F1239" />
        </radialGradient>
        <radialGradient id="heart-pink" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FECDD3" />
          <stop offset="40%" stopColor="#FB7185" />
          <stop offset="100%" stopColor="#BE123C" />
        </radialGradient>
        <radialGradient id="heart-gold" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>
      </defs>

      {/* Sparkles */}
      <circle cx="20" cy="20" r="2" fill="#FDE047" opacity="0.8" />
      <circle cx="80" cy="25" r="2.5" fill="#FDE047" opacity="0.8" />
      <circle cx="50" cy="6" r="2" fill="#FDE047" opacity="0.8" />

      {/* Ribbons */}
      <path d="M34 62 C36 78, 50 90, 50 106" stroke="#FDA4AF" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 2" opacity="0.7" />
      <path d="M66 62 C64 78, 50 90, 50 106" stroke="#FDA4AF" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 2" opacity="0.7" />
      <path d="M50 56 C50 74, 50 88, 50 106" stroke="#E11D48" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />

      {/* Left Pink Heart */}
      <g>
        <path d="M34 44 C20 28, 12 46, 34 64 C56 46, 48 28, 34 44 Z" fill="url(#heart-pink)" />
        <ellipse cx="27" cy="38" rx="2.5" ry="5" fill="white" opacity="0.5" transform="rotate(-25 27 38)" />
      </g>

      {/* Right Gold Heart */}
      <g>
        <path d="M66 44 C52 28, 44 46, 66 64 C88 46, 80 28, 66 44 Z" fill="url(#heart-gold)" />
        <ellipse cx="59" cy="38" rx="2.5" ry="5" fill="white" opacity="0.5" transform="rotate(-25 59 38)" />
      </g>

      {/* Center Big Heart */}
      <g>
        <path d="M50 24 C32 4, 18 28, 50 56 C82 28, 68 4, 50 24 Z" fill="url(#heart-red)" />
        <ellipse cx="40" cy="18" rx="3.5" ry="7" fill="white" opacity="0.65" transform="rotate(-25 40 18)" />
      </g>

      {/* Golden Rings */}
      <circle cx="48" cy="106" r="3.5" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
      <circle cx="53" cy="106" r="3.5" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export default function BirthdayAnniversarySection() {
  const [birthdays, setBirthdays] = useState<CelebrationEvent[]>([]);
  const [anniversaries, setAnniversaries] = useState<CelebrationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>("today");
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
      list = list.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        item.displayDayMonth.toLowerCase().includes(query) ||
        item.displayDayMonthTa.includes(query)
      );
    }

    return list;
  }, [todayList, tomorrowList, birthdayList, anniversaryList, activeTab, searchQuery]);

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
        {/* 1. RED BOX AREA: MAIN TITLE & CHURCH GREETING SUBTITLE        */}
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
        {/* 2. BLACK BOX AREA: TODAY & TOMORROW LIST WITH BALLOONS/HEARTS */}
        {/* ============================================================== */}
        <div className="mt-10 max-w-6xl mx-auto">
          {/* Controls Bar: Only Today, Tomorrow, Birthdays, Anniversaries (All removed) */}
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

          {/* Celebrations Grid */}
          <div className="mt-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-3xl border-2 border-amber-200 bg-white p-6 shadow-md animate-pulse space-y-4"
                  >
                    <div className="h-16 bg-amber-100 rounded-2xl w-full" />
                    <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto" />
                    <div className="h-4 bg-slate-100 rounded w-1/2 mx-auto" />
                    <div className="h-20 bg-amber-50 rounded-2xl w-full" />
                  </div>
                ))}
              </div>
            ) : filteredCelebrations.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-amber-300 bg-white/80 max-w-xl mx-auto shadow-sm">
                <Gift className="h-14 w-14 text-amber-500 mx-auto opacity-80 mb-3 animate-bounce" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCelebrations.map((item, idx) => {
                  const isBday = item.type === "birthday";
                  const isToday = item.isToday;
                  const scripture = getBibleVerse(item.id, item.name, item.type);

                  return (
                    <ScrollReveal
                      key={`${item.id}-${item.type}-${item.nextDate}`}
                      direction="up"
                      delay={Math.min(idx * 50, 350)}
                      className="h-full"
                    >
                      {/* ==================================================== */}
                      {/* GREETING CARD TEMPLATE (Balloons for Bday, Hearts for Anni) */}
                      {/* ==================================================== */}
                      <article
                        className={`relative flex flex-col justify-between h-full rounded-3xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
                          isToday
                            ? "border-2 border-amber-400 ring-4 ring-amber-300/40 shadow-glow-gold"
                            : isBday
                            ? "border-2 border-amber-200/90 ring-2 ring-amber-100 shadow-xl hover:border-amber-400"
                            : "border-2 border-rose-200/90 ring-2 ring-rose-100 shadow-xl hover:border-rose-400"
                        }`}
                        style={{
                          background: isBday
                            ? "linear-gradient(180deg, #FFFDF7 0%, #FFF8EA 40%, #FFFFFF 100%)"
                            : "linear-gradient(180deg, #FFFDFC 0%, #FFF1F2 40%, #FFFFFF 100%)",
                        }}
                      >
                        {/* Decorative Top Banner with Balloons / Hearts */}
                        <div
                          className={`relative px-5 pt-4 pb-3 text-center overflow-hidden ${
                            isBday
                              ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-amber-950"
                              : "bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 text-white"
                          }`}
                        >
                          {/* Festive Pattern Background */}
                          <div className="absolute inset-0 pointer-events-none opacity-20">
                            <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                              <circle cx="20" cy="20" r="3" fill="currentColor" />
                              <circle cx="60" cy="50" r="2" fill="currentColor" />
                              <circle cx="110" cy="15" r="4" fill="currentColor" />
                              <circle cx="180" cy="45" r="3" fill="currentColor" />
                              <circle cx="240" cy="25" r="2.5" fill="currentColor" />
                              <circle cx="280" cy="60" r="3" fill="currentColor" />
                            </svg>
                          </div>

                          {/* Balloons Graphic for Birthday / Hearts Graphic for Anniversary */}
                          <div className="relative z-10 flex items-center justify-between gap-3">
                            {/* Left Graphic */}
                            <div className="shrink-0">
                              {isBday ? (
                                <BirthdayBalloonsGraphic className="w-12 h-14 drop-shadow-sm" />
                              ) : (
                                <AnniversaryHeartsGraphic className="w-12 h-14 drop-shadow-sm" />
                              )}
                            </div>

                            {/* Center Title & Badge */}
                            <div className="flex-1 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {isBday ? (
                                  <>
                                    <Cake className="h-4 w-4 animate-bounce" />
                                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
                                      பிறந்தநாள் • Birthday
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Heart className="h-4 w-4 fill-current animate-pulse" />
                                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
                                      திருமண நாள் • Anniversary
                                    </span>
                                  </>
                                )}
                              </div>

                              {/* Today / Tomorrow Badge */}
                              <div className="mt-1.5 flex justify-center">
                                {isToday ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-0.5 text-[11px] font-black text-rose-600 shadow-md animate-pulse">
                                    <Sparkles className="h-3 w-3 text-amber-500" />
                                    {isBday ? "🎉 இன்று பிறந்தநாள்!" : "💐 இன்று திருமண நாள்!"}
                                  </span>
                                ) : (
                                  <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                                      isBday
                                        ? "bg-amber-900/15 text-amber-950"
                                        : "bg-white/20 text-white"
                                    }`}
                                  >
                                    <Sunrise className="h-3 w-3" />
                                    <span>நாளை (Tomorrow)</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Right Graphic Mirror */}
                            <div className="shrink-0 transform scale-x-[-1]">
                              {isBday ? (
                                <BirthdayBalloonsGraphic className="w-12 h-14 drop-shadow-sm" />
                              ) : (
                                <AnniversaryHeartsGraphic className="w-12 h-14 drop-shadow-sm" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Body: Name, Date & Bible Verse */}
                        <div className="p-6 flex flex-col justify-between flex-1 space-y-5">
                          {/* 1. Member / Couple Name */}
                          <div className="text-center pt-2">
                            <h3 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight leading-snug">
                              {item.name}
                            </h3>

                            {/* 2. Date Pill */}
                            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl border border-amber-200/80 bg-white/90 px-3 py-1 shadow-sm text-xs sm:text-sm font-bold text-slate-700">
                              <Calendar className="h-3.5 w-3.5 text-amber-600" />
                              <span className="text-navy-950">{item.displayDayMonthTa}</span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-500 font-medium">{item.displayDayMonth}</span>
                            </div>
                          </div>

                          {/* 3. Bible Verse Plaque (Scriptural Blessing) */}
                          <div
                            className={`rounded-2xl p-4 text-center border relative shadow-inner ${
                              isBday
                                ? "bg-amber-50/70 border-amber-200/90 text-amber-950"
                                : "bg-rose-50/70 border-rose-200/90 text-rose-950"
                            }`}
                          >
                            <Quote
                              className={`h-5 w-5 mx-auto mb-1 opacity-40 ${
                                isBday ? "text-amber-700" : "text-rose-700"
                              }`}
                            />
                            <p className="text-xs sm:text-[13px] font-semibold italic leading-relaxed">
                              “{scripture.verse}”
                            </p>
                            <div className="mt-2.5 pt-2 border-t border-amber-200/50 flex items-center justify-center gap-1.5 text-[11px] font-bold opacity-85">
                              <BookOpen className="h-3 w-3" />
                              <span>{scripture.ref}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </ScrollReveal>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
