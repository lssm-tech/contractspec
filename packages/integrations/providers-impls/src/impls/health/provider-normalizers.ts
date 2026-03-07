import type {
  HealthActivity,
  HealthBiometric,
  HealthConnectionStatus,
  HealthDataSource,
  HealthNutrition,
  HealthSleep,
  HealthWebhookEvent,
  HealthWorkout,
} from '../../health';

type UnknownRecord = Record<string, unknown>;

export interface CanonicalContext {
  tenantId: string;
  connectionId?: string;
  providerKey: string;
}

const DEFAULT_LIST_KEYS = [
  'items',
  'data',
  'records',
  'activities',
  'workouts',
  'sleep',
  'biometrics',
  'nutrition',
] as const;

export function asRecord(value: unknown): UnknownRecord | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  return value as UnknownRecord;
}

export function asArray(value: unknown): unknown[] | undefined {
  return Array.isArray(value) ? value : undefined;
}

export function readString(
  record: UnknownRecord | undefined,
  keys: readonly string[]
): string | undefined {
  if (!record) return undefined;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }
  return undefined;
}

export function readNumber(
  record: UnknownRecord | undefined,
  keys: readonly string[]
): number | undefined {
  if (!record) return undefined;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim().length > 0) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
}

export function readBoolean(
  record: UnknownRecord | undefined,
  keys: readonly string[]
): boolean | undefined {
  if (!record) return undefined;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'boolean') {
      return value;
    }
  }
  return undefined;
}

export function extractList(
  payload: unknown,
  listKeys: readonly string[] = DEFAULT_LIST_KEYS
): UnknownRecord[] {
  const root = asRecord(payload);
  if (!root) {
    return (
      asArray(payload)
        ?.map((item) => asRecord(item))
        .filter((item): item is UnknownRecord => Boolean(item)) ?? []
    );
  }

  for (const key of listKeys) {
    const arrayValue = asArray(root[key]);
    if (!arrayValue) continue;
    return arrayValue
      .map((item) => asRecord(item))
      .filter((item): item is UnknownRecord => Boolean(item));
  }

  return [];
}

export function extractPagination(payload: unknown): {
  nextCursor?: string;
  hasMore?: boolean;
} {
  const root = asRecord(payload);
  const nestedPagination = asRecord(root?.pagination);
  const nextCursor =
    readString(nestedPagination, ['nextCursor', 'next_cursor']) ??
    readString(root, [
      'nextCursor',
      'next_cursor',
      'cursor',
      'next_page_token',
    ]);
  const hasMore =
    readBoolean(nestedPagination, ['hasMore', 'has_more']) ??
    readBoolean(root, ['hasMore', 'has_more']);

  return {
    nextCursor,
    hasMore: hasMore ?? Boolean(nextCursor),
  };
}

export function toHealthActivity(
  item: UnknownRecord,
  context: CanonicalContext,
  fallbackType = 'activity'
): HealthActivity {
  const externalId =
    readString(item, ['external_id', 'externalId', 'uuid', 'id']) ??
    `${context.providerKey}:${fallbackType}`;
  const id =
    readString(item, ['id', 'uuid', 'workout_id']) ??
    `${context.providerKey}:activity:${externalId}`;

  return {
    id,
    externalId,
    tenantId: context.tenantId,
    connectionId: context.connectionId ?? 'unknown',
    userId: readString(item, ['user_id', 'userId', 'athlete_id']),
    providerKey: context.providerKey,
    activityType:
      readString(item, ['activity_type', 'type', 'sport_type', 'sport']) ??
      fallbackType,
    startedAt: readIsoDate(item, [
      'started_at',
      'start_time',
      'start_date',
      'created_at',
    ]),
    endedAt: readIsoDate(item, ['ended_at', 'end_time']),
    durationSeconds: readNumber(item, [
      'duration_seconds',
      'duration',
      'elapsed_time',
    ]),
    distanceMeters: readNumber(item, ['distance_meters', 'distance']),
    caloriesKcal: readNumber(item, [
      'calories_kcal',
      'calories',
      'active_kilocalories',
    ]),
    steps: readNumber(item, ['steps'])?.valueOf(),
    metadata: item,
  };
}

export function toHealthWorkout(
  item: UnknownRecord,
  context: CanonicalContext,
  fallbackType = 'workout'
): HealthWorkout {
  const activity = toHealthActivity(item, context, fallbackType);
  return {
    id: activity.id,
    externalId: activity.externalId,
    tenantId: activity.tenantId,
    connectionId: activity.connectionId,
    userId: activity.userId,
    providerKey: activity.providerKey,
    workoutType:
      readString(item, [
        'workout_type',
        'sport_type',
        'type',
        'activity_type',
      ]) ?? fallbackType,
    startedAt: activity.startedAt,
    endedAt: activity.endedAt,
    durationSeconds: activity.durationSeconds,
    distanceMeters: activity.distanceMeters,
    caloriesKcal: activity.caloriesKcal,
    averageHeartRateBpm: readNumber(item, [
      'average_heart_rate',
      'avg_hr',
      'average_heart_rate_bpm',
    ]),
    maxHeartRateBpm: readNumber(item, [
      'max_heart_rate',
      'max_hr',
      'max_heart_rate_bpm',
    ]),
    metadata: item,
  };
}

