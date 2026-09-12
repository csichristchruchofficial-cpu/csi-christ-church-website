"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  Info,
  Church,
  Heart,
  Video,
  Calendar,
  Image as ImageIcon,
  HandHeart,
  PhoneCall,
  MessageCircle,
  Clock,
  Phone,
} from "lucide-react";
import { navLinks, churchInfo } from "@/data/church";

// Map each route to a colorful, high-contrast icon
const navIcons: Record<string, JSX.Element> = {
  "/": <Home size={18} className="text-gold-light" />,
  "/about": <Info size={18} className="text-cyan-400" />,
  "/sub-churches": <Church size={18} className="text-amber-400" />,
  "/ministries": <Heart size={18} className="text-rose-400" />,
  "/sermons": <Video size={18} className="text-red-400" />,
  "/events": <Calendar size={18} className="text-emerald-400" />,
  "/gallery": <ImageIcon size={18} className="text-sky-400" />,
  "/prayer": <HandHeart size={18} className="text-pink-400" />,
  "/contact": <PhoneCall size={18} className="text-gold" />,
};

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const cleanWhatsApp = churchInfo.whatsapp.replace(/[^0-9]/g, "");

  return (
    <div className="lg:hidden">
      {/* High-Contrast Mobile Menu Button */}
      <button
        type="button"
        aria-label={open ? "மெனுவை மூடு" : "மெனுவைத் திற"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-2xl bg-navy-950 px-3.5 py-2 text-white border-2 border-gold shadow-md shadow-gold/25 hover:bg-royal transition-all active:scale-95 ring-2 ring-gold/40"
      >
        {open ? (
          <X size={20} className="text-gold font-bold" />
        ) : (
          <Menu size={20} className="text-gold font-bold" />
        )}
        <span className="text-xs font-black tracking-wide text-gold-light uppercase">
          {open ? "மூடு" : "மெனு"}
        </span>
      </button>

      {/* Full-Screen High-Contrast Mobile Drawer */}
      {open && (
        <div className="fixed inset-x-0 top-[72px] bottom-0 z-50 overflow-y-auto bg-gradient-to-b from-navy-950 via-slate-900 to-navy-950 text-white p-5 shadow-2xl border-t-2 border-gold animate-overlay-fade-in">
          {/* Quick Worship Timing Callout */}
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white/10 border border-gold/40 p-3 text-xs text-slate-200 backdrop-blur-md">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold text-navy-950 font-black shadow">
              <Clock size={18} />
            </div>
            <div>
              <span className="block font-black text-gold-light">ஞாயிறு ஆராதனை</span>
              <span className="text-slate-300 font-semibold text-[11px]">காலை 09:00 - 11:30 AM</span>
            </div>
          </div>

          {/* Navigation Links with High-Contrast Icons and Cards */}
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/15 hover:border-gold hover:text-gold-light active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  {navIcons[link.href] || <Church size={18} className="text-gold" />}
                  <span className="church-name-ta-source">{link.label}</span>
                  <span className="church-name-en-override notranslate" translate="no">
                    {link.labelEnglish}
                  </span>
                </div>
                <span className="text-xs text-gold font-black">›</span>
              </Link>
            ))}
          </nav>

          {/* Action & Contact Buttons inside Mobile Menu */}
          <div className="mt-6 pt-5 border-t border-white/15 space-y-3">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn-primary w-full !py-3 text-sm font-black text-center shadow-lg shadow-gold/30"
            >
              எங்களுடன் இணையுங்கள் (Join Us)
            </Link>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <a
                href={`tel:${churchInfo.phone}`}
                className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 border border-white/20 py-2.5 text-xs font-bold text-white hover:bg-gold hover:text-navy-950 transition-colors"
              >
                <Phone size={14} className="text-gold" />
                <span>அழைக்க</span>
              </a>

              <a
                href={`https://wa.me/${cleanWhatsApp}?text=வணக்கம்%2C+CSI+கிறிஸ்து+ஆலயம்`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 border border-emerald-500 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm"
              >
                <MessageCircle size={14} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
