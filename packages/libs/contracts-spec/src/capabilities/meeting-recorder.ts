import type { CapabilityRegistry, CapabilitySpec } from '../capabilities';
import { StabilityEnum } from '../ownership';

const OWNERS = ['platform.integrations'] as const;
const TAGS = ['meeting-recorder', 'transcripts', 'integrations'] as const;

export const meetingRecorderMeetingsReadCapability: CapabilitySpec = {
  meta: {
    key: 'meeting-recorder.meetings.read',
    version: '1.0.0',
    kind: 'integration',
    title: 'Meeting Recorder Meetings (Read)',
    description:
      'Provides read-only access to recorded meetings and their metadata.',
    domain: 'integrations',
    owners: [...OWNERS],
    tags: [...TAGS, 'meetings'],
    stability: StabilityEnum.Experimental,
  },
  provides: [
    {
      surface: 'operation',
      key: 'meeting-recorder.meetings.list',
      version: '1.0.0',
      description: 'List meetings available from the recorder provider.',
    },
    {
      surface: 'operation',
      key: 'meeting-recorder.meetings.get',
      version: '1.0.0',
      description: 'Fetch detailed metadata for a specific meeting.',
    },
  ],
};

export const meetingRecorderTranscriptsReadCapability: CapabilitySpec = {
  meta: {
    key: 'meeting-recorder.transcripts.read',
    version: '1.0.0',
    kind: 'integration',
    title: 'Meeting Recorder Transcripts (Read)',
    description:
      'Enables retrieval of transcripts for recorded meetings from external providers.',
    domain: 'integrations',
    owners: [...OWNERS],
    tags: [...TAGS, 'transcripts'],
    stability: StabilityEnum.Experimental,
  },
  provides: [
    {
      surface: 'operation',
      key: 'meeting-recorder.transcripts.get',
      version: '1.0.0',
      description: 'Fetch the transcript for a specific meeting recording.',
    },
    {
      surface: 'operation',
      key: 'meeting-recorder.transcripts.sync',
      version: '1.0.0',
      description: 'Trigger a transcript sync from the recorder provider.',
    },
  ],
};

export const meetingRecorderWebhooksCapability: CapabilitySpec = {
  meta: {
    key: 'meeting-recorder.webhooks',
    version: '1.0.0',
    kind: 'integration',
    title: 'Meeting Recorder Webhooks',
    description:
      'Allows processing of webhook events for meeting transcript readiness.',
    domain: 'integrations',
    owners: [...OWNERS],
    tags: [...TAGS, 'webhooks'],
    stability: StabilityEnum.Experimental,
  },
  provides: [
    {
      surface: 'operation',
      key: 'meeting-recorder.webhooks.ingest',
      version: '1.0.0',
      description: 'Ingest and verify meeting recorder webhook payloads.',
    },
  ],
};

export function registerMeetingRecorderCapabilities(
  registry: CapabilityRegistry
): CapabilityRegistry {
  return registry
    .register(meetingRecorderMeetingsReadCapability)
    .register(meetingRecorderTranscriptsReadCapability)
    .register(meetingRecorderWebhooksCapability);
}
