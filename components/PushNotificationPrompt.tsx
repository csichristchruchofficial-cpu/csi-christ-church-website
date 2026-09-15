"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, BellRing, Check, Loader2 } from "lucide-react";

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
  variant?: "pill" | "button" | "card";
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

  useEffect(() => {
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
    if (!isSupported) return;
    setIsLoading(true);
    setFeedback(null);

    try {
      // 1. Request Notification permission
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        setFeedback("Notification permission was denied.");
        setIsLoading(false);
        return;
      }

      // 2. Register Service Worker
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // 3. Subscribe to Push Manager
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

      // 4. Send subscription to server
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save push subscription on server.");
      }

      setIsSubscribed(true);
      setFeedback("அறிவிப்புகள் வெற்றிகரமாக இணைக்கப்பட்டன! (Alerts Active)");
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback(err?.message || "Could not enable notifications.");
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
        });
        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
      setFeedback("அறிவிப்புகள் முடக்கப்பட்டன. (Unsubscribed)");
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback("Error unsubscribing.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isSupported) {
    return null; // Gracefully hide on incompatible browsers
  }

  // Variant: Button (used in Header or quick bar)
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
