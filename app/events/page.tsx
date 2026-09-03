import type { Metadata } from "next";
import EventsSection from "@/components/EventsSection";

export const metadata: Metadata = {
  title: "நிகழ்வுகள்",
  description: "எங்கள் திருச்சபையின் வரவிருக்கும் நிகழ்வுகள்.",
};

export default function EventsPage() {
  return (
    <div className="pt-8">
      <EventsSection />
    </div>
  );
}
