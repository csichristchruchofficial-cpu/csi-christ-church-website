import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import webpush from "web-push";

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
} catch {
  // Ignore
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subscription, userAgent } = body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json(
        { error: "Invalid subscription payload" },
        { status: 400 }
      );
    }

    const { endpoint, keys } = subscription;
    if (!keys.p256dh || !keys.auth) {
      return NextResponse.json(
        { error: "Missing cryptographic keys" },
        { status: 400 }
      );
    }

    // Attempt to persist subscription in Supabase
    try {
      const supabase = createServerSupabaseClient();

      const { error: upsertError } = await supabase
        .from("push_subscriptions")
        .upsert(
          {
            endpoint,
            p256dh: keys.p256dh,
            auth: keys.auth,
            user_agent: userAgent || request.headers.get("user-agent") || null,
          },
          { onConflict: "endpoint" }
        );

      if (upsertError) {
        // Fallback: try raw insert
        await supabase.from("push_subscriptions").insert({
          endpoint,
          p256dh: keys.p256dh,
          auth: keys.auth,
          user_agent: userAgent || request.headers.get("user-agent") || null,
        });
      }
    } catch (dbErr) {
      console.warn("Could not save push subscription to DB:", dbErr);
    }

    // Send an immediate welcome push notification through web-push to test the channel
    try {
      const testPayload = JSON.stringify({
        title: "CSI கிறிஸ்து ஆலயம் • கல்லிடைக்குறிச்சி",
        message: "🔔 அறிவிப்புகள் வெற்றிகரமாக இணைக்கப்பட்டன! (Notifications Active)",
        url: "/",
        category: "Announcement",
        tag: "welcome-alert",
      });

      await webpush.sendNotification(
        {
          endpoint,
          keys: {
            p256dh: keys.p256dh,
            auth: keys.auth,
          },
        },
        testPayload
      );
    } catch (pushErr) {
      console.warn("Could not send immediate test push:", pushErr);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: "Missing endpoint" },
        { status: 400 }
      );
    }

    try {
      const supabase = createServerSupabaseClient();
      await supabase
        .from("push_subscriptions")
        .delete()
        .eq("endpoint", endpoint);
    } catch {
      // Ignore cleanup error
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
