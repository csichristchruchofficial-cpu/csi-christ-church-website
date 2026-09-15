/**
 * Date calculation and parsing utilities for Church Birthdays and Wedding Anniversaries.
 * Configured specifically for Asia/Kolkata timezone.
 */

const TAMIL_MONTHS = [
  "ஜனவரி",
  "பிப்ரவரி",
  "மார்ச்",
  "ஏப்ரல்",
  "மே",
  "ஜூன்",
  "ஜூலை",
  "ஆகஸ்ட்",
  "செப்டம்பர்",
  "அக்டோபர்",
  "நவம்பர்",
  "டிசம்பர்",
];

const ENGLISH_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Returns current date components in Asia/Kolkata timezone.
 */
export function getKolkataToday(): {
  year: number;
  month: number;
  day: number;
  dateString: string;
} {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.format(new Date()).split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  return {
    year,
    month,
    day,
    dateString: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  };
}

/**
 * Checks if a given year is a leap year.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Parses any incoming date representation into an ISO YYYY-MM-DD string.
 * Supports:
 * - Native Excel serial numbers (e.g. 45292)
 * - DD-MM-YYYY, DD/MM/YYYY
 * - YYYY-MM-DD
 * - JavaScript Date objects
 */
export function parseExcelDate(raw: unknown): string | null {
  if (raw === null || raw === undefined || raw === "") return null;

  // 1. If it's already a JS Date
  if (raw instanceof Date) {
    if (isNaN(raw.getTime())) return null;
    const y = raw.getFullYear();
    const m = String(raw.getMonth() + 1).padStart(2, "0");
    const d = String(raw.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  // 2. If it's numeric (Excel serial date number)
  if (typeof raw === "number" || (!isNaN(Number(raw)) && !String(raw).includes("-") && !String(raw).includes("/"))) {
    const num = typeof raw === "number" ? raw : parseFloat(String(raw));
    if (num > 0 && num < 100000) {
      // Excel epoch starts 1899-12-30 (day 25569 from 1970-01-01)
      const ms = Math.round((num - 25569) * 86400 * 1000);
      const d = new Date(ms);
      if (!isNaN(d.getTime())) {
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, "0");
        const day = String(d.getUTCDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
      }
    }
  }

  const str = String(raw).trim();
  if (!str) return null;

  // 3. Match YYYY-MM-DD
  const ymd = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (ymd) {
    const y = parseInt(ymd[1], 10);
    const m = parseInt(ymd[2], 10);
    const d = parseInt(ymd[3], 10);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
  }

  // 4. Match DD-MM-YYYY or DD/MM/YYYY
  const dmy = str.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmy) {
    const d = parseInt(dmy[1], 10);
    const m = parseInt(dmy[2], 10);
    const y = parseInt(dmy[3], 10);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
  }

  return null;
}

export type CelebrationEvent = {
  id: string;
  name: string;
  type: "birthday" | "anniversary";
  originalDate: string; // YYYY-MM-DD
  nextDate: string; // YYYY-MM-DD
  displayDayMonth: string; // e.g. "20 September"
  displayDayMonthTa: string; // e.g. "20 செப்டம்பர்"
  daysRemaining: number;
  isToday: boolean;
  tamilGreeting: string;
  daysRemainingText: string;
};

/**
 * Calculates the next annual occurrence of a birthday or anniversary.
 * The original year does NOT affect the next occurrence; only month & day matter.
 * Handled Leap Year: Feb 29 on non-leap years maps to Feb 28.
 */
export function calculateNextOccurrence(
  id: string,
  name: string,
  type: "birthday" | "anniversary",
  dateString: string,
  today = getKolkataToday()
): CelebrationEvent | null {
  const parsed = parseExcelDate(dateString);
  if (!parsed) return null;

  const parts = parsed.split("-");
  let targetMonth = parseInt(parts[1], 10);
  let targetDay = parseInt(parts[2], 10);

  if (isNaN(targetMonth) || isNaN(targetDay) || targetMonth < 1 || targetMonth > 12) {
    return null;
  }

  // Decide if occurrence is in current year or next year
  let occurrenceYear = today.year;

  // Handle Feb 29 for current year
  let effectiveDay = targetDay;
  if (targetMonth === 2 && targetDay === 29 && !isLeapYear(occurrenceYear)) {
    effectiveDay = 28;
  }

  // Has the date already passed this year?
  const hasPassedThisYear =
    targetMonth < today.month ||
    (targetMonth === today.month && effectiveDay < today.day);

  if (hasPassedThisYear) {
    occurrenceYear = today.year + 1;
    effectiveDay = targetDay;
    if (targetMonth === 2 && targetDay === 29 && !isLeapYear(occurrenceYear)) {
      effectiveDay = 28;
    }
  }

  // Calculate day difference using UTC dates to avoid timezone daylight shifts
  const todayUtc = Date.UTC(today.year, today.month - 1, today.day);
  const occurrenceUtc = Date.UTC(occurrenceYear, targetMonth - 1, effectiveDay);
  const diffMs = occurrenceUtc - todayUtc;
  const daysRemaining = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));

  const isToday = daysRemaining === 0;

  const monthIndex = targetMonth - 1;
  const englishMonth = ENGLISH_MONTHS[monthIndex];
  const tamilMonth = TAMIL_MONTHS[monthIndex];

  const displayDayMonth = `${effectiveDay} ${englishMonth}`;
  const displayDayMonthTa = `${effectiveDay} ${tamilMonth}`;

  let daysRemainingText = `இன்னும் ${daysRemaining} நாட்கள்`;
  if (isToday) {
    daysRemainingText =
      type === "birthday" ? "இன்று பிறந்தநாள்! 🎉" : "இன்று திருமண நாள்! 💐";
  } else if (daysRemaining === 1) {
    daysRemainingText = "நாளை (Tomorrow)";
  }

  const tamilGreeting =
    type === "birthday"
      ? "இனிய பிறந்தநாள் வாழ்த்துக்கள்! கர்த்தர் உங்களை ஆசீர்வதிப்பாராக."
      : "இனிய திருமண நாள் வாழ்த்துக்கள்! கர்த்தர் உங்கள் குடும்பத்தை ஆசீர்வதிப்பாராக.";

  const nextDate = `${occurrenceYear}-${String(targetMonth).padStart(2, "0")}-${String(effectiveDay).padStart(2, "0")}`;

  return {
    id,
    name,
    type,
    originalDate: parsed,
    nextDate,
    displayDayMonth,
    displayDayMonthTa,
    daysRemaining,
    isToday,
    tamilGreeting,
    daysRemainingText,
  };
}

