import Image from "next/image";
import { MapPin, Phone, Mail, MessageCircle, UserCheck, ExternalLink } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { churchInfo } from "@/data/church";

export default function ContactSection() {
  const mapEmbed =
    churchInfo.googleMapsEmbedUrl && !churchInfo.googleMapsEmbedUrl.includes("q=&")
      ? churchInfo.googleMapsEmbedUrl
      : "https://maps.google.com/maps?q=CSI+Christ+Church+Kallidaikurichi+Tamil+Nadu&t=&z=15&ie=UTF8&iwloc=&output=embed";

  const cleanWhatsApp = churchInfo.whatsapp.replace(/[^0-9]/g, "");

  return (
    <section className="bg-gradient-to-b from-slate-50 via-white to-slate-100 py-20 sm:py-28 relative">
      <div className="container-page">
        <SectionHeading
          title="எங்களைச் சந்தியுங்கள் • தொடர்பு கொள்ளுங்கள்"
          subtitle="எங்கள் திருச்சபை குடும்பத்தில் இணைய அல்லது ஜெப உதவி பெற எங்களை எப்போதும் தொடர்பு கொள்ளலாம்"
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Leadership Cards: Chief Pastor & Catechist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Chief Pastor Card */}
              <div className="rounded-2xl border border-gold/40 bg-gradient-to-br from-amber-50/80 via-white to-white p-4 shadow-sm flex items-center gap-3.5 hover:shadow-md transition-all">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-gold shadow-sm bg-slate-100">
                  <Image
                    src={churchInfo.pastorImage}
                    alt={churchInfo.pastorName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                    தலைமை போதகர்
                  </span>
                  <p className="text-sm font-black text-navy-900 leading-snug line-clamp-2">
                    {churchInfo.pastorName}
                  </p>
                </div>
              </div>

              {/* Catechist Card */}
              <div className="rounded-2xl border border-royal/30 bg-gradient-to-br from-blue-50/80 via-white to-white p-4 shadow-sm flex items-center gap-3.5 hover:shadow-md transition-all">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-royal shadow-sm bg-slate-100">
                  <Image
                    src={churchInfo.catechistImage}
                    alt={churchInfo.catechistName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-royal block">
                    சபை ஊழியர் (Catechist)
                  </span>
                  <p className="text-sm font-black text-navy-900 leading-snug line-clamp-2">
                    {churchInfo.catechistName}
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-gold/40">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <MapPin size={22} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  முகவரி
                </span>
                <p className="text-sm font-semibold text-navy-900 mt-0.5">
                  {churchInfo.address}
                </p>
              </div>
            </div>

            {/* Phone */}
            <a
              href={`tel:${churchInfo.phone}`}
              className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-royal/50 hover:bg-royal/5 group"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-royal group-hover:bg-royal group-hover:text-white transition-colors">
                <Phone size={22} />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  தொலைபேசி
                </span>
                <p className="text-sm font-bold text-navy-900 mt-0.5 group-hover:text-royal">
                  {churchInfo.phone}
                </p>
              </div>
              <span className="text-xs font-semibold text-royal">அழைக்க →</span>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=வணக்கம்%2C+CSI+கிறிஸ்து+ஆலயம்`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm transition-all hover:bg-emerald-100/50 group"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white group-hover:scale-105 transition-transform">
                <MessageCircle size={22} />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  வாட்ஸ்அப் (WhatsApp)
                </span>
                <p className="text-sm font-bold text-emerald-950 mt-0.5">
                  {churchInfo.whatsapp}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700">செய்தி அனுப்ப →</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${churchInfo.email}`}
              className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-crimson/50 hover:bg-crimson/5 group"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-crimson group-hover:bg-crimson group-hover:text-white transition-colors">
                <Mail size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  மின்னஞ்சல்
                </span>
                <p className="text-sm font-bold text-navy-900 mt-0.5 truncate group-hover:text-crimson">
                  {churchInfo.email}
                </p>
              </div>
            </a>
          </div>

          {/* Map Frame */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-xl">
              <div className="bg-navy-900 px-6 py-3 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-crimson-light" />
                  <span className="text-xs font-bold">Google Maps — வழிகாட்டி</span>
                </div>
                <a
                  href="https://maps.google.com/?q=CSI+Christ+Church+Kallidaikurichi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-gold-light hover:underline font-semibold"
                >
                  பெரிதாக்கி பார்க்க <ExternalLink size={12} />
                </a>
              </div>
              <div className="aspect-[16/10] sm:aspect-[16/9] w-full">
                <iframe
                  title="Google Maps Location - CSI Christ Church Kallidaikurichi"
                  src={mapEmbed}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
