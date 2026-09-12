import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, Heart } from "lucide-react";
import { churchInfo, navLinks } from "@/data/church";

export default function Footer() {
  return (
    <footer className="relative bg-navy-950 text-slate-300">
      {/* Top Vibrant Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-crimson via-gold to-royal" />

      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Column 1: Church Identity */}
        <div>
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-0.5 shadow-md ring-2 ring-gold/60">
              <Image
                src={churchInfo.logo}
                alt={churchInfo.name}
                width={48}
                height={48}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="block text-base font-bold text-white leading-tight">
                <span className="church-name-ta-source">{churchInfo.name}</span>
                <span className="church-name-en-override notranslate" translate="no">
                  {churchInfo.nameEnglish}
                </span>
              </span>
              <span className="block text-[11px] font-bold text-gold-light uppercase tracking-wider notranslate" translate="no">
                {churchInfo.nameEnglish}
              </span>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            {churchInfo.tagline}. கல்லிடைக்குறிச்சியில் கர்த்தரின் அன்பையும், இரட்சிப்பின் சத்தியத்தையும் அறிவிக்கும் திருச்சபை.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={churchInfo.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-slate-300 transition-all hover:bg-red-600 hover:text-white hover:scale-110"
            >
              <Youtube size={20} />
            </a>
            <a
              href={churchInfo.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-slate-300 transition-all hover:bg-blue-600 hover:text-white hover:scale-110"
            >
              <Facebook size={20} />
            </a>
            <a
              href={churchInfo.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-slate-300 transition-all hover:bg-gradient-to-tr hover:from-amber-500 hover:to-pink-500 hover:text-white hover:scale-110"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gold-light">
            விரைவு இணைப்புகள்
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.slice(0, 6).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-gold hover:translate-x-1 inline-block"
                >
                  <span className="church-name-ta-source">{link.label}</span>
                  <span className="church-name-en-override notranslate" translate="no">
                    {link.labelEnglish}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Service Times */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gold-light">
            ஆராதனை நேரங்கள்
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-xl bg-white/5 p-3 border border-white/10">
              <span className="block font-bold text-white">ஞாயிறு ஆராதனை</span>
              <span className="text-gold-light text-xs font-semibold">காலை 09:00 - 11:30 மணி</span>
            </li>
            <li className="rounded-xl bg-white/5 p-3 border border-white/10">
              <span className="block font-bold text-white">செவ்வாய் சுகமளிக்கும் ஆராதனை</span>
              <span className="text-gold-light text-xs font-semibold">மாலை 7:00 - 8:00 மணி</span>
            </li>
            <li className="rounded-xl bg-white/5 p-3 border border-white/10">
              <span className="block font-bold text-white">வெள்ளி வேத தியானம்</span>
              <span className="text-cyan-300 text-xs font-semibold">மாலை 7:00 - 8:00 மணி</span>
            </li>
            <li className="rounded-xl bg-white/5 p-3 border border-white/10">
              <span className="block font-bold text-white">மாத உபவாச ஜெபம்</span>
              <span className="text-rose-300 text-xs font-semibold">மாதத்தின் 4-வது வாரம்</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Pastor */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gold-light">
            தொடர்புக்கு
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-crimson-light mt-1 shrink-0" />
              <span className="text-xs leading-relaxed">{churchInfo.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-gold shrink-0" />
              <a href={`tel:${churchInfo.phone}`} className="text-xs hover:text-white">
                {churchInfo.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-cyan-400 shrink-0" />
              <a href={`mailto:${churchInfo.email}`} className="text-xs truncate hover:text-white">
                {churchInfo.email}
              </a>
            </li>
          </ul>
          <div className="mt-5 rounded-xl bg-gold/10 p-3 border border-gold/20">
            <span className="block text-[11px] font-bold text-gold-light uppercase">போதகர்</span>
            <span className="block text-xs font-semibold text-white mt-0.5">{churchInfo.pastorName}</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6 text-center text-xs text-slate-400">
        <p>
          © 2026 <span className="notranslate" translate="no">{churchInfo.nameEnglish}</span>. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.
        </p>
      </div>
    </footer>
  );
}
