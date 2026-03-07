import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';

export const HealthActivityRecord = new SchemaModel({
  name: 'HealthActivityRecord',
  description:
    'Canonical activity entry normalized across wearable and health providers.',
  fields: {
    id: { type: ScalarTypeEnum.ID(), isOptional: false },
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    providerKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    externalId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    userId: { type: ScalarTypeEnum.ID(), isOptional: true },
    activityType: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    endedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    durationSeconds: {
      type: ScalarTypeEnum.Float_unsecure(),
      isOptional: true,
    },
    distanceMeters: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    caloriesKcal: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    steps: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const HealthWorkoutRecord = new SchemaModel({
  name: 'HealthWorkoutRecord',
  description:
    'Canonical workout entry normalized across wearable and health providers.',
  fields: {
    id: { type: ScalarTypeEnum.ID(), isOptional: false },
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    providerKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    externalId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    userId: { type: ScalarTypeEnum.ID(), isOptional: true },
    workoutType: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    endedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    durationSeconds: {
      type: ScalarTypeEnum.Float_unsecure(),
      isOptional: true,
    },
    distanceMeters: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    caloriesKcal: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    averageHeartRateBpm: {
      type: ScalarTypeEnum.Float_unsecure(),
      isOptional: true,
    },
    maxHeartRateBpm: {
      type: ScalarTypeEnum.Float_unsecure(),
      isOptional: true,
    },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const HealthSleepRecord = new SchemaModel({
  name: 'HealthSleepRecord',
  description:
    'Canonical sleep interval normalized across wearable and health providers.',
  fields: {
    id: { type: ScalarTypeEnum.ID(), isOptional: false },
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    providerKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    externalId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    userId: { type: ScalarTypeEnum.ID(), isOptional: true },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    endedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    durationSeconds: {
      type: ScalarTypeEnum.Float_unsecure(),
      isOptional: true,
    },
    deepSleepSeconds: {
      type: ScalarTypeEnum.Float_unsecure(),
      isOptional: true,
    },
    lightSleepSeconds: {
      type: ScalarTypeEnum.Float_unsecure(),
      isOptional: true,
    },
    remSleepSeconds: {
      type: ScalarTypeEnum.Float_unsecure(),
      isOptional: true,
    },
    awakeSeconds: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    sleepScore: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const HealthBiometricRecord = new SchemaModel({
  name: 'HealthBiometricRecord',
  description:
    'Canonical biometric datapoint (e.g. resting HR, HRV, VO2 max, weight).',
  fields: {
    id: { type: ScalarTypeEnum.ID(), isOptional: false },
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    providerKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    externalId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    userId: { type: ScalarTypeEnum.ID(), isOptional: true },
    metricType: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    value: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    unit: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    measuredAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const HealthNutritionRecord = new SchemaModel({
  name: 'HealthNutritionRecord',
  description:
    'Canonical nutrition or hydration log normalized across providers.',
  fields: {
    id: { type: ScalarTypeEnum.ID(), isOptional: false },
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    providerKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    externalId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    userId: { type: ScalarTypeEnum.ID(), isOptional: true },
    loggedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    caloriesKcal: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    proteinGrams: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    carbsGrams: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    fatGrams: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    fiberGrams: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    hydrationMl: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const HealthWebhookEventRecord = new SchemaModel({
  name: 'HealthWebhookEventRecord',
  description: 'Normalized webhook event payload from a health provider.',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    providerKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    eventType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    externalEntityId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    entityType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    receivedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    verified: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    payload: { type: ScalarTypeEnum.JSON(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});
