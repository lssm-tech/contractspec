import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import {
  defineCommand,
  type AnyOperationSpec,
} from '@contractspec/lib.contracts-spec/operations';
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import { HealthWebhookEventRecord } from '../models';
import { HEALTH_TELEMETRY_EVENTS } from '../telemetry';

const HealthWebhookIngestInput = new SchemaModel({
  name: 'HealthWebhookIngestInput',
  description: 'Payload for ingesting provider webhook notifications.',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    providerKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    headers: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
    rawBody: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const HealthWebhookIngestOutput = new SchemaModel({
  name: 'HealthWebhookIngestOutput',
  description: 'Result of health webhook processing.',
  fields: {
    accepted: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    event: { type: HealthWebhookEventRecord, isOptional: true },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const HealthWebhookIngest = defineCommand({
  meta: {
    key: 'health.webhooks.ingest',
    version: '1.0.0',
    description: 'Ingest and normalize health provider webhook payloads.',
    goal: 'Allow near-real-time updates for health entities while preserving deterministic ingestion.',
    context:
      'Triggered by configured webhook endpoints for official, aggregator, and unofficial connectors.',
    owners: ['@platform.integrations'],
    tags: ['health', 'webhooks', 'integrations'],
    stability: 'experimental',
  },
  io: {
    input: HealthWebhookIngestInput,
    output: HealthWebhookIngestOutput,
  },
  policy: {
    auth: 'admin',
  },
  telemetry: {
    success: {
      event: { key: HEALTH_TELEMETRY_EVENTS.webhookReceived },
    },
    failure: {
      event: { key: HEALTH_TELEMETRY_EVENTS.webhookRejected },
    },
  },
});

export const healthWebhookContracts: Record<string, AnyOperationSpec> = {
  HealthWebhookIngest,
};

export function registerHealthWebhookContracts(
  registry: OperationSpecRegistry
): OperationSpecRegistry {
  return registry.register(HealthWebhookIngest);
}
