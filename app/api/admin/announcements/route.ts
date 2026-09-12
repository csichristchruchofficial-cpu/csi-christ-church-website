import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/admin-auth";
import type { AnnouncementCategory, AnnouncementStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/announcements
 * Returns all announcements (pending, approved, rejected) for authorized admins.
 */
export async function GET() {
  const auth = await verifyAdminSession();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.user ? 403 : 401 });
  }

  const { data: announcements, error } = await auth.supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch announcements: " + error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ announcements: announcements || [] });
}

/**
 * POST /api/admin/announcements
 * Creates a new announcement. Enforces server-side admin check.
 */
export async function POST(request: Request) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.user ? 403 : 401 });
  }

  try {
    const body = await request.json();
    const { message, category, status = "pending" } = body as {
      message?: string;
      category?: AnnouncementCategory;
      status?: AnnouncementStatus;
    };

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Announcement message is required." },
        { status: 400 }
      );
    }

    const validCategories: AnnouncementCategory[] = ["Announcement", "Prayer", "Event"];
    if (!category || !validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Valid category is required: Announcement, Prayer, or Event." },
        { status: 400 }
      );
    }

    const validStatuses: AnnouncementStatus[] = ["pending", "approved", "rejected"];
    const finalStatus = validStatuses.includes(status) ? status : "pending";
    const publishedAt = finalStatus === "approved" ? new Date().toISOString() : null;

    const { data: newAnnouncement, error } = await auth.supabase
      .from("announcements")
      .insert({
        message: message.trim(),
        category,
        status: finalStatus,
        created_by: auth.user.id,
        published_at: publishedAt,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create announcement: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ announcement: newAnnouncement }, { status: 201 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Invalid request body";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

