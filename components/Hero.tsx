import Link from "next/link";
import Image from "next/image";
import { churchInfo } from "@/data/church";
import { Sparkles, Calendar, HeartHandshake, ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function Hero() {
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

      <div className="container-page relative z-10 py-20 text-center">
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
            WELCOME To
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-amber-400">
              {churchInfo.name}
            </span>
          </h1>

          {/* English Name & Location Pill */}
          <p className="mx-auto mt-4 inline-block rounded-full bg-white/10 px-5 py-1 text-sm sm:text-base font-semibold text-white/90 backdrop-blur-md border border-white/15">
            {churchInfo.nameEnglish} • கல்லிடைக்குறிச்சி
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="btn-primary w-full sm:w-auto text-base">
              எங்களுடன் இணையுங்கள்
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/sermons" className="btn-outline w-full sm:w-auto text-base">
              பிரசங்கங்களைக் கேளுங்கள்
            </Link>
            <Link href="/prayer" className="btn-crimson w-full sm:w-auto text-base">
              ஜெப விண்ணப்பம்
            </Link>
          </div>
        </div>

        {/* Highlights Bar with Pop Scroll Reveal */}
        <ScrollReveal direction="pop" delay={250} className="mt-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <div className="flex items-center justify-center gap-3 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/15 text-white shadow-sm hover:border-gold/40 transition-colors">
              <Calendar className="h-5 w-5 text-gold-light" />
              <span className="text-sm font-semibold">ஞாயிறு ஆராதனை: காலை 09:00 - 11:30</span>
            </div>
            <div className="flex items-center justify-center gap-3 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/15 text-white shadow-sm hover:border-crimson/40 transition-colors">
              <HeartHandshake className="h-5 w-5 text-crimson-light" />
              <span className="text-sm font-semibold">அனைவரையும் அன்புடன் அழைக்கிறோம்</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
