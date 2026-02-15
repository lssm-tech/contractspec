import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import {
  type AnyOperationSpec,
  defineCommand,
  defineQuery,
} from '@contractspec/lib.contracts-spec/operations';
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import { MeetingTranscriptRecord } from '../models';
import { MEETING_RECORDER_TELEMETRY_EVENTS } from '../telemetry';

const MeetingRecorderGetTranscriptInput = new SchemaModel({
  name: 'MeetingRecorderGetTranscriptInput',
  description: 'Parameters for fetching a meeting transcript.',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    meetingId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: true },
    includeSegments: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    format: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const MeetingRecorderSyncTranscriptInput = new SchemaModel({
  name: 'MeetingRecorderSyncTranscriptInput',
  description: 'Command payload to synchronise meeting transcripts.',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    meetingId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: true },
    forceRefresh: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    triggerWebhooks: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const MeetingRecorderSyncTranscriptOutput = new SchemaModel({
  name: 'MeetingRecorderSyncTranscriptOutput',
  description: 'Result of a transcript synchronisation run.',
  fields: {
    synced: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    failed: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    errors: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    nextSyncSuggestedAt: {
      type: ScalarTypeEnum.DateTime(),
      isOptional: true,
    },
  },
});

export const MeetingRecorderGetTranscript = defineQuery({
  meta: {
    key: 'meeting-recorder.transcripts.get',
    version: '1.0.0',
    description: 'Fetch the transcript for a specific meeting recording.',
    goal: 'Expose meeting transcripts for downstream knowledge and analytics flows.',
    context:
      'Used by agents and dashboards to access the transcript for a selected meeting.',
    owners: ['@platform.integrations'],
    tags: ['meeting-recorder', 'transcripts'],
    stability: 'experimental',
  },
  io: {
    input: MeetingRecorderGetTranscriptInput,
    output: MeetingTranscriptRecord,
  },
  policy: {
    auth: 'user',
  },
});

export const MeetingRecorderSyncTranscript = defineCommand({
  meta: {
    key: 'meeting-recorder.transcripts.sync',
    version: '1.0.0',
    description:
      'Trigger a transcript sync from the meeting recorder provider.',
    goal: 'Keep canonical transcripts aligned with external meeting providers.',
    context:
      'Invoked by scheduled jobs or webhooks when new transcripts are ready.',
    owners: ['@platform.integrations'],
    tags: ['meeting-recorder', 'transcripts', 'sync'],
    stability: 'experimental',
  },
  io: {
    input: MeetingRecorderSyncTranscriptInput,
    output: MeetingRecorderSyncTranscriptOutput,
  },
  policy: {
    auth: 'admin',
  },
  telemetry: {
    success: {
      event: { key: MEETING_RECORDER_TELEMETRY_EVENTS.transcriptsSynced },
      properties: ({ input, output }) => {
        const payload = input as {
          tenantId?: string;
          meetingId?: string;
        };
        const result = output as {
          synced?: number;
          failed?: number;
        } | null;
        return {
          tenantId: payload?.tenantId,
          meetingId: payload?.meetingId,
          synced: result?.synced,
          failed: result?.failed,
        };
      },
    },
    failure: {
      event: { key: MEETING_RECORDER_TELEMETRY_EVENTS.transcriptsSyncFailed },
      properties: ({ input, error }) => {
        const payload = input as {
          tenantId?: string;
          meetingId?: string;
        };
        return {
          tenantId: payload?.tenantId,
          meetingId: payload?.meetingId,
          error:
            error instanceof Error ? error.message : String(error ?? 'unknown'),
        };
      },
    },
  },
});

export const meetingRecorderTranscriptContracts: Record<
  string,
  AnyOperationSpec
> = {
  MeetingRecorderGetTranscript,
  MeetingRecorderSyncTranscript,
};

export function registerMeetingRecorderTranscriptContracts(
  registry: OperationSpecRegistry
): OperationSpecRegistry {
  return registry
    .register(MeetingRecorderGetTranscript)
    .register(MeetingRecorderSyncTranscript);
}
