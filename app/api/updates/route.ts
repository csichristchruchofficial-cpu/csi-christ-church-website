import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { churchUpdates, type ChurchUpdate } from "@/data/updates";

export const dynamic = "force-dynamic";

/**
 * GET /api/updates
 * Public endpoint that returns only approved announcements from Supabase.
 * Falls back safely to static churchUpdates if database is not yet configured.
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase environment variables are missing, fallback gracefully to static updates
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("your-project-id")) {
    return NextResponse.json({ updates: churchUpdates });
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("id, message, category, published_at")
      .eq("status", "approved")
      .order("published_at", { ascending: false });

    if (error) {
      console.warn("Supabase query error in /api/updates, using fallback:", error.message);
      return NextResponse.json({ updates: churchUpdates });
    }

    // Map database rows to the ChurchUpdate client contract
    const updates: ChurchUpdate[] = (data || []).map((item) => ({
      id: item.id,
      message: item.message,
      category: item.category as "Announcement" | "Prayer" | "Event",
      publishedAt: item.published_at || new Date().toISOString(),
    }));

    return NextResponse.json({ updates });
  } catch (err) {
    console.error("Unexpected error in /api/updates:", err);
    return NextResponse.json({ updates: churchUpdates });
  }
}
