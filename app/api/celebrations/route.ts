import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { filterAndSortCelebrations, getKolkataToday } from "@/lib/celebrations/date-utils";

export const dynamic = "force-dynamic";

type PersonDateRecord = {
  id: string;
  name: string;
  date_of_birth: string | null;
  anniversary_date: string | null;
};

/**
 * GET /api/celebrations
 * Public endpoint returning upcoming birthdays and wedding anniversaries.
 * Uses paginated range queries to fetch all records regardless of Supabase's default 1000-row limit.
 */
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const today = getKolkataToday();

    let allRecords: PersonDateRecord[] = [];
    let from = 0;
    const step = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from("church_people_dates")
        .select("id, name, date_of_birth, anniversary_date")
        .range(from, from + step - 1);

      if (error) {
        console.error("Error fetching church_people_dates range:", error);
        break;
      }

      if (data && data.length > 0) {
        allRecords = allRecords.concat(data as PersonDateRecord[]);
        if (data.length < step) {
          hasMore = false;
        } else {
          from += step;
        }
      } else {
        hasMore = false;
      }
    }

    const { birthdays, anniversaries, todayCount } = filterAndSortCelebrations(
      allRecords,
      30
    );

    return NextResponse.json({
      birthdays,
      anniversaries,
      todayCount,
      totalRecordsInDb: allRecords.length,
      asOf: today.dateString,
    });
  } catch (err) {
    console.error("Error in /api/celebrations:", err);
    return NextResponse.json({
      birthdays: [],
      anniversaries: [],
      todayCount: 0,
      totalRecordsInDb: 0,
      asOf: getKolkataToday().dateString,
    });
  }
}
