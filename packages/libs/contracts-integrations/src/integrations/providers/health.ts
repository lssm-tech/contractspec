export type HealthDataTransport =
  | 'official-api'
  | 'official-mcp'
  | 'aggregator-api'
  | 'aggregator-mcp'
  | 'unofficial';

export type HealthConnectionStatusState =
  | 'healthy'
  | 'degraded'
  | 'error'
  | 'disconnected';

export interface HealthDataSource {
  providerKey: string;
  transport: HealthDataTransport;
  aggregatorKey?: string;
  route: 'primary' | 'fallback';
}

export interface HealthActivity {
  id: string;
  externalId: string;
  tenantId: string;
  connectionId: string;
  userId?: string;
  providerKey: string;
  activityType: string;
  startedAt?: string;
  endedAt?: string;
  durationSeconds?: number;
  distanceMeters?: number;
  caloriesKcal?: number;
  steps?: number;
  metadata?: Record<string, unknown>;
}

export interface HealthWorkout {
  id: string;
  externalId: string;
  tenantId: string;
  connectionId: string;
  userId?: string;
  providerKey: string;
  workoutType: string;
  startedAt?: string;
  endedAt?: string;
  durationSeconds?: number;
  distanceMeters?: number;
  caloriesKcal?: number;
  averageHeartRateBpm?: number;
  maxHeartRateBpm?: number;
  metadata?: Record<string, unknown>;
}

export interface HealthSleep {
  id: string;
  externalId: string;
  tenantId: string;
  connectionId: string;
  userId?: string;
  providerKey: string;
  startedAt: string;
  endedAt: string;
  durationSeconds?: number;
  deepSleepSeconds?: number;
  lightSleepSeconds?: number;
  remSleepSeconds?: number;
  awakeSeconds?: number;
  sleepScore?: number;
  metadata?: Record<string, unknown>;
}

export interface HealthBiometric {
  id: string;
  externalId: string;
  tenantId: string;
  connectionId: string;
  userId?: string;
  providerKey: string;
  metricType: string;
  value: number;
  unit?: string;
  measuredAt: string;
  metadata?: Record<string, unknown>;
}

export interface HealthNutrition {
  id: string;
  externalId: string;
  tenantId: string;
  connectionId: string;
  userId?: string;
  providerKey: string;
  loggedAt: string;
  caloriesKcal?: number;
  proteinGrams?: number;
  carbsGrams?: number;
  fatGrams?: number;
  fiberGrams?: number;
  hydrationMl?: number;
  metadata?: Record<string, unknown>;
}

export interface HealthPagination {
  nextCursor?: string;
  hasMore?: boolean;
}

export interface HealthListActivitiesParams {
  tenantId: string;
  connectionId?: string;
  userId?: string;
  from?: string;
  to?: string;
  cursor?: string;
  pageSize?: number;
}

export interface HealthListActivitiesResult extends HealthPagination {
  activities: HealthActivity[];
  source?: HealthDataSource;
}

export type HealthListWorkoutsParams = HealthListActivitiesParams;

export interface HealthListWorkoutsResult extends HealthPagination {
  workouts: HealthWorkout[];
  source?: HealthDataSource;
}

export type HealthListSleepParams = HealthListActivitiesParams;

export interface HealthListSleepResult extends HealthPagination {
  sleep: HealthSleep[];
  source?: HealthDataSource;
}

export interface HealthListBiometricsParams extends HealthListActivitiesParams {
  metricTypes?: string[];
}

export interface HealthListBiometricsResult extends HealthPagination {
  biometrics: HealthBiometric[];
  source?: HealthDataSource;
}

export type HealthListNutritionParams = HealthListActivitiesParams;

export interface HealthListNutritionResult extends HealthPagination {
  nutrition: HealthNutrition[];
  source?: HealthDataSource;
}

export interface HealthSyncRequest {
  tenantId: string;
  connectionId?: string;
  userId?: string;
  from?: string;
  to?: string;
  cursor?: string;
  forceFullRefresh?: boolean;
}

export interface HealthSyncResult {
  synced: number;
  failed: number;
  nextCursor?: string;
  errors?: string[];
  source?: HealthDataSource;
}

export interface HealthGetConnectionStatusParams {
  tenantId: string;
  connectionId: string;
}

export interface HealthConnectionStatus {
  connectionId: string;
  tenantId: string;
  status: HealthConnectionStatusState;
  source?: HealthDataSource;
  lastCheckedAt?: string;
  errorCode?: string;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

export interface HealthWebhookRequest {
  headers: Record<string, string | string[] | undefined>;
  rawBody: string;
  parsedBody?: unknown;
}

export interface HealthWebhookEvent {
  providerKey: string;
  eventType?: string;
  externalEntityId?: string;
  entityType?: 'activity' | 'workout' | 'sleep' | 'biometric' | 'nutrition';
  receivedAt?: string;
  verified?: boolean;
  payload?: unknown;
  metadata?: Record<string, unknown>;
}

export interface HealthProvider {
  listActivities(
    params: HealthListActivitiesParams
  ): Promise<HealthListActivitiesResult>;
  listWorkouts(
    params: HealthListWorkoutsParams
  ): Promise<HealthListWorkoutsResult>;
  listSleep(params: HealthListSleepParams): Promise<HealthListSleepResult>;
  listBiometrics(
    params: HealthListBiometricsParams
  ): Promise<HealthListBiometricsResult>;
  listNutrition(
    params: HealthListNutritionParams
  ): Promise<HealthListNutritionResult>;
  getConnectionStatus(
    params: HealthGetConnectionStatusParams
  ): Promise<HealthConnectionStatus>;
  syncActivities?(params: HealthSyncRequest): Promise<HealthSyncResult>;
  syncWorkouts?(params: HealthSyncRequest): Promise<HealthSyncResult>;
  syncSleep?(params: HealthSyncRequest): Promise<HealthSyncResult>;
  syncBiometrics?(params: HealthSyncRequest): Promise<HealthSyncResult>;
  syncNutrition?(params: HealthSyncRequest): Promise<HealthSyncResult>;
  parseWebhook?(request: HealthWebhookRequest): Promise<HealthWebhookEvent>;
  verifyWebhook?(request: HealthWebhookRequest): Promise<boolean>;
}
