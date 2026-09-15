import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { filterAndSortCelebrations, getKolkataToday } from "@/lib/celebrations/date-utils";

export const dynamic = "force-dynamic";

/**
 * GET /api/celebrations
 * Public endpoint returning upcoming birthdays and wedding anniversaries within the next 30 days.
 */
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const today = getKolkataToday();

    const { data: records, error } = await supabase
      .from("church_people_dates")
      .select("id, name, date_of_birth, anniversary_date");

    if (error || !records) {
      return NextResponse.json({
        birthdays: [],
        anniversaries: [],
        todayCount: 0,
        asOf: today.dateString,
      });
    }

    const { birthdays, anniversaries, todayCount } = filterAndSortCelebrations(
      records,
      30
    );

    return NextResponse.json({
      birthdays,
      anniversaries,
      todayCount,
      asOf: today.dateString,
    });
  } catch (err) {
    console.error("Error in /api/celebrations:", err);
    return NextResponse.json({
      birthdays: [],
      anniversaries: [],
      todayCount: 0,
      asOf: getKolkataToday().dateString,
    });
  }
}

