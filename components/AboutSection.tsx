import Link from "next/link";
import Image from "next/image";
import SectionHeading from "./SectionHeading";
import { churchInfo } from "@/data/church";
import { Church, Heart, BookOpen, ArrowRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 sm:py-28 relative overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute top-10 right-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-72 h-72 bg-crimson/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-page relative z-10">
        <SectionHeading
          title="CSI கிறிஸ்து ஆலயத்திற்கு அன்போடு வரவேற்கின்றோம்"
          subtitle="கல்லிடைக்குறிச்சியில் தேவனுடைய அன்பையும் கிருபையையும் பகிர்ந்துகொள்ளும் குடும்பம்"
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Sanctuary Photo with Decorative Frame */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl p-2 bg-gradient-to-br from-gold via-crimson to-royal shadow-xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] bg-slate-900">
                <Image
                  src="/images/church-building.jpg"
                  alt="CSI கிறிஸ்து ஆலயம் கருவறை"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block rounded-full bg-crimson/90 px-3 py-1 text-xs font-bold shadow">
                    பரிசுத்த அலங்காரத்துடனே கர்த்தரைத் தொழுதுகொள்ளுங்கள்
                  </span>
                  <p className="mt-1 text-sm font-medium text-slate-200">
                    {churchInfo.name} — கல்லிடைக்குறிச்சி
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative & Feature Highlights */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4 text-slate-700 leading-relaxed">
              <p className="text-lg font-medium text-navy-900">
                கர்த்தராகிய இயேசு கிறிஸ்துவின் இனிய நாமத்தில் உங்கள் அனைவரையும் CSI கிறிஸ்து ஆலயத்திற்கு அன்புடன் வரவேற்கிறோம்.
              </p>
              <p className="text-base text-slate-600">
                எங்கள் திருச்சபை தேவனுடைய சத்திய வார்த்தையில் வேரூன்றி, அன்பிலும் ஐக்கியத்திலும் வளர்ந்து, சமுதாயத்திற்கு நற்செய்தியை அறிவிக்கும் நோக்கத்துடன் இயங்கி வருகிறது. ஒவ்வொரு வாரமும் நடைபெறும் ஆராதனைகள், ஜெபக் கூட்டங்கள் மற்றும் சிறப்பு ஊழியங்கள் மூலம் பல குடும்பங்கள் தேவனுடைய ஆசீர்வாதத்தைப் பெற்று வருகின்றனர்.
              </p>
            </div>

            {/* Leadership Spotlight: Chief Pastor & Catechist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 p-3 shadow-sm hover:shadow-md transition-all">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-gold shadow-sm bg-slate-100">
                  <Image
                    src={churchInfo.pastorImage}
                    alt={churchInfo.pastorName}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black text-amber-900 uppercase block">தலைமை போதகர்</span>
                  <p className="text-xs font-bold text-navy-900 truncate">{churchInfo.pastorName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 p-3 shadow-sm hover:shadow-md transition-all">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-royal shadow-sm bg-slate-100">
                  <Image
                    src={churchInfo.catechistImage}
                    alt={churchInfo.catechistName}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black text-royal uppercase block">சபை ஊழியர் (Catechist)</span>
                  <p className="text-xs font-bold text-navy-900 truncate">{churchInfo.catechistName}</p>
                </div>
              </div>
            </div>

            {/* 3 Vibrant Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-2xl border border-crimson/15 bg-crimson/5 p-3.5 text-center transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-crimson text-white shadow-sm">
                  <Church size={18} />
                </div>
                <h4 className="mt-2 text-xs font-bold text-navy-900">ஆராதனை</h4>
                <p className="mt-0.5 text-[11px] text-slate-500">உண்மையோடும் ஆவியோடும்</p>
              </div>

              <div className="rounded-2xl border border-gold/20 bg-gold/10 p-3.5 text-center transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gold text-navy-950 shadow-sm">
                  <BookOpen size={18} />
                </div>
                <h4 className="mt-2 text-xs font-bold text-navy-900">வேத சத்தியம்</h4>
                <p className="mt-0.5 text-[11px] text-slate-500">ஆவிக்குரிய வளர்ச்சி</p>
              </div>

              <div className="rounded-2xl border border-royal/15 bg-royal/5 p-3.5 text-center transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-royal text-white shadow-sm">
                  <Heart size={18} />
                </div>
                <h4 className="mt-2 text-xs font-bold text-navy-900">அன்பின் சேவை</h4>
                <p className="mt-0.5 text-[11px] text-slate-500">சமூக நலம் & ஐக்கியம்</p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Link href="/about" className="btn-primary">
                எங்களை பற்றி மேலும் அறிய
                <ArrowRight size={16} />
              </Link>
              <Link href="/about#history" className="font-bold text-sm text-navy-900 hover:text-crimson transition-colors">
                எங்கள் வரலாறு →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
