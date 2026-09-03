import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import PastorsHistoryGrid from "@/components/PastorsHistoryGrid";
import { historyTimeline, churchInfo } from "@/data/church";
import { History, Calendar, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "எங்கள் வரலாறு & போதகர்கள்",
  description: "CSI கிறிஸ்து ஆலயம், கல்லிடைக்குறிச்சி - ஆரம்பம் முதல் இன்று வரையிலான தேவனுடைய வழிநடத்துதல் மற்றும் போதகர்கள்.",
};

export default function HistoryPage() {
  const nodeGradients = [
    "from-gold to-amber-500",
    "from-crimson to-rose-600",
    "from-royal to-blue-600",
    "from-cyan to-teal-600",
    "from-purple-600 to-indigo-600",
  ];

  return (
    <div className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="container-page">
        <SectionHeading
          title="எங்கள் திருச்சபையின் வரலாறு"
          subtitle="தலைமுறை தலைமுறையாக கர்த்தர் எங்களை வழிநடத்தி வந்த விசுவாசப் பாதை"
        />

        {/* Intro Highlight Box */}
        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-gold/30 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/50 p-6 sm:p-8 shadow-md text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold text-navy-950 font-bold shadow mb-3">
            <History size={24} />
          </div>
          <h3 className="text-xl font-bold text-navy-900">
            {churchInfo.name} — தெற்கு கல்லிடைக்குறிச்சி
          </h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            &ldquo;இதுவரைக்கும் கர்த்தர் எங்களுக்கு உதவி செய்தார்&rdquo; (1 சாமுவேல் 7:12) என்ற விசுவாச வார்த்தையின்படி, பல தலைமுறைகளாக தேவனுடைய மாறாத கிருபையை ருசித்து வரும் திருச்சபையாக எமது ஆலயம் திகழ்கிறது.
          </p>
        </div>

        {/* Colorful Timeline */}
        <div className="mx-auto mt-16 max-w-2xl relative">
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-gold via-crimson to-royal rounded-full" />

          <ol className="space-y-12">
            {historyTimeline.map((item, i) => {
              const gradient = nodeGradients[i % nodeGradients.length];
              const isEven = i % 2 === 0;

              return (
                <li key={i} className="relative flex items-center">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-6 sm:left-1/2 -translate-x-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr ${gradient} text-white shadow-lg ring-4 ring-white`}
                  >
                    <CheckCircle2 size={18} />
                  </div>

                  {/* Card Content */}
                  <div
                    className={`ml-16 sm:ml-0 w-full sm:w-[45%] rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
                      isEven ? "sm:mr-auto sm:text-right" : "sm:ml-auto sm:text-left"
                    }`}
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm bg-gradient-to-r ${gradient}`}
                    >
                      <Calendar size={12} />
                      {item.year && !item.year.includes("[") ? item.year : `மைல்கல் #${i + 1}`}
                    </span>
                    <h4 className="mt-3 text-lg font-bold text-navy-900">
                      {item.event}
                    </h4>
                    <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                      தெற்கு கல்லிடைக்குறிச்சி திருச்சபையின் விசுவாச வரலாற்றில் ஒரு முக்கியமான தருணம்.
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ============================================================== */}
        {/* Pastors & Catechists Through the Years (Image, Name & Year)   */}
        {/* ============================================================== */}
        <div className="mt-24 pt-16 border-t border-slate-200">
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
  );
}
