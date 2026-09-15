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

type ChurchPerson = {
  id: string;
  name: string;
  date_of_birth: string | null;
  anniversary_date: string | null;
};

/**
 * POST /api/admin/celebrations/import
 * Bulk imports parsed Excel birthdays or anniversaries with intelligent merge by person name.
 * Handles large datasets (>1000 records) and prevents in-file duplicates from failing.
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

    // Fetch existing records for merging by name in batches of 1000
    let existingRecords: ChurchPerson[] = [];
    let from = 0;
    const step = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error: fetchErr } = await auth.supabase
        .from("church_people_dates")
        .select("id, name, date_of_birth, anniversary_date")
        .range(from, from + step - 1);

      if (fetchErr) {
        return NextResponse.json(
          { error: "Failed to access database: " + fetchErr.message },
          { status: 500 }
        );
      }

      if (data && data.length > 0) {
        existingRecords = existingRecords.concat(data as ChurchPerson[]);
        if (data.length < step) {
          hasMore = false;
        } else {
          from += step;
        }
      } else {
        hasMore = false;
      }
    }

    // Map existing names (normalized for case and whitespace) to records
    const recordMap = new Map<string, ChurchPerson>();
    for (const rec of existingRecords) {
      const key = rec.name.trim().toLowerCase();
      recordMap.set(key, rec);
    }

    let importedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    const toInsertMap = new Map<string, {
      name: string;
      date_of_birth: string | null;
      anniversary_date: string | null;
      created_by: string;
    }>();

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
        // Record exists in database: update the corresponding date field
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
          existing.date_of_birth = parsedDate;
        } else {
          updateObj.anniversary_date = parsedDate;
          existing.anniversary_date = parsedDate;
        }

        toUpdate.push(updateObj);
        updatedCount++;
      } else if (toInsertMap.has(key)) {
        // Already queued for insertion in this same batch
        const queued = toInsertMap.get(key)!;
        if (type === "birthday") {
          queued.date_of_birth = parsedDate;
        } else {
          queued.anniversary_date = parsedDate;
        }
        updatedCount++;
      } else {
        // New record: create
        const newRecord = {
          name: rawName,
          date_of_birth: type === "birthday" ? parsedDate : null,
          anniversary_date: type === "anniversary" ? parsedDate : null,
          created_by: auth.user.id,
        };
        toInsertMap.set(key, newRecord);
        importedCount++;
      }
    }

    const toInsert = Array.from(toInsertMap.values());

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
