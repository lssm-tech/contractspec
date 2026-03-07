export const HEALTH_PII_FIELDS = [
  'name',
  'email',
  'phone',
  'dateOfBirth',
  'birthDate',
  'height',
  'weight',
  'bodyFat',
  'restingHeartRate',
  'heartRateVariability',
  'sleepDetails',
  'notes',
  'description',
  'location',
] as const;

export const HEALTH_TELEMETRY_EVENTS = {
  activitiesSynced: 'health.activities.synced',
  activitiesSyncFailed: 'health.activities.sync_failed',
  workoutsSynced: 'health.workouts.synced',
  workoutsSyncFailed: 'health.workouts.sync_failed',
  sleepSynced: 'health.sleep.synced',
  sleepSyncFailed: 'health.sleep.sync_failed',
  biometricsSynced: 'health.biometrics.synced',
  biometricsSyncFailed: 'health.biometrics.sync_failed',
  nutritionSynced: 'health.nutrition.synced',
  nutritionSyncFailed: 'health.nutrition.sync_failed',
  webhookReceived: 'health.webhooks.received',
  webhookRejected: 'health.webhooks.rejected',
} as const;

export type HealthTelemetryEvent =
  (typeof HEALTH_TELEMETRY_EVENTS)[keyof typeof HEALTH_TELEMETRY_EVENTS];

export function redactHealthTelemetryPayload<T extends Record<string, unknown>>(
  payload: T
): T {
  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (HEALTH_PII_FIELDS.includes(key as (typeof HEALTH_PII_FIELDS)[number])) {
      redacted[key] = maskValue(value);
      continue;
    }
    if (Array.isArray(value)) {
      redacted[key] = value.map((item) =>
        typeof item === 'object' && item !== null
          ? redactHealthTelemetryPayload(item as Record<string, unknown>)
          : item
      );
      continue;
    }
    if (typeof value === 'object' && value !== null) {
      redacted[key] = redactHealthTelemetryPayload(
        value as Record<string, unknown>
      );
      continue;
    }
    redacted[key] = value;
  }
  return redacted as T;
}

function maskValue(value: unknown): string {
  if (value == null) return '';
  const raw = String(value);
  if (raw.length <= 4) return '*'.repeat(raw.length);
  return `${'*'.repeat(Math.max(raw.length - 4, 0))}${raw.slice(-4)}`;
}
