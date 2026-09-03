import SectionHeading from "./SectionHeading";
import EventCard from "./EventCard";
import { events } from "@/data/church";

export default function EventsSection() {
  return (
    <section className="bg-gradient-to-b from-white via-slate-50 to-white py-20 sm:py-28 relative">
      <div className="container-page">
        <SectionHeading
          title="வரவிருக்கும் விசேஷ நிகழ்வுகள்"
          subtitle="திருச்சபையின் விசேஷ கூட்டங்கள் மற்றும் பண்டிகை ஆராதனைகள்"
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </div>
    </section>
  );
}
