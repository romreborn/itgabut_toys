import { RELEASE_EVENTS, type ReleaseEvent, type ReleaseKind } from "@/data/releaseEvents";

/** Client-safe helpers for the release calendar (no Supabase import). */

export type { ReleaseEvent, ReleaseKind };

export const MONTHS_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
export const DAYS_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export const KIND_STYLE: Record<ReleaseKind, { label: string; bg: string; fg: string }> = {
  rilis: { label: "Rilis produk", bg: "#FFE7D6", fg: "#B7420E" },
  event: { label: "Pameran", bg: "#DCEBD2", fg: "#3A5A2A" },
  film: { label: "Film", bg: "#E6E0F5", fg: "#4B3B8F" },
};

/** Today's date in Jakarta as "YYYY-MM-DD" (the server may run in UTC). */
export function todayJakarta(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export const isMonthOnly = (e: ReleaseEvent) => e.date.length === 7;
export const monthKey = (date: string) => date.slice(0, 7);

/** Sort key: month-only events sort after the dated ones in their month. */
const sortKey = (e: ReleaseEvent) => (isMonthOnly(e) ? `${e.date}-99` : e.date);

export function sortedEvents(events: ReleaseEvent[] = RELEASE_EVENTS): ReleaseEvent[] {
  return [...events].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
}

/** Events still running or ahead of `today` (month-only events count until their month ends). */
export function upcomingEvents(today: string, limit?: number, events: ReleaseEvent[] = RELEASE_EVENTS): ReleaseEvent[] {
  const list = sortedEvents(events).filter((e) => (isMonthOnly(e) ? e.date >= monthKey(today) : (e.endDate ?? e.date) >= today));
  return limit ? list.slice(0, limit) : list;
}

/** "Senin, 16 November 2026", "21 sampai 23 Oktober 2026", or "Desember 2026". */
export function formatEventDate(e: ReleaseEvent, withDay = true): string {
  const [y, m, d] = e.date.split("-").map(Number);
  if (!d) return `${MONTHS_ID[m - 1]} ${y}`;
  if (e.endDate) {
    const [, m2, d2] = e.endDate.split("-").map(Number);
    return m2 === m ? `${d} sampai ${d2} ${MONTHS_ID[m - 1]} ${y}` : `${d} ${MONTHS_ID[m - 1]} sampai ${d2} ${MONTHS_ID[m2 - 1]} ${y}`;
  }
  const day = DAYS_ID[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${withDay ? `${day}, ` : ""}${d} ${MONTHS_ID[m - 1]} ${y}`;
}

/** Every "YYYY-MM-DD" an event covers (one day, or each day of a multi-day event). */
export function eventDays(e: ReleaseEvent): string[] {
  if (isMonthOnly(e)) return [];
  const out: string[] = [];
  const end = e.endDate ?? e.date;
  for (let t = Date.parse(`${e.date}T00:00:00Z`); t <= Date.parse(`${end}T00:00:00Z`); t += 864e5) out.push(new Date(t).toISOString().slice(0, 10));
  return out;
}

/** Every slug referenced by the calendar, for one batched product lookup. */
export function allProductSlugs(events: ReleaseEvent[] = RELEASE_EVENTS): string[] {
  return [...new Set(events.flatMap((e) => e.productSlugs ?? []))];
}
