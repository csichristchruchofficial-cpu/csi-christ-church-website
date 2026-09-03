import Link from "next/link";
import { ArrowRight, Music, Heart, Flame, Users, BookOpen, Globe } from "lucide-react";

export type Ministry = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const ministryThemes: Record<
  string,
  { gradient: string; icon: any; badge: string; badgeColor: string }
> = {
  children: {
    gradient: "from-amber-400 via-orange-500 to-amber-600",
    icon: BookOpen,
    badge: "சிறுவர் & சிறுமியர்",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
  },
  youth: {
    gradient: "from-blue-600 via-indigo-600 to-purple-600",
    icon: Users,
    badge: "இளைஞர் ஐக்கியம்",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
  },
  women: {
    gradient: "from-rose-500 via-pink-500 to-crimson",
    icon: Heart,
    badge: "பெண்கள் சங்கம்",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
  },
  prayer: {
    gradient: "from-purple-600 via-violet-700 to-indigo-900",
    icon: Flame,
    badge: "ஜெப ஐக்கியம்",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
  },
  worship: {
    gradient: "from-cyan-500 via-teal-600 to-royal",
    icon: Music,
    badge: "பாடகர் குழு",
    badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-300",
  },
  outreach: {
    gradient: "from-emerald-500 via-teal-600 to-green-700",
    icon: Globe,
    badge: "சுவிசேஷ பணி",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
};

export default function MinistryCard({ ministry }: { ministry: Ministry }) {
  const theme = ministryThemes[ministry.id] || {
    gradient: "from-royal via-navy-800 to-crimson",
    icon: Users,
    badge: "ஊழியம்",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
  };
  const Icon = theme.icon;

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover">
      {/* Colorful Gradient Header Banner */}
      <div className={`relative h-44 w-full bg-gradient-to-br ${theme.gradient} p-6 flex flex-col justify-between text-white overflow-hidden`}>
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:14px_14px]" />
        
        <div className="relative z-10 flex items-center justify-between">
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${theme.badgeColor} shadow-sm backdrop-blur-md`}>
            {theme.badge}
          </span>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner group-hover:scale-110 transition-transform">
            <Icon size={22} />
          </div>
        </div>

        <div className="relative z-10">
          <h3 className="text-xl font-extrabold drop-shadow">
            {ministry.title}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <p className="text-sm leading-relaxed text-slate-600">
          {ministry.description}
        </p>
        <div className="mt-6 pt-4 border-t border-slate-100">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-900 group-hover:text-crimson transition-colors"
          >
            இணைந்து செயல்பட <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
