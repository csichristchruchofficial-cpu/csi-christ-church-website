import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { churchInfo } from "@/data/church";
import { Sparkles, Calendar, ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

type HeroProps = {
  children?: ReactNode;
};

// Calculates the upcoming Sunday date and corresponding Order of Service
function getUpcomingSundayOrder() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 1 = Mon, ...
  const diffToSunday = day === 0 ? 0 : 7 - day;
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + diffToSunday);

  const dateNum = sunday.getDate();
  const weekNum = Math.min(5, Math.ceil(dateNum / 7));

  const orders: Record<number, { titleTa: string; titleEn: string }> = {
    1: {
      titleTa: "திருவிருந்து ஆராதனை",
      titleEn: "Communion Service",
    },
    2: {
      titleTa: "வழக்கமான தேவ ஆராதனை",
      titleEn: "Regular Service",
    },
    3: {
      titleTa: "திருவிருந்து ஆராதனை (ஆங்கிலிக்கன் முறை)",
      titleEn: "Anglican Order Communion",
    },
    4: {
      titleTa: "துதி மற்றும் ஆராதனை",
      titleEn: "Worship Service",
    },
    5: {
      titleTa: "வழக்கமான தேவ ஆராதனை",
      titleEn: "Regular Service",
    },
  };

  const monthNamesTa = [
    "ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்",
    "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"
  ];
  const dateStr = `${sunday.getDate()} ${monthNamesTa[sunday.getMonth()]}`;

  return {
    isTodaySunday: day === 0,
    dateStr,
    weekNum,
    order: orders[weekNum] || orders[2],
  };
}

export default function Hero({ children }: HeroProps) {
  const sundayInfo = getUpcomingSundayOrder();

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-navy-950">
      {/* Background Church Photo */}
      <div className="absolute inset-0">
        <Image
          src="/images/church-hero.jpg"
          alt="CSI Christ Church Kallidaikurichi"
          fill
          priority
          className="object-cover object-center transform scale-105 transition-transform duration-1000"
        />
      </div>

      {/* Vibrant Multilayer Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/65 to-navy-950/50" />
      <div className="absolute inset-0 bg-radial-at-c from-transparent via-royal-dark/30 to-navy-950/80 mix-blend-multiply" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="container-page relative z-10 py-16 sm:py-20 text-center">
        {/* Colorful Floating Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-navy-900/80 px-4 py-1.5 shadow-lg backdrop-blur-md animate-float-gentle">
          <Sparkles className="h-4 w-4 text-gold-light" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-gold-light">
            கிறிஸ்துவின் அன்பில் ஒன்றிணைவோம்
          </span>
        </div>

        {/* Church Name & Welcome with Entry Fade-Up */}
        <div className="animate-entry-fade-up">
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-md">
            <span className="notranslate" translate="no">WELCOME TO</span>
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-amber-400">
              <span className="church-name-ta-source">{churchInfo.name}</span>
              <span className="church-name-en-override notranslate" translate="no">
                {churchInfo.nameEnglish}
              </span>
            </span>
          </h1>

          {/* English Name & Location Pill */}
          <p
            className="mx-auto mt-4 inline-block rounded-full bg-white/10 px-5 py-1 text-sm sm:text-base font-semibold text-white/90 backdrop-blur-md border border-white/15 notranslate"
            translate="no"
          >
            {churchInfo.nameEnglish} • Kallidaikurichi
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="btn-primary w-full sm:w-auto text-base">
              <span className="church-name-ta-source">எங்களுடன் இணையுங்கள்</span>
              <span className="church-name-en-override notranslate" translate="no">
                Join Us
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/sermons" className="btn-outline w-full sm:w-auto text-base">
              <span className="church-name-ta-source">பிரசங்கங்களைக் கேளுங்கள்</span>
              <span className="church-name-en-override notranslate" translate="no">
                Watch Sermons
              </span>
            </Link>
            <Link href="/prayer" className="btn-crimson w-full sm:w-auto text-base">
              <span className="church-name-ta-source">ஜெப விண்ணப்பம்</span>
              <span className="church-name-en-override notranslate" translate="no">
                Prayer Request
              </span>
            </Link>
          </div>
        </div>

        {/* Order of Service Updates Banner (Replaces previous greeting card as requested) */}
        <ScrollReveal direction="pop" delay={250} className="mt-10 sm:mt-12">
          <Link
            href="#services"
            className="group block max-w-2xl mx-auto rounded-2xl bg-white/10 hover:bg-white/15 p-3.5 sm:p-4 backdrop-blur-md border border-white/15 hover:border-gold/50 shadow-lg transition-all"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold-light border border-gold/30">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      ஞாயிறு ஆராதனை: காலை 09:00 - 11:30
                    </span>
                    <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-gold-light border border-gold/30">
                      {sundayInfo.isTodaySunday ? "இன்று (Today)" : `அடுத்த ஞாயிறு (${sundayInfo.dateStr})`}
                    </span>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-slate-200 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-gold-light shrink-0" />
                    <span className="text-slate-300">ஆராதனை ஒழுங்கு (Order of Service):</span>
                    <strong className="text-gold-light underline decoration-gold/40 underline-offset-2 font-bold">
                      {sundayInfo.order.titleTa}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-gold-light group-hover:translate-x-1 transition-transform shrink-0">
                <span>விபரம் (Details)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        </ScrollReveal>

        {/* Live Church Updates */}
        {children}
      </div>
    </section>
  );
}
