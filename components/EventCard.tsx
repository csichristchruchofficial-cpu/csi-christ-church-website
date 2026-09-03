import Link from "next/link";
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react";
import { churchInfo } from "@/data/church";

export type ChurchEvent = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
};

export default function EventCard({ event }: { event: ChurchEvent }) {
  const dateText =
    event.date && !event.date.includes("[")
      ? event.date
      : "வரவிருக்கும் நிகழ்வு";

  const timeText =
    event.time && !event.time.includes("[")
      ? event.time
      : "நேரம் விரைவில் அறிவிக்கப்படும்";

  const locationText =
    event.location && !event.location.includes("[")
      ? event.location
      : "CSI கிறிஸ்து ஆலயம், கல்லிடைக்குறிச்சி";

  const descriptionText =
    event.description && !event.description.includes("இங்கே")
      ? event.description
      : "சிறப்பு ஆராதனை மற்றும் ஐக்கியக் கூட்டம். அனைவரும் குடும்பமாக வந்து தேவ ஆசீர்வாதத்தைப் பெற்றுக்கொள்ளுங்கள்.";

  return (
    <article className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover hover:border-gold/40">
      <div>
        {/* Colorful Header Tag */}
        <div className="flex items-center justify-between">
          <span className="badge-vibrant bg-crimson/10 text-crimson border border-crimson/20">
            <CalendarDays size={13} />
            <span>நிகழ்வு</span>
          </span>
          <span className="text-xs font-bold text-gold-dark">
            {dateText}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-bold text-navy-900 transition-colors group-hover:text-royal">
          {event.name}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {descriptionText}
        </p>

        <dl className="mt-5 space-y-2.5 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-700">
          <div className="flex items-center gap-2.5">
            <Clock size={15} className="text-gold shrink-0" />
            <span className="font-medium">{timeText}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin size={15} className="text-crimson shrink-0" />
            <span className="font-medium truncate">{locationText}</span>
          </div>
        </dl>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <Link
          href={`https://wa.me/${churchInfo.whatsapp.replace(/[^0-9]/g, "")}?text=வணக்கம், ${encodeURIComponent(event.name)} பற்றிய தகவல் அறிய விரும்புகிறேன்.`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary !py-2 !px-4 !text-xs"
        >
          வாட்ஸ்அப்பில் விசாரிக்க
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-navy-900"
        >
          விவரங்கள் <ArrowRight size={13} />
        </Link>
      </div>
    </article>
  );
}
