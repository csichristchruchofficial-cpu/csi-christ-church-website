import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "தொடர்புக்கு",
  description: "எங்கள் திருச்சபையைத் தொடர்பு கொள்ளுங்கள்.",
};

export default function ContactPage() {
  return (
    <div className="pt-8">
      <ContactSection />
    </div>
  );
}
