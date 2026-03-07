import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import {
  defineCommand,
  defineQuery,
  type AnyOperationSpec,
} from '@contractspec/lib.contracts-spec/operations';
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import { HealthBiometricRecord } from '../models';
import { HEALTH_TELEMETRY_EVENTS } from '../telemetry';

const HealthListBiometricsInput = new SchemaModel({
  name: 'HealthListBiometricsInput',
  description: 'Parameters for listing normalized biometric datapoints.',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: true },
    userId: { type: ScalarTypeEnum.ID(), isOptional: true },
    metricTypes: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    from: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    to: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    cursor: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    pageSize: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const HealthListBiometricsOutput = new SchemaModel({
  name: 'HealthListBiometricsOutput',
  description: 'Paginated list of normalized biometric datapoints.',
  fields: {
    biometrics: {
      type: HealthBiometricRecord,
      isArray: true,
      isOptional: false,
    },
    nextCursor: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    hasMore: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const HealthSyncBiometricsInput = new SchemaModel({
  name: 'HealthSyncBiometricsInput',
  description: 'Command payload to synchronize biometric datapoints.',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: true },
    userId: { type: ScalarTypeEnum.ID(), isOptional: true },
    metricTypes: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    from: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    to: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    cursor: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    forceFullRefresh: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const HealthSyncBiometricsOutput = new SchemaModel({
  name: 'HealthSyncBiometricsOutput',
  description: 'Result of a biometric synchronization run.',
  fields: {
    synced: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    failed: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    nextCursor: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    errors: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
  },
});

export const HealthListBiometrics = defineQuery({
  meta: {
    key: 'health.biometrics.list',
    version: '1.0.0',
    description:
      'List normalized biometrics synced from connected health providers.',
    goal: 'Expose canonical biometrics for health insights and automation.',
    context:
      'Used by readiness features, alerts, and trend-based decision workflows.',
    owners: ['@platform.integrations'],
    tags: ['health', 'biometrics', 'wearables'],
    stability: 'experimental',
  },
  io: {
    input: HealthListBiometricsInput,
    output: HealthListBiometricsOutput,
  },
  policy: {
    auth: 'user',
  },
});

export const HealthSyncBiometrics = defineCommand({
  meta: {
    key: 'health.biometrics.sync',
    version: '1.0.0',
    description: 'Synchronize biometric datapoints from provider sources.',
    goal: 'Keep canonical biometrics synchronized for downstream analytics.',
    context: 'Triggered by incremental sync jobs and manual refresh actions.',
    owners: ['@platform.integrations'],
    tags: ['health', 'biometrics', 'wearables'],
    stability: 'experimental',
  },
  io: {
    input: HealthSyncBiometricsInput,
    output: HealthSyncBiometricsOutput,
  },
  policy: {
    auth: 'admin',
  },
  telemetry: {
    success: {
      event: { key: HEALTH_TELEMETRY_EVENTS.biometricsSynced },
    },
    failure: {
      event: { key: HEALTH_TELEMETRY_EVENTS.biometricsSyncFailed },
    },
  },
});

export const healthBiometricContracts: Record<string, AnyOperationSpec> = {
  HealthListBiometrics,
  HealthSyncBiometrics,
};

export function registerHealthBiometricContracts(
  registry: OperationSpecRegistry
): OperationSpecRegistry {
  return registry.register(HealthListBiometrics).register(HealthSyncBiometrics);
}
