import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/admin-auth";
import { parseExcelDate } from "@/lib/celebrations/date-utils";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/celebrations
 * Returns list of church people dates with optional search query (?q=...) and pagination.
 */
export async function GET(request: Request) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.user ? 403 : 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(10, parseInt(searchParams.get("limit") || "50", 10)));
  const offset = (page - 1) * limit;

  let dbQuery = auth.supabase
    .from("church_people_dates")
    .select("*", { count: "exact" });

  if (query) {
    dbQuery = dbQuery.ilike("name", `%${query}%`);
  }

  const { data: records, count, error } = await dbQuery
    .order("name", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch celebration records: " + error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    records: records || [],
    total: count || 0,
    page,
    limit,
  });
}

/**
 * POST /api/admin/celebrations
 * Adds a single church person date entry manually.
 */
export async function POST(request: Request) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.user ? 403 : 401 });
  }

  try {
    const body = await request.json();
    const { name, date_of_birth, anniversary_date } = body as {
      name?: string;
      date_of_birth?: string | null;
      anniversary_date?: string | null;
    };

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Person or couple name is required." }, { status: 400 });
    }

    const parsedDob = date_of_birth ? parseExcelDate(date_of_birth) : null;
    const parsedAnni = anniversary_date ? parseExcelDate(anniversary_date) : null;

    if (!parsedDob && !parsedAnni) {
      return NextResponse.json(
        { error: "At least one valid date (Date of Birth or Anniversary Date) is required." },
        { status: 400 }
      );
    }

    const { data: created, error } = await auth.supabase
      .from("church_people_dates")
      .insert({
        name: name.trim(),
        date_of_birth: parsedDob,
        anniversary_date: parsedAnni,
        created_by: auth.user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create celebration record: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ record: created }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request body";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

