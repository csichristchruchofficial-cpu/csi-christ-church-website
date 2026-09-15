import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/admin-auth";
import { parseExcelDate } from "@/lib/celebrations/date-utils";

export const dynamic = "force-dynamic";

type Params = {
  params: {
    id: string;
  };
};

/**
 * PATCH /api/admin/celebrations/[id]
 * Updates person name, date of birth, or anniversary date.
 */
export async function PATCH(request: Request, { params }: Params) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.user ? 403 : 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Record ID is required." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, date_of_birth, anniversary_date } = body as {
      name?: string;
      date_of_birth?: string | null;
      anniversary_date?: string | null;
    };

    const updatePayload: {
      name?: string;
      date_of_birth?: string | null;
      anniversary_date?: string | null;
      updated_at: string;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) {
      if (!name.trim()) {
        return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
      }
      updatePayload.name = name.trim();
    }

    if (date_of_birth !== undefined) {
      updatePayload.date_of_birth = date_of_birth ? parseExcelDate(date_of_birth) : null;
    }

    if (anniversary_date !== undefined) {
      updatePayload.anniversary_date = anniversary_date ? parseExcelDate(anniversary_date) : null;
    }

    const { data: updated, error } = await auth.supabase
      .from("church_people_dates")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update record: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ record: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request body";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/**
 * DELETE /api/admin/celebrations/[id]
 * Permanently deletes a church person date record.
 */
export async function DELETE(_request: Request, { params }: Params) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.user ? 403 : 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Record ID is required." }, { status: 400 });
  }

  const { error } = await auth.supabase
    .from("church_people_dates")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to delete record: " + error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

