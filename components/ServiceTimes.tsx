"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Calendar, Sparkles, HeartPulse, BookOpen, Flame, CheckCircle2, ArrowRight } from "lucide-react";
import { churchInfo } from "@/data/church";

type SundayServiceInfo = {
  weekNum: number;
  titleEn: string;
  titleTa: string;
  desc: string;
  color: string;
  badgeBg: string;
  badgeText: string;
};

const SUNDAY_WEEKS: Record<number, SundayServiceInfo> = {
  1: {
    weekNum: 1,
    titleEn: "Communion Service",
    titleTa: "திருவிருந்து ஆராதனை (Communion Service)",
    desc: "மாதத்தின் முதல் ஞாயிறு - நற்கருணை திருவிருந்து ஆராதனை.",
    color: "from-gold via-amber-500 to-gold-dark",
    badgeBg: "bg-amber-500/20 border-amber-400/40",
    badgeText: "text-amber-300",
  },
  2: {
    weekNum: 2,
    titleEn: "Regular Service",
    titleTa: "வழக்கமான ஆராதனை (Regular Service)",
    desc: "மாதத்தின் இரண்டாம் ஞாயிறு - ஆவிக்குரிய தேவ செய்தி & ஆராதனை.",
    color: "from-blue-500 via-royal to-indigo-700",
    badgeBg: "bg-blue-500/20 border-blue-400/40",
    badgeText: "text-blue-300",
  },
  3: {
    weekNum: 3,
    titleEn: "Communion Service (Anglican)",
    titleTa: "திருவிருந்து ஆராதனை - ஆங்கிலிக்கன் முறை (Anglican Order)",
    desc: "மாதத்தின் மூன்றாம் ஞாயிறு - பாரம்பரிய ஆங்கிலிக்கன் முறை நற்கருணை ஆராதனை.",
    color: "from-crimson via-rose-600 to-red-800",
    badgeBg: "bg-rose-500/20 border-rose-400/40",
    badgeText: "text-rose-300",
  },
  4: {
    weekNum: 4,
    titleEn: "Worship Service",
    titleTa: "துதி & ஆராதனை (Worship Service)",
    desc: "மாதத்தின் நான்காம் ஞாயிறு - விசேஷ துதி மற்றும் ஆராதனை.",
    color: "from-cyan via-teal-600 to-blue-700",
    badgeBg: "bg-cyan-500/20 border-cyan-400/40",
    badgeText: "text-cyan-300",
  },
  5: {
    weekNum: 5,
    titleEn: "Regular Service",
    titleTa: "வழக்கமான ஆராதனை (Regular Service)",
    desc: "மாதத்தின் ஐந்தாம் ஞாயிறு - வழக்கமான தேவ ஆராதனை.",
    color: "from-purple-500 via-indigo-600 to-navy-800",
    badgeBg: "bg-purple-500/20 border-purple-400/40",
    badgeText: "text-purple-300",
  },
};

function computeSchedule(now: Date) {
  const currentDayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const isTodaySunday = currentDayOfWeek === 0;
  const isTodayTuesday = currentDayOfWeek === 2;
  const isTodayFriday = currentDayOfWeek === 5;

  // Calculate upcoming Sunday
  const daysToSunday = isTodaySunday ? 0 : 7 - currentDayOfWeek;
  const upcomingSunday = new Date(now);
  upcomingSunday.setDate(now.getDate() + daysToSunday);

  const sundayDateNum = upcomingSunday.getDate();
  // Week number in the month (Days 1..7 -> week 1, 8..14 -> week 2, 15..21 -> week 3, 22..28 -> week 4, 29..31 -> week 5)
  const sundayWeekNum = Math.min(5, Math.ceil(sundayDateNum / 7));

  // Determine if this upcoming Sunday has 5th week
  const year = upcomingSunday.getFullYear();
  const month = upcomingSunday.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let totalSundaysInMonth = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    if (new Date(year, month, d).getDay() === 0) totalSundaysInMonth++;
  }

  // Active Sunday service
  const currentSundayService = SUNDAY_WEEKS[sundayWeekNum] || SUNDAY_WEEKS[2];

  // Current day of month for fasting prayer check (4th week is days 22..28)
  const todayDayOfMonth = now.getDate();
  const isFourthWeekNow = todayDayOfMonth >= 22 && todayDayOfMonth <= 28;

  // Format date in Tamil / Indian locale
  const monthNamesTa = [
    "ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்",
    "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"
  ];
  const formattedSundayDate = `${sundayDateNum} ${monthNamesTa[month]} ${year}`;

  return {
    isTodaySunday,
    isTodayTuesday,
    isTodayFriday,
    isFourthWeekNow,
    daysToSunday,
    formattedSundayDate,
    sundayWeekNum,
    totalSundaysInMonth,
    currentSundayService,
  };
}