/**
 * Filters and sorts raw church people dates into upcoming birthdays and anniversaries (next 30 days).
 */
export function filterAndSortCelebrations(
  records: Array<{
    id: string;
    name: string;
    date_of_birth: string | null;
    anniversary_date: string | null;
  }>,
  maxDays = 30
): {
  birthdays: CelebrationEvent[];
  anniversaries: CelebrationEvent[];
  todayCount: number;
} {
  const today = getKolkataToday();
  const birthdays: CelebrationEvent[] = [];
  const anniversaries: CelebrationEvent[] = [];

  for (const record of records) {
    if (record.date_of_birth) {
      const bday = calculateNextOccurrence(
        record.id,
        record.name,
        "birthday",
        record.date_of_birth,
        today
      );
      if (bday && bday.daysRemaining <= maxDays) {
        birthdays.push(bday);
      }
    }

    if (record.anniversary_date) {
      const anni = calculateNextOccurrence(
        record.id,
        record.name,
        "anniversary",
        record.anniversary_date,
        today
      );
      if (anni && anni.daysRemaining <= maxDays) {
        anniversaries.push(anni);
      }
    }
  }

  // Sort chronologically (0 days first, then 1, 2, ..., 30)
  birthdays.sort((a, b) => a.daysRemaining - b.daysRemaining || a.name.localeCompare(b.name));
  anniversaries.sort((a, b) => a.daysRemaining - b.daysRemaining || a.name.localeCompare(b.name));

  const todayCount =
    birthdays.filter((b) => b.isToday).length +
    anniversaries.filter((a) => a.isToday).length;

  return {
    birthdays,
    anniversaries,
    todayCount,
  };
}

