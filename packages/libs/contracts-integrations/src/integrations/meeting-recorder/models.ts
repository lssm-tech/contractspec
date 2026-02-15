import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';

export const MeetingParticipantRecord = new SchemaModel({
  name: 'MeetingParticipantRecord',
  description:
    'Canonical participant entry for meetings and transcripts from recorder providers.',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    externalId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    email: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    role: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    isExternal: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});

export const MeetingTranscriptSegmentRecord = new SchemaModel({
  name: 'MeetingTranscriptSegmentRecord',
  description: 'A single transcript segment with speaker attribution.',
  fields: {
    index: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    speakerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    speakerName: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    speakerEmail: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    text: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    startTimeMs: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    endTimeMs: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    startTime: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    endTime: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    confidence: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});

export const MeetingRecord = new SchemaModel({
  name: 'MeetingRecord',
  description:
    'Canonical meeting metadata synced from meeting recorder providers.',
  fields: {
    id: { type: ScalarTypeEnum.ID(), isOptional: false },
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    externalId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    summary: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    organizer: { type: MeetingParticipantRecord, isOptional: true },
    invitees: {
      type: MeetingParticipantRecord,
      isArray: true,
      isOptional: true,
    },
    participants: {
      type: MeetingParticipantRecord,
      isArray: true,
      isOptional: true,
    },
    scheduledStartAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    scheduledEndAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    recordingStartAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    recordingEndAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    durationSeconds: {
      type: ScalarTypeEnum.Float_unsecure(),
      isOptional: true,
    },
    meetingUrl: { type: ScalarTypeEnum.URL(), isOptional: true },
    recordingUrl: { type: ScalarTypeEnum.URL(), isOptional: true },
    shareUrl: { type: ScalarTypeEnum.URL(), isOptional: true },
    sourcePlatform: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    language: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    transcriptAvailable: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});

export const MeetingTranscriptRecord = new SchemaModel({
  name: 'MeetingTranscriptRecord',
  description: 'Canonical transcript payload for a recorded meeting.',
  fields: {
    id: { type: ScalarTypeEnum.ID(), isOptional: false },
    meetingId: { type: ScalarTypeEnum.ID(), isOptional: false },
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    externalId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    format: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    text: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    segments: {
      type: MeetingTranscriptSegmentRecord,
      isArray: true,
      isOptional: true,
    },
    language: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    sourceUrl: { type: ScalarTypeEnum.URL(), isOptional: true },
    generatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    raw: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

export const MeetingRecorderWebhookEventRecord = new SchemaModel({
  name: 'MeetingRecorderWebhookEventRecord',
  description: 'Normalized webhook event from a meeting recorder provider.',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    providerKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    eventType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    meetingId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    transcriptId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    recordingId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    receivedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    verified: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    payload: { type: ScalarTypeEnum.JSON(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});
