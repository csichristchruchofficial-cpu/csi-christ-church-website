import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import Gallery from "@/components/Gallery";

export const metadata: Metadata = {
  title: "புகைப்பட தொகுப்பு",
  description: "CSI கிறிஸ்து ஆலயம், கல்லிடைக்குறிச்சி - திருச்சபை ஆராதனைகள் மற்றும் நிகழ்வுகளின் புகைப்படத் தொகுப்பு.",
};

export default function GalleryPage() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">
      <div className="container-page">
        <SectionHeading
          title="புகைப்பட தொகுப்பு"
          subtitle="எங்கள் திருச்சபை ஆராதனைகள், ஊழியங்கள் மற்றும் விசேஷ நிகழ்வுகளின் தருணங்கள்"
        />
        <div className="mt-12">
          <Gallery />
        </div>
      </div>
    </section>
  );
}
