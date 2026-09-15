import webpush from "web-push";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const DEFAULT_VAPID_PUBLIC_KEY =
  "BBZwHUayMFbFZt0CVXxHGAedTyasB_fJmGIMIxC3VE3aQYpG-ilXlGBG0WEg1B4sDMPv5SEOTzhk6WaZJgaCUA4";
const DEFAULT_VAPID_PRIVATE_KEY =
  "EPFfSFNNuKacqwOT5hMeFETFQQfkALCoWBkfnqogCH0";
const DEFAULT_VAPID_SUBJECT = "mailto:csichristchruchofficial@gmail.com";

const vapidPublicKey =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || DEFAULT_VAPID_PUBLIC_KEY;
const vapidPrivateKey =
  process.env.VAPID_PRIVATE_KEY || DEFAULT_VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || DEFAULT_VAPID_SUBJECT;

try {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
} catch (err) {
  console.warn("Failed to set VAPID details:", err);
}

export type PushPayload = {
  title: string;
  message: string;
  url?: string;
  category?: "Announcement" | "Prayer" | "Event";
  tag?: string;
};

/**
 * Dispatches an encrypted web push notification to all registered subscriptions in Supabase.
 * Automatically purges stale/expired endpoints (HTTP 404/410).
 */
export async function broadcastPushNotification(payload: PushPayload): Promise<{
  total: number;
  sent: number;
  failed: number;
}> {
  const supabase = createServerSupabaseClient();

  // Query all active subscriptions
  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth");

  if (error || !subscriptions || subscriptions.length === 0) {
    return { total: 0, sent: 0, failed: 0 };
  }

  const stringifiedPayload = JSON.stringify({
    title: payload.title,
    message: payload.message,
    url: payload.url || "/",
    category: payload.category || "Announcement",
    tag: payload.tag || "church-update",
  });

  let sent = 0;
  let failed = 0;
  const expiredIds: string[] = [];

  await Promise.all(
    subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      try {
        await webpush.sendNotification(pushSubscription, stringifiedPayload);
        sent++;
      } catch (err: any) {
        failed++;
        // If HTTP 404 or 410, the user unsubscribed or revoked permission in their browser
        if (err.statusCode === 404 || err.statusCode === 410) {
          expiredIds.push(sub.id);
        }
      }
    })
  );

  // Clean up expired subscriptions if any found
  if (expiredIds.length > 0) {
    try {
      await supabase.from("push_subscriptions").delete().in("id", expiredIds);
    } catch {
      // Ignore cleanup error
    }
  }

  return {
    total: subscriptions.length,
    sent,
    failed,
  };
}
