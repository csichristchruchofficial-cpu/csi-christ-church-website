"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, BellRing, Check, Loader2, Sparkles } from "lucide-react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const DEFAULT_VAPID_PUBLIC_KEY =
  "BBZwHUayMFbFZt0CVXxHGAedTyasB_fJmGIMIxC3VE3aQYpG-ilXlGBG0WEg1B4sDMPv5SEOTzhk6WaZJgaCUA4";

type PushPromptProps = {
  variant?: "pill" | "button" | "card" | "header";
  className?: string;
};

export default function PushNotificationPrompt({
  variant = "pill",
  className = "",
}: PushPromptProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window
    ) {
      setIsSupported(true);
      setPermission(Notification.permission);

      // Check if already subscribed in service worker
      navigator.serviceWorker.ready
        .then((registration) => registration.pushManager.getSubscription())
        .then((subscription) => {
          setIsSubscribed(Boolean(subscription));
        })
        .catch(() => {});
    }
  }, []);

  async function handleSubscribe() {
    if (!isSupported) {
      setFeedback("உங்கள் உலாவியில் அறிவிப்புகள் ஆதரிக்கப்படவில்லை (Notifications not supported in this browser).");
      setTimeout(() => setFeedback(null), 4000);
      return;
    }
    setIsLoading(true);
    setFeedback(null);

    try {
      // 1. Request Notification permission
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        setFeedback("அறிவிப்பு அனுமதி மறுக்கப்பட்டது (Permission Denied). Browser settings-ல் அனுமதிக்கவும்.");
        setTimeout(() => setFeedback(null), 5000);
        setIsLoading(false);
        return;
      }

      // 2. Register Service Worker
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // 3. Show immediate welcome notification directly on device
      try {
        await registration.showNotification("CSI கிறிஸ்து ஆலயம் • கல்லிடைக்குறிச்சி", {
          body: "🔔 அறிவிப்புகள் வெற்றிகரமாக இணைக்கப்பட்டன! (Notifications Active)",
          icon: "/images/church-logo.png",
          badge: "/images/church-logo.png",
          vibrate: [100, 50, 100],
          tag: "welcome-alert",
        } as any);
      } catch {
        try {
          new Notification("CSI கிறிஸ்து ஆலயம் • கல்லிடைக்குறிச்சி", {
            body: "🔔 அறிவிப்புகள் வெற்றிகரமாக இணைக்கப்பட்டன! (Notifications Active)",
            icon: "/images/church-logo.png",
          });
        } catch {}
      }

      // 4. Subscribe to Push Manager
      const vapidKey =
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || DEFAULT_VAPID_PUBLIC_KEY;
      const convertedVapidKey = urlBase64ToUint8Array(vapidKey);

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
      }

      // 5. Send subscription to server
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent,
        }),
      }).catch((err) => {
        console.warn("Could not save push subscription to server:", err);
      });

      setIsSubscribed(true);
      setFeedback("🎉 அறிவிப்புகள் வெற்றிகரமாக இணைக்கப்பட்டன! (Alerts Active)");
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback(err?.message || "அறிவிப்புகளை இணைக்க முடியவில்லை.");
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUnsubscribe() {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        }).catch(() => {});
        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
      setFeedback("அறிவிப்புகள் முடக்கப்பட்டன. (Unsubscribed)");
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback("Error unsubscribing.");
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setIsLoading(false);
    }
  }

  // Variant: Header (short, compact, sleek design for mobile and desktop header)
  if (variant === "header") {
    return (
      <div className="relative inline-flex items-center shrink-0">
        <button
          type="button"
          onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
          disabled={isLoading}
          className={`relative flex items-center gap-1 sm:gap-1.5 rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-black transition-all shadow-sm active:scale-95 shrink-0 ${
            isSubscribed
              ? "bg-emerald-950 text-emerald-300 border border-emerald-400 hover:bg-emerald-900"
              : permission === "denied"
              ? "bg-slate-800 text-slate-400 border border-slate-600 hover:bg-slate-700"
              : "bg-navy-950 text-gold-light border border-gold/90 hover:bg-royal hover:text-white"
          } ${className}`}
          title={
            isSubscribed
              ? "அறிவிப்புகள் இயக்கப்பட்டுள்ளன (Click to unsubscribe)"
              : permission === "denied"
              ? "Browser settings-ல் அறிவிப்புகள் முடக்கப்பட்டுள்ளன"
              : "திருச்சபை அறிவிப்புகளை போனில் உடனுக்குடன் பெறவும் (Receive Notifications)"
          }
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-gold shrink-0" />
          ) : isSubscribed ? (
            <BellRing className="h-3.5 w-3.5 text-emerald-400 shrink-0 animate-pulse" />
          ) : permission === "denied" ? (
            <BellOff className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          ) : (
            <div className="relative shrink-0">
              <Bell className="h-3.5 w-3.5 text-gold animate-bounce" />
              {mounted && (
                <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-gold" />
              )}
            </div>
          )}

          <span className="tracking-tight whitespace-nowrap">
            {isLoading ? (
              "..."
            ) : isSubscribed ? (
              <>
                <span className="church-name-ta-source">On</span>
                <span className="church-name-en-override notranslate" translate="no">On</span>
              </>
            ) : permission === "denied" ? (
              <>
                <span className="church-name-ta-source">Off</span>
                <span className="church-name-en-override notranslate" translate="no">Off</span>
              </>
            ) : (
              <>
                <span className="church-name-ta-source">அறிவிப்பு</span>
                <span className="church-name-en-override notranslate" translate="no">Alerts</span>
              </>
            )}
          </span>
        </button>

        {/* Floating Toast Notification Feedback */}
        {feedback && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-navy-950/98 border-2 border-gold px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-2xl backdrop-blur-md max-w-[90vw] text-center animate-bounce">
            <Sparkles className="h-4 w-4 text-gold shrink-0" />
            <span>{feedback}</span>
          </div>
        )}
      </div>
    );
  }

  if (!isSupported) {
    return null; // Gracefully hide on incompatible browsers for pill/button
  }

  // Variant: Button (used in quick bar or actions)
  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
        disabled={isLoading || permission === "denied"}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all shadow-sm ${
          isSubscribed
            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-red-500/20 hover:text-red-300"
            : "bg-gold/20 text-gold-light border border-gold/40 hover:bg-gold hover:text-navy-950"
        } ${className}`}
        title={
          isSubscribed
            ? "Click to unsubscribe"
            : permission === "denied"
            ? "Notifications blocked in browser settings"
            : "Get phone notifications for new church announcements"
        }
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : isSubscribed ? (
          <BellRing className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <Bell className="h-3.5 w-3.5" />
        )}
        <span>
          {isSubscribed
            ? "அறிவிப்புகள் On"
            : permission === "denied"
            ? "Blocked"
            : "அறிவிப்புகளை பெற"}
        </span>
      </button>
    );
  }

  // Variant: Pill (subtle chip inside live announcements or banners)
  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
        disabled={isLoading || permission === "denied"}
        className={`group inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
          isSubscribed
            ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:border-red-400 hover:text-red-300"
            : "bg-navy-900/90 text-gold-light border border-gold/40 hover:border-gold hover:bg-gold/15"
        }`}
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-gold" />
        ) : isSubscribed ? (
          <Check className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <Bell className="h-3.5 w-3.5 text-gold animate-bounce" />
        )}
        <span>
          {isSubscribed
            ? "அறிவிப்புகள் இயக்கப்பட்டுள்ளன (Active)"
            : "போனில் அறிவிப்புகளை பெற (Turn On Alerts)"}
        </span>
      </button>

      {feedback && (
        <span className="absolute left-0 -bottom-6 whitespace-nowrap text-[11px] font-semibold text-emerald-400 animate-fadeIn">
          {feedback}
        </span>
      )}
    </div>
  );
}
