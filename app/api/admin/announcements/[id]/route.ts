import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/admin-auth";
import type { AnnouncementStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

type Params = {
  params: {
    id: string;
  };
};

/**
 * PATCH /api/admin/announcements/[id]
 * Updates announcement status (approve, reject) with server-side authorization check.
 */
export async function PATCH(request: Request, { params }: Params) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.user ? 403 : 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Announcement ID is required." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { status } = body as { status?: AnnouncementStatus };

    const validStatuses: AnnouncementStatus[] = ["pending", "approved", "rejected"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Valid status is required: pending, approved, or rejected." },
        { status: 400 }
      );
    }

    const updatePayload: { status: AnnouncementStatus; published_at?: string | null } = {
      status,
    };

    if (status === "approved") {
      updatePayload.published_at = new Date().toISOString();
    } else if (status === "rejected") {
      updatePayload.published_at = null;
    }

    const { data: updated, error } = await auth.supabase
      .from("announcements")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update announcement: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ announcement: updated });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Invalid request body";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

/**
 * DELETE /api/admin/announcements/[id]
 * Permanently deletes an announcement with server-side authorization check.
 */
export async function DELETE(_request: Request, { params }: Params) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.user ? 403 : 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Announcement ID is required." }, { status: 400 });
  }

  const { error } = await auth.supabase
    .from("announcements")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to delete announcement: " + error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

