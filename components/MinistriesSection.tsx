import SectionHeading from "./SectionHeading";
import MinistryCard from "./MinistryCard";
import { ministries } from "@/data/church";

export default function MinistriesSection() {
  return (
    <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 sm:py-28 relative">
      <div className="container-page">
        <SectionHeading
          title="எங்கள் திருச்சபை ஊழியங்கள்"
          subtitle="சிறுவர்கள் முதல் பெரியவர்கள் வரை அனைவரும் விசுவாசத்திலும் அன்பிலும் வளர உதவும் ஐக்கியங்கள்"
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m) => (
            <MinistryCard key={m.id} ministry={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
