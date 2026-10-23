/** Returns a local-time date key in YYYY-MM-DD form. */
export function dateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Number of calendar days between two date keys (b - a). */
export function daysBetween(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00`);
  const db = new Date(`${b}T00:00:00`);
  const ms = db.getTime() - da.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function isYesterday(previous: string, today: string): boolean {
  return daysBetween(previous, today) === 1;
}

export function isSameDay(a: string, today: string): boolean {
  return daysBetween(a, today) === 0;
}
