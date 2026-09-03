import Link from "next/link";
import SectionHeading from "./SectionHeading";
import SermonCard from "./SermonCard";
import ScrollReveal from "./ScrollReveal";
import { sermons, churchInfo } from "@/data/church";
import { Youtube, ArrowRight } from "lucide-react";

export default function SermonsSection() {
  return (
    <section className="bg-gradient-to-b from-white via-slate-50 to-white py-20 sm:py-28 relative overflow-hidden">
      <div className="container-page">
        <ScrollReveal direction="down">
          <SectionHeading
            title="சமீபத்திய பிரசங்கங்கள் & செய்திகள்"
            subtitle="தேவனுடைய ஜீவனுள்ள வார்த்தையைக் கேட்டு ஆவிக்குரிய வாழ்வில் பலப்படுங்கள்"
          />
        </ScrollReveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sermons.map((s, idx) => (
            <ScrollReveal key={s.id} delay={idx * 150} direction="up">
              <SermonCard sermon={s} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={300} direction="up">
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <Link href="/sermons" className="btn-primary w-full sm:w-auto">
              அனைத்து பிரசங்கங்களையும் பார்க்க
              <ArrowRight size={16} />
            </Link>
            <a
              href={churchInfo.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-crimson w-full sm:w-auto inline-flex items-center justify-center gap-2"
            >
              <Youtube size={18} />
              யூடியூப் சேனல் சப்ஸ்கிரைப்
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
