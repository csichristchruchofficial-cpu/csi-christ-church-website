import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import PrayerRequestForm from "@/components/PrayerRequestForm";

export const metadata: Metadata = {
  title: "ஜெப விண்ணப்பம்",
  description: "CSI கிறிஸ்து ஆலயம், கல்லிடைக்குறிச்சி - உங்கள் ஜெப விண்ணப்பங்களை எங்களுடன் பகிர்ந்து கொள்ளுங்கள். நாங்கள் உங்களுக்காக ஜெபிக்கிறோம்.",
};

export default function PrayerPage() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">
      <div className="container-page">
        <SectionHeading
          title="ஜெப விண்ணப்பம்"
          subtitle="விசுவாசமுள்ள ஜெபம் பிணியாளியை இரட்சிக்கும் — உங்கள் ஜெபத் தேவைகளை நம்பிக்கையுடன் பகிர்ந்துகொள்ளுங்கள்"
        />
        <div className="mt-12">
          <PrayerRequestForm />
        </div>
      </div>
    </section>
  );
}
