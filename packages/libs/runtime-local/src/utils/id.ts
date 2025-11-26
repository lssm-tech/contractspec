export function generateId(prefix?: string): string {
  const base =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10);
  return prefix ? `${prefix}_${base}` : base;
}










