import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Church, MapPin, Clock, UserCheck, Phone, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { subChurches, churchInfo } from "@/data/church";

export const metadata: Metadata = {
  title: "கிளைத் திருச்சபைகள் (Sub Churches)",
  description: "CSI கிறிஸ்து ஆலயம், கல்லிடைக்குறிச்சி - கிளைத் திருச்சபைகள், ஆராதனை நேரங்கள் மற்றும் இருப்பிடம்.",
};

export default function SubChurchesPage() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">
      <div className="container-page">
        <SectionHeading
          title="கிளைத் திருச்சபைகள் (Sub Churches)"
          subtitle="கல்லிடைக்குறிச்சி CSI கிறிஸ்து ஆலயத்தின் கீழ் இயங்கும் கிளைத் திருச்சபைகள்"
        />

        {/* Helpful instructions banner for user */}
        <div className="mt-8 mx-auto max-w-2xl rounded-2xl border border-amber-300 bg-amber-50/80 p-4 text-xs sm:text-sm text-amber-900 shadow-sm text-center">
          💡 <strong>குறிப்பு:</strong> கிளை ஆலயங்களின் பெயர், இருப்பிடம் ஆகியவற்றை <code className="bg-amber-200/80 px-1.5 py-0.5 rounded font-mono text-amber-950 font-bold">data/church.ts</code> கோப்பில் மாற்றிக்கொள்ளலாம். புகைப்படங்களை <code className="bg-amber-200/80 px-1.5 py-0.5 rounded font-mono text-amber-950 font-bold">public/images/sub-church-1.jpg</code> என்ற பெயரில் சேர்க்கலாம்.
        </div>

        {/* 4 Sub Churches Grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {subChurches.map((church, i) => (
            <article
              key={church.id}
              className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-gold/50 flex flex-col justify-between"
            >
              {/* Church Image Container */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-navy-950 via-royal to-crimson-deep flex items-center justify-center">
                {/* Fallback pattern and church icon */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative z-10 flex flex-col items-center justify-center text-white p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                    <Church size={32} className="text-gold-light" />
                  </div>
                  <span className="mt-3 text-xs font-bold text-slate-200 uppercase tracking-wider">
                    {church.name}
                  </span>
                </div>

                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="badge-vibrant bg-crimson text-white shadow-sm">
                    கிளை ஆலயம் #{i + 1}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-navy-900 transition-colors group-hover:text-royal">
                    {church.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {church.description}
                  </p>

                  <dl className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs sm:text-sm text-slate-700">
                    <div className="flex items-start gap-2.5">
                      <MapPin size={17} className="text-crimson shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-navy-900 block">இருப்பிடம் (Location):</span>
                        <span className="text-slate-600">{church.location}</span>
                        <p className="text-xs text-slate-400 mt-0.5">{church.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 pt-2 border-t border-slate-200/60">
                      <Clock size={16} className="text-gold-dark shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-800">ஆராதனை நேரம்: </span>
                        <span className="font-bold text-navy-900">{church.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 pt-2 border-t border-slate-200/60">
                      <UserCheck size={16} className="text-royal shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-800">தலைமை போதகர்: </span>
                        <span className="font-bold text-navy-900">{church.pastor}</span>
                      </div>
                    </div>
                  </dl>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={`tel:${churchInfo.phone}`}
                    className="btn-primary !py-2 !px-4 !text-xs inline-flex items-center gap-1.5"
                  >
                    <Phone size={13} />
                    தொடர்பு கொள்ள
                  </a>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-xs font-bold text-navy-900 hover:text-crimson transition-colors"
                  >
                    வழிகாட்டி & முகவரி <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link href="/contact" className="btn-primary">
            பிரதான ஆலயம் — கல்லிடைக்குறிச்சி
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

