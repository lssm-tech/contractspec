import { TriggeredFor } from 'fathom-typescript/sdk/models/operations';

export function normalizeWebhookHeaders(
  headers: Record<string, string | string[] | undefined>
): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (value == null) continue;
    const normalizedKey = key.toLowerCase();
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      normalized[normalizedKey] = value.join(', ');
    } else {
      normalized[normalizedKey] = value;
    }
  }
  return normalized;
}

export function normalizeTriggeredFor(
  values?: string[]
): TriggeredFor[] | undefined {
  if (!values) return undefined;
  const allowed = new Set(Object.values(TriggeredFor));
  const normalized = values
    .map((value) => value.trim())
    .filter((value): value is TriggeredFor =>
      allowed.has(value as TriggeredFor)
    );
  return normalized.length ? normalized : undefined;
}
