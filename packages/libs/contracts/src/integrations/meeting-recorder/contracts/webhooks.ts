import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { type AnyOperationSpec, defineCommand } from '../../../operations';
import type { OperationSpecRegistry } from '../../../operations/registry';
import { MeetingRecorderWebhookEventRecord } from '../models';

const MeetingRecorderWebhookIngestInput = new SchemaModel({
  name: 'MeetingRecorderWebhookIngestInput',
  description: 'Payload for ingesting a meeting recorder webhook event.',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    providerKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: true },
    webhookId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    headers: { type: ScalarTypeEnum.JSON(), isOptional: true },
    payload: { type: ScalarTypeEnum.JSON(), isOptional: false },
    receivedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

const MeetingRecorderWebhookIngestOutput = new SchemaModel({
  name: 'MeetingRecorderWebhookIngestOutput',
  description: 'Result of processing a meeting recorder webhook.',
  fields: {
    accepted: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    event: { type: MeetingRecorderWebhookEventRecord, isOptional: true },
  },
});

export const MeetingRecorderWebhookIngest = defineCommand({
  meta: {
    key: 'meeting-recorder.webhooks.ingest',
    version: '1.0.0',
    description: 'Ingest a webhook from a meeting recorder provider.',
    goal: 'Trigger transcript syncs or downstream workflows without polling.',
    context:
      'Used by webhook handlers to validate and normalize provider webhook events.',
    owners: ['@platform.integrations'],
    tags: ['meeting-recorder', 'webhooks', 'transcripts'],
    stability: 'experimental',
  },
  io: {
    input: MeetingRecorderWebhookIngestInput,
    output: MeetingRecorderWebhookIngestOutput,
  },
  policy: {
    auth: 'admin',
  },
});

export const meetingRecorderWebhookContracts: Record<string, AnyOperationSpec> =
  {
    MeetingRecorderWebhookIngest,
  };

export function registerMeetingRecorderWebhookContracts(
  registry: OperationSpecRegistry
): OperationSpecRegistry {
  return registry.register(MeetingRecorderWebhookIngest);
}
