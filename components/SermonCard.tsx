import Image from "next/image";
import { Play, Calendar, User, Clock, Radio } from "lucide-react";
import { churchInfo } from "@/data/church";

export type Sermon = {
  id: string;
  tag?: string;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  thumbnail: string;
  youtubeUrl: string;
  isLive?: boolean;
  badgeColor?: string;
};

export default function SermonCard({ sermon }: { sermon: Sermon }) {
  const targetUrl = sermon.youtubeUrl || churchInfo.social.youtube;

  const speakerDisplay =
    sermon.speaker && !sermon.speaker.includes("[")
      ? sermon.speaker
      : churchInfo.pastorName;

  const isLive = sermon.isLive || sermon.id === "live";

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover hover:border-gold/50 flex flex-col justify-between">
      {/* Thumbnail Container with Cover Image from YouTube */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        {sermon.thumbnail ? (
          <Image
            src={sermon.thumbnail}
            alt={sermon.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-navy-950 via-royal to-crimson-deep" />
        )}

        {/* Gradient Scrim for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-black/30 to-transparent" />

        {/* Tag / Category Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          {isLive ? (
            <span className="badge-vibrant bg-red-600 text-white shadow-glow-crimson animate-pulse flex items-center gap-1.5">
              <Radio size={12} className="animate-spin" />
              <span>நேரலை (Live)</span>
            </span>
          ) : (
            <span className={`badge-vibrant ${sermon.badgeColor || "bg-navy-950/90 text-gold-light border border-gold/40"} backdrop-blur-md`}>
              {sermon.tag || "ஆராதனை செய்தி"}
            </span>
          )}
        </div>

        {/* Duration Badge */}
        {sermon.duration && (
          <div className="absolute top-3 right-3 z-10">
            <span className="badge-vibrant bg-black/75 text-white backdrop-blur-md">
              <Clock size={11} className="text-gold" /> {sermon.duration}
            </span>
          </div>
        )}

        {/* Pulsing Play Button */}
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${sermon.title} காணொளியைப் பார்க்க`}
          className="absolute inset-0 z-20 flex items-center justify-center group/play"
        >
          <span className={`flex h-16 w-16 items-center justify-center rounded-full shadow-xl transition-all duration-300 group-hover/play:scale-110 ${
            isLive
              ? "bg-red-600 text-white shadow-glow-crimson group-hover/play:bg-red-500"
              : "bg-gold text-navy-950 shadow-glow-gold group-hover/play:bg-amber-400"
          }`}>
            <Play size={26} className="ml-1 fill-current" />
          </span>
        </a>
      </div>

      {/* Content Info */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-navy-900 transition-colors group-hover:text-crimson line-clamp-2 leading-snug">
            {sermon.title}
          </h3>

          <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <User size={14} className="text-royal shrink-0" />
              <span className="font-semibold text-slate-800">{speakerDisplay}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-crimson shrink-0" />
              <span>{sermon.date}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-sm font-bold transition-colors ${
              isLive ? "text-red-600 hover:text-red-700" : "text-crimson hover:text-crimson-dark"
            }`}
          >
            <Play size={14} /> {isLive ? "நேரலையில் இணைய →" : "யூடியூபில் பார்க்க →"}
          </a>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {isLive ? "Live Stream" : "YouTube"}
          </span>
        </div>
      </div>
    </article>
  );
}
