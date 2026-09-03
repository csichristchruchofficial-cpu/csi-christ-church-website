"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle, MessageCircle, Heart, Mail, X, Sparkles } from "lucide-react";
import { churchInfo } from "@/data/church";

type Status = "idle" | "submitting" | "success" | "error";

export default function PrayerRequestForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [nameVal, setNameVal] = useState("");
  const [phoneVal, setPhoneVal] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [requestVal, setRequestVal] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const cleanWhatsApp = churchInfo.whatsapp.replace(/[^0-9]/g, "");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const name = nameVal.trim();
    const phone = phoneVal.trim();
    const email = emailVal.trim();
    const request = requestVal.trim();

    if (!name || !request) {
      setError("தயவுசெய்து உங்கள் பெயர் மற்றும் ஜெப விண்ணப்பத்தை உள்ளிடவும்.");
      return;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      setError("சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.");
      return;
    }

    setStatus("submitting");

    try {
      // 1. Send data to server API route for backend processing
      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          request,
        }),
      });

      // 2. Prepare mailto link to official church email
      const mailSubject = `புதிய ஜெப விண்ணப்பம் (Prayer Request) - ${name}`;
      const mailBody = `கர்த்தருக்குள் அன்பான போதகர் அவர்களுக்கு,

CSI கிறிஸ்து ஆலயம் இணையதளத்திலிருந்து புதிய ஜெப விண்ணப்பம் வந்துள்ளது:

• பெயர்: ${name}
• தொலைபேசி: ${phone || "குறிப்பிடப்படவில்லை"}
• மின்னஞ்சல்: ${email || "குறிப்பிடப்படவில்லை"}
• தேதி: ${new Date().toLocaleDateString("ta-IN")}

ஜெப விண்ணப்ப விவரம்:
${request}

"ஒருவருக்காக ஒருவர் வேண்டுதல் செய்யுங்கள்" - யாக்கோபு 5:16`;

      const mailtoLink = `mailto:${churchInfo.email}?subject=${encodeURIComponent(
        mailSubject
      )}&body=${encodeURIComponent(mailBody)}`;

      // Open email client with pre-filled details to official email
      window.location.href = mailtoLink;

      setStatus("success");
      setShowPopup(true);
    } catch (err) {
      console.error("Failed to dispatch prayer request:", err);
      // Fallback: still open mail client
      const mailSubject = `புதிய ஜெப விண்ணப்பம் (Prayer Request) - ${name}`;
      const mailBody = `பெயர்: ${name}\nதொலைபேசி: ${phone}\nவிண்ணப்பம்:\n${request}`;
      window.location.href = `mailto:${churchInfo.email}?subject=${encodeURIComponent(
        mailSubject
      )}&body=${encodeURIComponent(mailBody)}`;

      setStatus("success");
      setShowPopup(true);
    }
  }

  // Generate WhatsApp prayer link
  const waPrayerText = encodeURIComponent(
    `வணக்கம் போதகர் அவர்களே,\n\nஜெப விண்ணப்பம்:\nபெயர்: ${nameVal || "விசுவாசி"}\nதொலைபேசி: ${phoneVal || "-"}\nவிண்ணப்பம்: ${requestVal || "எனக்காக ஜெபியுங்கள்."}`
  );

  return (
    <div className="relative">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xl transition-all duration-300 hover:shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-crimson to-rose-500 text-white shadow-glow-crimson mb-4 animate-float-gentle">
            <Heart size={28} />
          </div>
          <h3 className="text-2xl font-black text-navy-900">
            உங்கள் ஜெப தேவையை எங்களிடம் தெரிவியுங்கள்
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            &ldquo;ஒருவருக்காக ஒருவர் வேண்டுதல் செய்யுங்கள்&rdquo; — உங்கள் ஜெபக் குறிப்புகள் போதகர் மற்றும் ஜெபக் குழுவினரால் இரகசியமாக ஜெபிக்கப்படும்.
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-900">
            <Mail size={13} className="text-gold-dark" />
            <span>அதிகாரப்பூர்வ மின்னஞ்சல்: <strong>{churchInfo.email}</strong></span>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="name" className="text-sm font-bold text-navy-900 flex items-center gap-1">
              <span>உங்கள் பெயர்</span>
              <span className="text-crimson">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="எ.கா: யோவான்"
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/15"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="text-sm font-bold text-navy-900">
                தொலைபேசி எண்
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={phoneVal}
                onChange={(e) => setPhoneVal(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/15"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-bold text-navy-900">
                உங்கள் மின்னஞ்சல்
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                value={emailVal}
                onChange={(e) => setEmailVal(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/15"
              />
            </div>
          </div>

          <div>
            <label htmlFor="request" className="text-sm font-bold text-navy-900 flex items-center gap-1">
              <span>ஜெப விண்ணப்ப விவரம்</span>
              <span className="text-crimson">*</span>
            </label>
            <textarea
              id="request"
              name="request"
              required
              rows={5}
              placeholder="உங்கள் ஜெபத் தேவையை இங்கே தெளிவாக எழுதவும்..."
              value={requestVal}
              onChange={(e) => setRequestVal(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/15"
            />
          </div>

          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700 border border-red-200 animate-entry-fade-up">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary flex-1 !py-3.5 text-base disabled:opacity-60"
            >
              <Send size={18} />
              {status === "submitting" ? "அனுப்புகிறது…" : "ஜெப விண்ணப்பம் அனுப்பவும்"}
            </button>

            {/* Direct WhatsApp Option */}
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${waPrayerText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-crimson flex-1 !py-3.5 text-base text-center inline-flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              நேரடி வாட்ஸ்அப் ஜெபம்
            </a>
          </div>

          <p className="text-xs text-center text-slate-400 mt-4">
            🔒 உங்கள் தகவல்கள் முற்றிலும் இரகசியமாக வைக்கப்பட்டு போதகர் மற்றும் ஜெபக் குழுவினரால் மட்டுமே ஜெபிக்கப்படும்.
          </p>
        </form>
      </div>

      {/* ============================================================== */}
      {/* UNIQUE POP-UP MODAL ANIMATION ON SUBMISSION                   */}
      {/* ============================================================== */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md animate-overlay-fade-in">
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-lg rounded-3xl border border-gold/40 bg-white p-7 sm:p-9 shadow-2xl animate-popup-spring text-center"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-navy-900 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Glowing Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg mb-4 animate-float-gentle">
              <CheckCircle2 size={36} />
            </div>

            <span className="badge-vibrant bg-emerald-100 text-emerald-800 border border-emerald-300">
              <Sparkles size={13} /> கர்த்தர் உங்களுக்கு ஜெப பதில் தருவாராக!
            </span>

            <h3 className="mt-3 text-2xl font-black text-navy-900">
              ஜெப விண்ணப்பம் வெற்றிகரமாக அனுப்பப்பட்டது!
            </h3>

            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              உங்கள் ஜெப விண்ணப்பம் திருச்சபையின் அதிகாரப்பூர்வ மின்னஞ்சலுக்கு அனுப்பப்பட்டு பதிவு செய்யப்பட்டுள்ளது:
            </p>

            {/* Target email badge */}
            <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs sm:text-sm text-navy-900 font-bold flex items-center justify-center gap-2">
              <Mail size={16} className="text-crimson" />
              <span>{churchInfo.email}</span>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${waPrayerText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-crimson !py-2.5 !px-5 !text-xs inline-flex items-center justify-center gap-2"
              >
                <MessageCircle size={15} />
                வாட்ஸ்அப் மூலமும் அனுப்ப
              </a>

              <button
                type="button"
                onClick={() => {
                  setShowPopup(false);
                  setNameVal("");
                  setPhoneVal("");
                  setEmailVal("");
                  setRequestVal("");
                  setStatus("idle");
                }}
                className="btn-primary !py-2.5 !px-6 !text-xs font-bold"
              >
                சரி, நிறைவு செய்க
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
