/**
 * Compute a human-friendly elapsed-time string from an ISO date to now.
 *
 * @param isoDate - ISO 8601 date string (e.g. "2025-01-15T12:00:00Z").
 * @param now     - Optional reference date (defaults to Date.now()).
 * @returns A short label such as "3 days", "2 hours", or "Never".
 */
export function formatAge(
  isoDate: string | undefined,
  now: number = Date.now(),
): string {
  if (!isoDate) return "Never";

  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return "Never";

  const diffMs = now - then;
  if (diffMs < 0) return "just now";

  const seconds = Math.floor(diffMs / 1_000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days === 1 ? "" : "s"}`;
  if (hours > 0) return `${hours} hour${hours === 1 ? "" : "s"}`;
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  return "just now";
}
