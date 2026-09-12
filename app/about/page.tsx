import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import PastorsHistoryGrid from "@/components/PastorsHistoryGrid";
import { churchInfo, historyTimeline } from "@/data/church";
import { Cross, Heart, BookOpen, UserCheck, MapPin, Phone, Mail, History, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "எங்களைப் பற்றி & வரலாறு",
  description: "CSI கிறிஸ்து ஆலயம், கல்லிடைக்குறிச்சி - எங்கள் நோக்கம், தலைமைப் போதகர்கள், சபை ஊழியர் மற்றும் திருச்சபை வரலாறு.",
};

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="container-page">
        <SectionHeading
          title="எங்களைப் பற்றி"
          subtitle="CSI கிறிஸ்து ஆலயம் — கல்லிடைக்குறிச்சியில் தேவனுடைய கிருபையை சாட்சியிடும் திருச்சபை"
        />

        {/* Hero Banner Grid */}
        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
              <Image
                src="/images/church-building.jpg"
                alt="CSI கிறிஸ்து ஆலயம்"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="badge-vibrant bg-crimson text-white">
                  கல்லிடைக்குறிச்சி
                </span>
                <h3 className="mt-2 text-xl font-bold text-white">
                  <span className="church-name-ta-source">{churchInfo.name} ({churchInfo.nameEnglish})</span>
                  <span className="church-name-en-override notranslate" translate="no">
                    {churchInfo.nameEnglish}
                  </span>
                </h3>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5 text-slate-700 leading-relaxed">
            <h3 className="text-2xl font-black text-navy-900">
              தேவனுடைய வார்த்தையில் வேரூன்றி, அன்பில் பெருகி வாழும் குடும்பம்
            </h3>
            <p className="text-base">
              கல்லிடைக்குறிச்சியில் அமைந்துள்ள CSI கிறிஸ்து ஆலயம், தேவனை ஆராதிக்கவும், விசுவாசத்தில் வளரவும், சமுதாயத்தில் கிறிஸ்துவின் அன்பைப் பிரதிபலிக்கவும் அர்ப்பணிக்கப்பட்ட ஒரு ஆவிக்குரிய குடும்பமாகும்.
            </p>
            <p className="text-base text-slate-600">
              ஒவ்வொரு வாரமும் தேவ பிரசன்னம் நிறைந்த ஆராதனைகள், வேத வசன போதனைகள், பாடகர் குழுவின் துதிப்பாடல்கள் மற்றும் ஆழமான ஜெப ஐக்கியங்கள் மூலம் விசுவாசிகள் உற்சாகப்படுத்தப்படுகின்றனர்.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <span className="badge-vibrant bg-amber-100 text-amber-800 border border-amber-300">
                ✝ தேவனுடைய வார்த்தை
              </span>
              <span className="badge-vibrant bg-rose-100 text-rose-800 border border-rose-300">
                ❤ கிறிஸ்துவின் அன்பு
              </span>
              <span className="badge-vibrant bg-blue-100 text-blue-800 border border-blue-300">
                🕊 பரிசுத்த ஆவியின் ஐக்கியம்
              </span>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="mt-20 grid gap-8 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-card text-center hover:-translate-y-1.5 transition-all">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-gold to-amber-500 text-navy-950 shadow-glow-gold">
              <Cross size={28} />
            </div>
            <h4 className="mt-5 text-xl font-bold text-navy-900">எங்கள் நோக்கம்</h4>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              கிறிஸ்துவின் சுவிசேஷத்தை அறிவித்து, விசுவாசிகளை சீஷத்துவத்தில் வளர்த்து, தேவனுடைய நாமத்தை மகிமைப்படுத்துவது.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-card text-center hover:-translate-y-1.5 transition-all">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-crimson to-rose-600 text-white shadow-glow-crimson">
              <Heart size={28} />
            </div>
            <h4 className="mt-5 text-xl font-bold text-navy-900">எங்கள் பார்வை</h4>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              அன்பினாலும் இரக்கத்தினாலும் நிறைந்த ஒரு சமூகத்தை உருவாக்கி, அனைவருக்கும் ஆறுதலும் ஆசீர்வாதமுமாகத் திகழ்வது.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-card text-center hover:-translate-y-1.5 transition-all">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-royal to-blue-600 text-white shadow-glow-royal">
              <BookOpen size={28} />
            </div>
            <h4 className="mt-5 text-xl font-bold text-navy-900">விசுவாச அறிக்கை</h4>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              பரிசுத்த வேதாகமத்தை தேவனுடைய பூரண சத்தியமாக விசுவாசித்து, பிதா, குமாரன், பரிசுத்த ஆவியாகிய திரியேக தேவனை ஆராதிக்கிறோம்.
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Leadership Spotlight: Chief Pastor & Catechist with Photos    */}
        {/* ============================================================== */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <span className="badge-vibrant bg-gold/20 text-navy-950 border border-gold/40">
              <UserCheck size={14} /> திருச்சபை தலைமை & ஊழியர்கள்
            </span>
            <h3 className="mt-3 text-3xl font-black text-navy-900">
              எங்கள் தலைமை போதகர் & சபை ஊழியர்
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
              தேவனுடைய வார்த்தையை போதித்து, திருச்சபையை ஆவிக்குரிய வழியில் நடத்தி வரும் இறை ஊழியர்கள்.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* 1. Chief Pastor Card */}
            <div className="group rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-amber-50/60 via-white to-amber-50/30 p-7 sm:p-9 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-2xl border-4 border-white shadow-lg ring-4 ring-gold/40 bg-slate-100 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={churchInfo.pastorImage}
                    alt={churchInfo.pastorName}
                    fill
                    className="object-cover object-top"
                  />
                </div>

                <div className="space-y-3 text-center sm:text-left flex-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/30 px-3 py-1 text-xs font-black text-amber-950">
                    <UserCheck size={13} />
                    <span>{churchInfo.pastorTitle}</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-navy-900 leading-tight">
                    {churchInfo.pastorName}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    தேவனுடைய ஆட்டுக்குட்டிகளை மேய்த்து, சத்திய வசனங்களை போதித்து, திருச்சபை மக்களை ஆவிக்குரிய நிறைவில் வழிநடத்தி வருகிறார்.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-3 text-xs font-semibold text-slate-700 justify-center sm:justify-start">
                    <a href={`tel:${churchInfo.phone}`} className="flex items-center gap-1.5 hover:text-crimson">
                      <Phone size={14} className="text-gold" /> {churchInfo.phone}
                    </a>
                    <a href={`mailto:${churchInfo.email}`} className="flex items-center gap-1.5 hover:text-crimson">
                      <Mail size={14} className="text-cyan-600" /> {churchInfo.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Catechist Card (திரு. T. ரெபின் ஆஸ்டின்) */}
            <div className="group rounded-3xl border-2 border-royal/30 bg-gradient-to-br from-blue-50/60 via-white to-blue-50/30 p-7 sm:p-9 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-2xl border-4 border-white shadow-lg ring-4 ring-royal/40 bg-slate-100 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={churchInfo.catechistImage}
                    alt={churchInfo.catechistName}
                    fill
                    className="object-cover object-top"
                  />
                </div>

                <div className="space-y-3 text-center sm:text-left flex-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-royal/20 px-3 py-1 text-xs font-black text-royal">
                    <Users size={13} />
                    <span>{churchInfo.catechistTitle}</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-navy-900 leading-tight">
                    {churchInfo.catechistName}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    திருச்சபையின் ஆராதனைப் பணிகள், சிறுவர் ஊழியம், மற்றும் குடும்ப சந்திப்பு ஜெபங்களில் அர்ப்பணிப்புடன் சபை ஊழியராகப் பணியாற்றி வருகிறார்.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-3 text-xs font-semibold text-slate-700 justify-center sm:justify-start">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <MapPin size={14} className="text-crimson" /> {churchInfo.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Church History Timeline (Integrated within About Us)          */}
        {/* ============================================================== */}
        <div className="mt-24 pt-16 border-t border-slate-200" id="history">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-1.5 text-xs font-bold text-navy-950 border border-gold/40">
              <History size={15} />
              <span>விசுவாசப் பாதை & மைல்கற்கள்</span>
            </div>
            <h3 className="mt-3 text-3xl sm:text-4xl font-black text-navy-900">
              எங்கள் திருச்சபையின் வரலாறு (Our History)
            </h3>
            <div className="mt-3 h-1.5 w-20 mx-auto rounded-full bg-gradient-to-r from-crimson via-gold to-royal" />
            <p className="mt-4 text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              &ldquo;இதுவரைக்கும் கர்த்தர் எங்களுக்கு உதவி செய்தார்&rdquo; — கல்லிடைக்குறிச்சியில் ஆரம்பம் முதல் இன்று வரை கர்த்தர் வழிநடத்தி வந்த விசுவாச மைல்கற்கள்.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-2xl relative">
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-gold via-crimson to-royal rounded-full" />
            <ol className="space-y-8">
              {historyTimeline.map((item, i) => (
                <li key={i} className="relative flex items-center">
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-gold to-crimson text-white shadow-md ring-4 ring-white">
                    <History size={18} />
                  </div>
                  <div
                    className={`ml-16 sm:ml-0 w-full sm:w-[45%] rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card transition-all hover:shadow-card-hover ${
                      i % 2 === 0 ? "sm:mr-auto sm:text-right" : "sm:ml-auto sm:text-left"
                    }`}
                  >
                    <span className="inline-block rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-3 py-0.5 text-xs font-bold">
                      {item.year && !item.year.includes("[") ? item.year : `மைல்கல் #${i + 1}`}
                    </span>
                    <h4 className="mt-2 text-lg font-bold text-navy-900">{item.event}</h4>
                    <p className="mt-1 text-xs text-slate-500">கல்லிடைக்குறிச்சி திருச்சபையின் ஆசீர்வதிக்கப்பட்ட தருணம்.</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* ============================================================== */}
          {/* Pastors & Catechists Through the Years (Image, Name & Year)   */}
          {/* ============================================================== */}
          <div className="mt-20 pt-16 border-t border-slate-200">
            <div className="text-center">
              <span className="badge-vibrant bg-royal/10 text-royal border border-royal/30">
                திருச்சபை ஊழியர்கள்
              </span>
              <h3 className="mt-3 text-2xl sm:text-3xl font-black text-navy-900">
                போதகர்கள் & சபை ஊழியர்கள் (Pastors & Workers Through the Years)
              </h3>
              <p className="mt-2 text-sm text-slate-500 max-w-lg mx-auto">
                இத்திருச்சபையில் தற்போதும் மற்றும் முந்தைய காலங்களிலும் தேவனுடைய பணியை ஆற்றிய போதகர்கள்.
              </p>
            </div>

            <PastorsHistoryGrid />
          </div>
        </div>

      </div>
    </div>
  );
}
