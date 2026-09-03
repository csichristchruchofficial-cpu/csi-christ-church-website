import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import SermonCard from "@/components/SermonCard";
import { sermons, churchInfo } from "@/data/church";
import { Youtube } from "lucide-react";

export const metadata: Metadata = {
  title: "பிரசங்கங்கள்",
  description: "CSI கிறிஸ்து ஆலயம், கல்லிடைக்குறிச்சி - சமீபத்திய ஆராதனை பிரசங்கங்கள் மற்றும் ஆவிக்குரிய செய்திகள்.",
};

export default function SermonsPage() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">
      <div className="container-page">
        <SectionHeading
          title="அனைத்து பிரசங்கங்கள்"
          subtitle="வேத வசன போதனைகள், ஞாயிறு ஆராதனை செய்திகள் மற்றும் ஆவிக்குரிய தியானங்கள்"
        />

        {/* YouTube Channel Promo Banner */}
        <div className="mt-10 rounded-3xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-rose-50 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-glow-crimson">
              <Youtube size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-900">
                எங்கள் அதிகாரப்பூர்வ யூடியூப் சேனல்
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                நேரலை ஆராதனை, பாடல்கள் மற்றும் புதிய செய்திகளை உடனுக்குடன் பார்க்க சப்ஸ்கிரைப் செய்யுங்கள்.
              </p>
            </div>
          </div>
          <a
            href={churchInfo.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-crimson shrink-0 !py-2.5 !px-5 text-sm"
          >
            இப்போதே பார்க்கவும்
          </a>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sermons.map((s) => (
            <SermonCard key={s.id} sermon={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
