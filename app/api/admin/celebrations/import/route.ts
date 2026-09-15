import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/admin-auth";
import { parseExcelDate } from "@/lib/celebrations/date-utils";

export const dynamic = "force-dynamic";

type ImportPayload = {
  type: "birthday" | "anniversary";
  items: Array<{
    name: string;
    date: unknown;
  }>;
};

/**
 * POST /api/admin/celebrations/import
 * Bulk imports parsed Excel birthdays or anniversaries with intelligent merge by person name.
 */
export async function POST(request: Request) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.user ? 403 : 401 });
  }

  try {
    const body = (await request.json()) as ImportPayload;
    const { type, items } = body;

    if (!type || !["birthday", "anniversary"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid celebration type. Must be 'birthday' or 'anniversary'." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided for import." },
        { status: 400 }
      );
    }

    // Fetch existing records for merging by name
    const { data: existingRecords, error: fetchErr } = await auth.supabase
      .from("church_people_dates")
      .select("id, name, date_of_birth, anniversary_date");

    if (fetchErr) {
      return NextResponse.json(
        { error: "Failed to access database: " + fetchErr.message },
        { status: 500 }
      );
    }

    // Map existing names (normalized for case and whitespace) to records
    const recordMap = new Map<string, (typeof existingRecords)[number]>();
    for (const rec of existingRecords || []) {
      const key = rec.name.trim().toLowerCase();
      recordMap.set(key, rec);
    }

    let importedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    const toInsert: Array<{
      name: string;
      date_of_birth: string | null;
      anniversary_date: string | null;
      created_by: string;
    }> = [];

    const toUpdate: Array<{
      id: string;
      date_of_birth?: string | null;
      anniversary_date?: string | null;
      updated_at: string;
    }> = [];

    for (const item of items) {
      const rawName = String(item.name || "").trim();
      if (!rawName) {
        skippedCount++;
        continue;
      }

      const parsedDate = parseExcelDate(item.date);
      if (!parsedDate) {
        skippedCount++;
        continue;
      }

      const key = rawName.toLowerCase();
      const existing = recordMap.get(key);

      if (existing) {
        // Record exists: update the corresponding date field
        const updateObj: {
          id: string;
          date_of_birth?: string | null;
          anniversary_date?: string | null;
          updated_at: string;
        } = {
          id: existing.id,
          updated_at: new Date().toISOString(),
        };

        if (type === "birthday") {
          updateObj.date_of_birth = parsedDate;
          existing.date_of_birth = parsedDate; // update in-memory
        } else {
          updateObj.anniversary_date = parsedDate;
          existing.anniversary_date = parsedDate; // update in-memory
        }

        toUpdate.push(updateObj);
        updatedCount++;
      } else {
        // New record: create
        toInsert.push({
          name: rawName,
          date_of_birth: type === "birthday" ? parsedDate : null,
          anniversary_date: type === "anniversary" ? parsedDate : null,
          created_by: auth.user.id,
        });

        // Add to map so subsequent duplicates in the same file merge
        recordMap.set(key, {
          id: "pending",
          name: rawName,
          date_of_birth: type === "birthday" ? parsedDate : null,
          anniversary_date: type === "anniversary" ? parsedDate : null,
        });
        importedCount++;
      }
    }

    // Execute bulk inserts in chunks of 200
    if (toInsert.length > 0) {
      const chunkSize = 200;
      for (let i = 0; i < toInsert.length; i += chunkSize) {
        const chunk = toInsert.slice(i, i + chunkSize);
        const { error: insertErr } = await auth.supabase
          .from("church_people_dates")
          .insert(chunk);

        if (insertErr) {
          throw new Error("Insert error: " + insertErr.message);
        }
      }
    }

    // Execute updates
    if (toUpdate.length > 0) {
      for (const upd of toUpdate) {
        const { id, ...fields } = upd;
        await auth.supabase
          .from("church_people_dates")
          .update(fields)
          .eq("id", id);
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedCount,
      updated: updatedCount,
      skipped: skippedCount,
      totalProcessed: items.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error during import";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

