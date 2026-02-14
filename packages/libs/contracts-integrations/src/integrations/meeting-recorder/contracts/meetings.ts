import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { type AnyOperationSpec, defineQuery } from '@contractspec/lib.contracts-spec/operations';
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import { MeetingRecord } from '../models';

const MeetingRecorderListMeetingsInput = new SchemaModel({
  name: 'MeetingRecorderListMeetingsInput',
  description:
    'Parameters for listing meetings from a meeting recorder provider.',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: true },
    from: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    to: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    cursor: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    pageSize: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    query: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    organizerEmail: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    participantEmail: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    includeTranscript: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    includeSummary: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const MeetingRecorderListMeetingsOutput = new SchemaModel({
  name: 'MeetingRecorderListMeetingsOutput',
  description: 'Paginated list of meetings for a recorder provider.',
  fields: {
    meetings: {
      type: MeetingRecord,
      isOptional: false,
      isArray: true,
    },
    nextCursor: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    hasMore: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const MeetingRecorderGetMeetingInput = new SchemaModel({
  name: 'MeetingRecorderGetMeetingInput',
  description: 'Parameters for retrieving a single meeting record.',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    meetingId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: true },
    includeTranscript: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    includeSummary: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

export const MeetingRecorderListMeetings = defineQuery({
  meta: {
    key: 'meeting-recorder.meetings.list',
    version: '1.0.0',
    description: 'List meetings recorded by the configured meeting provider.',
    goal: 'Provide downstream workflows with recent meetings and metadata.',
    context:
      'Used by integration hubs and sync workflows to enumerate meetings before pulling transcripts.',
    owners: ['@platform.integrations'],
    tags: ['meeting-recorder', 'meetings', 'transcripts'],
    stability: 'experimental',
  },
  io: {
    input: MeetingRecorderListMeetingsInput,
    output: MeetingRecorderListMeetingsOutput,
  },
  policy: {
    auth: 'user',
  },
});

export const MeetingRecorderGetMeeting = defineQuery({
  meta: {
    key: 'meeting-recorder.meetings.get',
    version: '1.0.0',
    description: 'Retrieve metadata for a single meeting recording.',
    goal: 'Allow downstream experiences to display detailed meeting metadata.',
    context:
      'Used when drilling into a specific meeting from a transcript or integration dashboard.',
    owners: ['@platform.integrations'],
    tags: ['meeting-recorder', 'meetings'],
    stability: 'experimental',
  },
  io: {
    input: MeetingRecorderGetMeetingInput,
    output: MeetingRecord,
  },
  policy: {
    auth: 'user',
  },
});

export const meetingRecorderMeetingContracts: Record<string, AnyOperationSpec> =
  {
    MeetingRecorderListMeetings,
    MeetingRecorderGetMeeting,
  };

export function registerMeetingRecorderMeetingContracts(
  registry: OperationSpecRegistry
): OperationSpecRegistry {
  return registry
    .register(MeetingRecorderListMeetings)
    .register(MeetingRecorderGetMeeting);
}
