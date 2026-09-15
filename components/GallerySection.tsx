import Link from "next/link";
import SectionHeading from "./SectionHeading";
import Gallery from "./Gallery";
import ScrollReveal from "./ScrollReveal";
import { ArrowRight, Images } from "lucide-react";

export default function GallerySection() {
  return (
    <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 sm:py-28 relative overflow-hidden">
      <div className="container-page">
        <ScrollReveal direction="down">
          <SectionHeading
            title="புகைப்பட தொகுப்பு"
            subtitle="எங்கள் திருச்சபை ஆராதனைகள், ஊழியங்கள் மற்றும் விசேஷ நிகழ்வுகளின் அழகிய தருணங்கள்"
          />
        </ScrollReveal>

        <div className="mt-12">
          <Gallery hideHeader />
        </div>

        <ScrollReveal delay={200} direction="up">
          <div className="mt-14 text-center">
            <Link
              href="/gallery"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Images size={18} />
              <span>முழு புகைப்பட தொகுப்பைக் காண (View Full Gallery)</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
