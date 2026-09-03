import Image from "next/image";
import { pastorsHistory } from "@/data/church";
import { User, Calendar } from "lucide-react";

export default function PastorsHistoryGrid() {
  return (
    <div className="mt-8">
      {/* Helpful note for user */}
      <div className="mb-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 p-3.5 text-xs text-amber-900 text-center">
        💡 <strong>குறிப்பு:</strong> முந்தைய போதகர்களின் புகைப்படங்களை <code className="font-mono bg-amber-200/70 px-1.5 py-0.5 rounded font-bold">public/images/pastors/</code> கோப்புறையிலும், பெயர் மற்றும் ஆண்டுகளை <code className="font-mono bg-amber-200/70 px-1.5 py-0.5 rounded font-bold">data/church.ts</code> கோப்பிலும் மாற்றிக்கொள்ளலாம்.
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pastorsHistory.map((person) => (
          <div
            key={person.id}
            className={`group overflow-hidden rounded-3xl border bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover ${
              person.isCurrent
                ? "border-gold/60 ring-2 ring-gold/20"
                : "border-slate-200/80 hover:border-royal/40"
            }`}
          >
            {/* 1. Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-navy-950 via-royal-dark to-slate-900 flex items-center justify-center">
              {person.image && !person.image.includes("placeholder") ? (
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 border border-white/20 mb-2 group-hover:scale-110 transition-transform">
                    <User size={30} className="text-gold-light" />
                  </div>
                  <span className="text-xs text-slate-300 font-semibold">புகைப்படம் விரைவில்</span>
                </div>
              )}

              {/* Current Serving Badge */}
              {person.isCurrent && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="badge-vibrant bg-gold text-navy-950 font-black shadow-sm text-[11px]">
                    தற்போது பணியில்
                  </span>
                </div>
              )}
            </div>

            {/* 2. Name & 3. Year of working (Only these two as requested) */}
            <div className="p-5 text-center">
              <h4 className="text-base font-bold text-navy-900 line-clamp-2 leading-snug group-hover:text-royal transition-colors">
                {person.name}
              </h4>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-slate-700">
                <Calendar size={13} className="text-crimson" />
                <span>{person.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