export function toHealthSleep(
  item: UnknownRecord,
  context: CanonicalContext
): HealthSleep {
  const externalId =
    readString(item, ['external_id', 'externalId', 'uuid', 'id']) ??
    `${context.providerKey}:sleep`;
  const id =
    readString(item, ['id', 'uuid']) ??
    `${context.providerKey}:sleep:${externalId}`;
  const startedAt =
    readIsoDate(item, ['started_at', 'start_time', 'bedtime_start', 'start']) ??
    new Date(0).toISOString();
  const endedAt =
    readIsoDate(item, ['ended_at', 'end_time', 'bedtime_end', 'end']) ??
    startedAt;

  return {
    id,
    externalId,
    tenantId: context.tenantId,
    connectionId: context.connectionId ?? 'unknown',
    userId: readString(item, ['user_id', 'userId']),
    providerKey: context.providerKey,
    startedAt,
    endedAt,
    durationSeconds: readNumber(item, [
      'duration_seconds',
      'duration',
      'total_sleep_duration',
    ]),
    deepSleepSeconds: readNumber(item, [
      'deep_sleep_seconds',
      'deep_sleep_duration',
    ]),
    lightSleepSeconds: readNumber(item, [
      'light_sleep_seconds',
      'light_sleep_duration',
    ]),
    remSleepSeconds: readNumber(item, [
      'rem_sleep_seconds',
      'rem_sleep_duration',
    ]),
    awakeSeconds: readNumber(item, ['awake_seconds', 'awake_time']),
    sleepScore: readNumber(item, ['sleep_score', 'score']),
    metadata: item,
  };
}

export function toHealthBiometric(
  item: UnknownRecord,
  context: CanonicalContext,
  metricTypeFallback = 'metric'
): HealthBiometric {
  const externalId =
    readString(item, ['external_id', 'externalId', 'uuid', 'id']) ??
    `${context.providerKey}:biometric`;
  const id =
    readString(item, ['id', 'uuid']) ??
    `${context.providerKey}:biometric:${externalId}`;

  return {
    id,
    externalId,
    tenantId: context.tenantId,
    connectionId: context.connectionId ?? 'unknown',
    userId: readString(item, ['user_id', 'userId']),
    providerKey: context.providerKey,
    metricType:
      readString(item, ['metric_type', 'metric', 'type', 'name']) ??
      metricTypeFallback,
    value: readNumber(item, ['value', 'score', 'measurement']) ?? 0,
    unit: readString(item, ['unit']),
    measuredAt:
      readIsoDate(item, ['measured_at', 'timestamp', 'created_at']) ??
      new Date().toISOString(),
    metadata: item,
  };
}

export function toHealthNutrition(
  item: UnknownRecord,
  context: CanonicalContext
): HealthNutrition {
  const externalId =
    readString(item, ['external_id', 'externalId', 'uuid', 'id']) ??
    `${context.providerKey}:nutrition`;
  const id =
    readString(item, ['id', 'uuid']) ??
    `${context.providerKey}:nutrition:${externalId}`;

  return {
    id,
    externalId,
    tenantId: context.tenantId,
    connectionId: context.connectionId ?? 'unknown',
    userId: readString(item, ['user_id', 'userId']),
    providerKey: context.providerKey,
    loggedAt:
      readIsoDate(item, ['logged_at', 'created_at', 'date', 'timestamp']) ??
      new Date().toISOString(),
    caloriesKcal: readNumber(item, ['calories_kcal', 'calories']),
    proteinGrams: readNumber(item, ['protein_grams', 'protein']),
    carbsGrams: readNumber(item, ['carbs_grams', 'carbs']),
    fatGrams: readNumber(item, ['fat_grams', 'fat']),
    fiberGrams: readNumber(item, ['fiber_grams', 'fiber']),
    hydrationMl: readNumber(item, ['hydration_ml', 'water_ml', 'water']),
    metadata: item,
  };
}

export function toHealthConnectionStatus(
  payload: unknown,
  params: { tenantId: string; connectionId: string },
  source: HealthDataSource
): HealthConnectionStatus {
  const record = asRecord(payload);
  const rawStatus =
    readString(record, ['status', 'connection_status', 'health']) ?? 'healthy';
  return {
    tenantId: params.tenantId,
    connectionId: params.connectionId,
    status:
      rawStatus === 'healthy' ||
      rawStatus === 'degraded' ||
      rawStatus === 'error' ||
      rawStatus === 'disconnected'
        ? rawStatus
        : 'healthy',
    source,
    lastCheckedAt:
      readIsoDate(record, ['last_checked_at', 'lastCheckedAt']) ??
      new Date().toISOString(),
    errorCode: readString(record, ['error_code', 'errorCode']),
    errorMessage: readString(record, ['error_message', 'errorMessage']),
    metadata: asRecord(record?.metadata),
  };
}

export function toHealthWebhookEvent(
  payload: unknown,
  providerKey: string,
  verified: boolean
): HealthWebhookEvent {
  const record = asRecord(payload);
  const entityType = readString(record, ['entity_type', 'entityType', 'type']);
  const normalizedEntityType =
    entityType === 'activity' ||
    entityType === 'workout' ||
    entityType === 'sleep' ||
    entityType === 'biometric' ||
    entityType === 'nutrition'
      ? entityType
      : undefined;

  return {
    providerKey,
    eventType: readString(record, ['event_type', 'eventType', 'event']),
    externalEntityId: readString(record, [
      'external_entity_id',
      'externalEntityId',
      'entity_id',
      'entityId',
      'id',
    ]),
    entityType: normalizedEntityType,
    receivedAt: new Date().toISOString(),
    verified,
    payload,
    metadata: asRecord(record?.metadata),
  };
}

function readIsoDate(
  record: UnknownRecord | undefined,
  keys: readonly string[]
): string | undefined {
  const value = readString(record, keys);
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}