export default function ServiceTimes() {
  const [schedule, setSchedule] = useState(() => computeSchedule(new Date()));

  // Ensure client-side local date calculation on mount and daily interval
  useEffect(() => {
    setSchedule(computeSchedule(new Date()));
    const timer = setInterval(() => {
      setSchedule(computeSchedule(new Date()));
    }, 60000); // periodically update every minute
    return () => clearInterval(timer);
  }, []);

  const {
    isTodaySunday,
    isTodayTuesday,
    isTodayFriday,
    isFourthWeekNow,
    daysToSunday,
    formattedSundayDate,
    sundayWeekNum,
    totalSundaysInMonth,
    currentSundayService,
  } = schedule;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 py-20 sm:py-28 text-white">
      {/* Radiant Glow Atmosphere */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-crimson/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gold/20 blur-3xl pointer-events-none" />

      <div className="container-page relative z-10">
        {/* Section Heading */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/10 px-4 py-1.5 text-xs font-bold text-gold-light backdrop-blur-md">
            <Sparkles size={14} className="text-gold animate-pulse" />
            <span>தேவனைத் துதிக்கும் ஆராதனை வேளைகள்</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl lg:text-5xl text-white tracking-tight">
            ஆராதனை நேரங்கள்
          </h2>
          <div className="mt-3.5 h-1.5 w-24 mx-auto rounded-full bg-gradient-to-r from-crimson via-gold to-royal" />
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            ஒவ்வொரு வாரமும் தேவ பிரசன்னத்தை ருசிக்கவும், சத்திய வசனத்தில் வளரவும் எங்கள் திருச்சபை ஆராதனைகளில் அன்போடு இணையுங்கள்.
          </p>
        </div>

        {/* 4 Separate Dedicated Boxes */}
        <div className="mt-14 grid gap-8 grid-cols-1 lg:grid-cols-2">
          
          {/* ============================================================== */}
          {/* BOX 1: ஞாயிறு ஆராதனை (Sunday Service) - Dynamic Daily Update  */}
          {/* ============================================================== */}
          <div className="group relative flex flex-col justify-between rounded-3xl border-2 border-gold/40 bg-gradient-to-b from-white/10 to-white/5 p-7 sm:p-9 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-gold hover:shadow-glow-gold/30">
            {/* Top Accent Gradient Bar */}
            <div className={`absolute top-0 left-8 right-8 h-1.5 rounded-b-full bg-gradient-to-r ${currentSundayService.color}`} />

            <div>
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold to-amber-500 px-3.5 py-1 text-xs font-black text-navy-950 shadow-sm">
                    <Calendar size={13} />
                    ஞாயிறு ஆராதனை
                  </span>
                  <span className={`rounded-full border px-3 py-0.5 text-xs font-bold ${currentSundayService.badgeBg} ${currentSundayService.badgeText}`}>
                    வாரம் {sundayWeekNum}
                  </span>
                </div>

                {isTodaySunday ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400 px-3 py-0.5 text-xs font-bold text-emerald-300 animate-pulse">
                    ● இன்று நடைபெறும் ஆராதனை!
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-300">
                    அடுத்த ஞாயிறு: {formattedSundayDate} ({daysToSunday} நாட்களில்)
                  </span>
                )}
              </div>

              {/* Dynamic Service Title (Updates Periodically / Daily) */}
              <div className="mt-6">
                <span className="text-xs font-bold tracking-wider uppercase text-gold-light">
                  {isTodaySunday ? "இன்றைய ஆராதனை" : "இந்த வார ஞாயிறு ஆராதனை"}
                </span>
                <h3 className="mt-1 text-2xl sm:text-3xl font-black text-white leading-tight">
                  {currentSundayService.titleTa}
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {currentSundayService.desc}
                </p>
              </div>

              {/* Timing Callout */}
              <div className="mt-6 rounded-2xl bg-white/10 p-4 border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold text-navy-950 font-bold shadow">
                    <Clock size={22} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      ஆராதனை நேரம்
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-white">
                      09:00 AM – 11:30 AM
                    </span>
                  </div>
                </div>
                <span className="hidden sm:inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-gold-light border border-white/10">
                  காலை ஆராதனை
                </span>
              </div>

              {/* Monthly Rotation Breakdown (All 4/5 Weeks Overview) */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  மாதத்தின் வாராந்திர ஞாயிறு அட்டவணை (Monthly Sunday Schedule):
                </span>
                <div className="space-y-2 text-xs">
                  {/* Week 1 */}
                  <div className={`flex items-center justify-between rounded-xl px-3.5 py-2 transition-all ${sundayWeekNum === 1 ? "bg-amber-500/20 border border-amber-400/60 font-bold text-amber-200 shadow-sm" : "bg-white/5 text-slate-300"}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gold-light">1-ம் வாரம்:</span>
                      <span>Communion Service (திருவிருந்து)</span>
                    </div>
                    <span className="font-mono text-[11px]">09:00 - 11:30 AM</span>
                    {sundayWeekNum === 1 && <span className="text-[10px] bg-amber-500 text-navy-950 px-2 py-0.5 rounded-full font-black">இந்த வாரம்</span>}
                  </div>

                  {/* Week 2 */}
                  <div className={`flex items-center justify-between rounded-xl px-3.5 py-2 transition-all ${sundayWeekNum === 2 ? "bg-blue-500/20 border border-blue-400/60 font-bold text-blue-200 shadow-sm" : "bg-white/5 text-slate-300"}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-400">2-ம் வாரம்:</span>
                      <span>Regular Service (வழக்கமான ஆராதனை)</span>
                    </div>
                    <span className="font-mono text-[11px]">09:00 - 11:30 AM</span>
                    {sundayWeekNum === 2 && <span className="text-[10px] bg-blue-400 text-navy-950 px-2 py-0.5 rounded-full font-black">இந்த வாரம்</span>}
                  </div>

                  {/* Week 3 */}
                  <div className={`flex items-center justify-between rounded-xl px-3.5 py-2 transition-all ${sundayWeekNum === 3 ? "bg-rose-500/20 border border-rose-400/60 font-bold text-rose-200 shadow-sm" : "bg-white/5 text-slate-300"}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-400">3-ம் வாரம்:</span>
                      <span>Communion Service (Anglican)</span>
                    </div>
                    <span className="font-mono text-[11px]">09:00 - 11:30 AM</span>
                    {sundayWeekNum === 3 && <span className="text-[10px] bg-rose-400 text-white px-2 py-0.5 rounded-full font-black">இந்த வாரம்</span>}
                  </div>

                  {/* Week 4 */}
                  <div className={`flex items-center justify-between rounded-xl px-3.5 py-2 transition-all ${sundayWeekNum === 4 ? "bg-cyan-500/20 border border-cyan-400/60 font-bold text-cyan-200 shadow-sm" : "bg-white/5 text-slate-300"}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-300">4-ம் வாரம்:</span>
                      <span>Worship Service (துதி & ஆராதனை)</span>
                    </div>
                    <span className="font-mono text-[11px]">09:00 - 11:30 AM</span>
                    {sundayWeekNum === 4 && <span className="text-[10px] bg-cyan-400 text-navy-950 px-2 py-0.5 rounded-full font-black">இந்த வாரம்</span>}
                  </div>

                  {/* Week 5 */}
                  {totalSundaysInMonth === 5 && (
                    <div className={`flex items-center justify-between rounded-xl px-3.5 py-2 transition-all ${sundayWeekNum === 5 ? "bg-purple-500/20 border border-purple-400/60 font-bold text-purple-200 shadow-sm" : "bg-white/5 text-slate-300"}`}>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-purple-300">5-ம் வாரம்:</span>
                        <span>Regular Service (வழக்கமான ஆராதனை)</span>
                      </div>
                      <span className="font-mono text-[11px]">09:00 - 11:30 AM</span>
                      {sundayWeekNum === 5 && <span className="text-[10px] bg-purple-400 text-white px-2 py-0.5 rounded-full font-black">இந்த வாரம்</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-gold" />
                நேரலையில் தினமும் தானாக மாறும்
              </span>
              <Link href="/contact" className="text-xs font-bold text-gold-light hover:underline inline-flex items-center gap-1">
                ஆலய முகவரி <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* ============================================================== */}
          {/* BOX 2: செவ்வாய் சுகமளிக்கும் ஆராதனை (Tuesday Healing Service) */}
          {/* ============================================================== */}
          <div className="group relative flex flex-col justify-between rounded-3xl border border-white/15 bg-white/5 p-7 sm:p-9 backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-crimson/50 hover:bg-white/10 hover:shadow-2xl">
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-8 right-8 h-1.5 rounded-b-full bg-gradient-to-r from-crimson via-rose-500 to-red-700" />

            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson/20 border border-crimson/40 px-3.5 py-1 text-xs font-bold text-rose-300">
                  <HeartPulse size={14} className="text-crimson-light" />
                  ஒவ்வொரு செவ்வாய்க்கிழமையும்
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-crimson/20 text-rose-400 border border-crimson/30 group-hover:scale-110 transition-transform">
                  <HeartPulse size={22} />
                </div>
              </div>

              {isTodayTuesday && (
                <div className="mt-3 inline-block rounded-full bg-crimson px-3 py-0.5 text-xs font-black text-white animate-pulse">
                  🔥 இன்று மாலை 7:00 மணிக்கு!
                </div>
              )}

              <h3 className="mt-5 text-2xl font-black text-white">
                சுகமளிக்கும் ஆராதனை
              </h3>
              <p className="text-sm font-bold text-rose-300 mt-0.5">
                Healing Service
              </p>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                உடல் சுகவீனங்கள், மன சோர்வுகள் மற்றும் குடும்பப் போராட்டங்களிலிருந்து இயேசு கிறிஸ்துவின் நாமத்தினால் பூரண விடுதலையும் தெய்வீக சுகமும் பெற நடைபெறும் சிறப்பு சுகமளிக்கும் ஜெப ஆராதனை.
              </p>

              {/* Timing Box */}
              <div className="mt-6 rounded-2xl bg-white/10 p-4 border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-crimson text-white font-bold shadow">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      நேரம்
                    </span>
                    <span className="text-xl font-black text-white">
                      7:00 PM – 8:00 PM
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-crimson/20 border border-crimson/40 px-3 py-1 text-xs font-bold text-rose-300">
                  மாலை
                </span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>மாதத்தின் அனைத்து செவ்வாய்க்கிழமைகளிலும்</span>
              <Link href="/prayer" className="font-bold text-rose-300 hover:text-white transition-colors">
                ஜெப விண்ணப்பம் அனுப்ப →
              </Link>
            </div>
          </div>

          {/* ============================================================== */}
          {/* BOX 3: வெள்ளி வேத தியானம் (Friday Bible Study)               */}
          {/* ============================================================== */}
          <div className="group relative flex flex-col justify-between rounded-3xl border border-white/15 bg-white/5 p-7 sm:p-9 backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan/50 hover:bg-white/10 hover:shadow-2xl">
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-8 right-8 h-1.5 rounded-b-full bg-gradient-to-r from-cyan via-teal-500 to-blue-600" />

            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan/20 border border-cyan/40 px-3.5 py-1 text-xs font-bold text-cyan-300">
                  <BookOpen size={14} className="text-cyan-300" />
                  ஒவ்வொரு வெள்ளிக்கிழமையும்
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan/20 text-cyan-300 border border-cyan/30 group-hover:scale-110 transition-transform">
                  <BookOpen size={22} />
                </div>
              </div>

              {isTodayFriday && (
                <div className="mt-3 inline-block rounded-full bg-cyan-600 px-3 py-0.5 text-xs font-black text-white animate-pulse">
                  📖 இன்று மாலை 7:00 மணிக்கு!
                </div>
              )}

              <h3 className="mt-5 text-2xl font-black text-white">
                வேத தியானம்
              </h3>
              <p className="text-sm font-bold text-cyan-300 mt-0.5">
                Bible Study
              </p>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                பரிசுத்த வேதாகமத்தின் ஆழமான சத்தியங்களை வசனம் வசனமாக ஆராய்ந்து, நடைமுறை கிறிஸ்தவ வாழ்விற்கான தேவ ஆலோசனைகளையும் ஞானத்தையும் பெற்றுக்கொள்ளும் வேத ஆராய்ச்சி ஐக்கியம்.
              </p>

              {/* Timing Box */}
              <div className="mt-6 rounded-2xl bg-white/10 p-4 border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white font-bold shadow">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      நேரம்
                    </span>
                    <span className="text-xl font-black text-white">
                      7:00 PM – 8:00 PM
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-cyan/20 border border-cyan/40 px-3 py-1 text-xs font-bold text-cyan-300">
                  மாலை
                </span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>மாதத்தின் அனைத்து வெள்ளிக்கிழமைகளிலும்</span>
              <Link href="/contact" className="font-bold text-cyan-300 hover:text-white transition-colors">
                இணைந்து கற்க வாருங்கள் →
              </Link>
            </div>
          </div>

          {/* ============================================================== */}
          {/* BOX 4: மாத உபவாச ஜெபம் (Monthly Fasting Prayer) - 4th Week    */}
          {/* ============================================================== */}
          <div className={`group relative flex flex-col justify-between rounded-3xl border backdrop-blur-md p-7 sm:p-9 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
            isFourthWeekNow
              ? "border-amber-400/80 bg-gradient-to-b from-amber-500/15 via-white/10 to-white/5 ring-2 ring-amber-400/30"
              : "border-white/15 bg-white/5 hover:border-amber-400/50 hover:bg-white/10"
          }`}>
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-8 right-8 h-1.5 rounded-b-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600" />

            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 px-3.5 py-1 text-xs font-bold text-amber-300">
                  <Flame size={14} className="text-amber-400" />
                  மாதத்தின் 4-வது வாரம்
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30 group-hover:scale-110 transition-transform">
                  <Flame size={22} />
                </div>
              </div>

              {isFourthWeekNow && (
                <div className="mt-3 inline-block rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-0.5 text-xs font-black text-navy-950 shadow animate-pulse">
                  🔥 இந்த வாரம்: 4-வது வார உபவாச ஜெபம்!
                </div>
              )}

              <h3 className="mt-5 text-2xl font-black text-white">
                மாத உபவாச ஜெபம்
              </h3>
              <p className="text-sm font-bold text-amber-300 mt-0.5">
                Monthly Fasting Prayer (Every 4th Week)
              </p>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                மாதத்தின் நான்காவது வாரத்தில் திருச்சபையின் விசுவாச குடும்பங்கள், வாலிபர்கள், நோயாளிகள் மற்றும் தேசத்தின் எழுப்புதலுக்காக அனைவரும் ஒருமனப்பட்டு தேவ பாதத்தில் உபவாசித்து மன்றாடும் விசேஷ வல்லமையுள்ள ஜெபக் கூட்டம்.
              </p>

              {/* Timing Box */}
              <div className="mt-6 rounded-2xl bg-white/10 p-4 border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-navy-950 font-black shadow">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      நிகழும் காலம்
                    </span>
                    <span className="text-xl font-black text-white">
                      மாதத்தின் 4-வது வாரம்
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-amber-500/20 border border-amber-400/40 px-3 py-1 text-xs font-bold text-amber-300">
                  சிறப்பு ஜெபம்
                </span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>ஒவ்வொரு மாதமும் 4-வது வாரம்</span>
              <Link href="/prayer" className="font-bold text-amber-300 hover:text-white transition-colors">
                ஜெபக் குறிப்பு இணைக்க →
              </Link>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Link href="/contact" className="btn-primary w-full sm:w-auto">
            <Clock size={18} />
            நேரில் பங்குபெற வாருங்கள்
          </Link>
          <a
            href={churchInfo.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline w-full sm:w-auto"
          >
            யூடியூப் நேரலை பாருங்கள்
          </a>
        </div>
      </div>
    </section>
  );
}
