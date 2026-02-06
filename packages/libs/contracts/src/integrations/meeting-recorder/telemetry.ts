export const MEETING_RECORDER_PII_FIELDS = [
  'email',
  'organizerEmail',
  'participantEmail',
  'participants',
  'invitees',
  'attendees',
  'speakerName',
  'speakerEmail',
  'name',
  'phone',
  'phoneNumber',
  'displayName',
] as const;

export const MEETING_RECORDER_TELEMETRY_EVENTS = {
  meetingsSynced: 'meeting-recorder.meetings.synced',
  meetingsSyncFailed: 'meeting-recorder.meetings.sync_failed',
  transcriptsFetched: 'meeting-recorder.transcripts.fetched',
  transcriptsFetchFailed: 'meeting-recorder.transcripts.fetch_failed',
  transcriptsSynced: 'meeting-recorder.transcripts.synced',
  transcriptsSyncFailed: 'meeting-recorder.transcripts.sync_failed',
  webhookReceived: 'meeting-recorder.webhooks.received',
  webhookRejected: 'meeting-recorder.webhooks.rejected',
} as const;

export type MeetingRecorderTelemetryEvent =
  (typeof MEETING_RECORDER_TELEMETRY_EVENTS)[keyof typeof MEETING_RECORDER_TELEMETRY_EVENTS];

export function redactMeetingRecorderTelemetryPayload<
  T extends Record<string, unknown>,
>(payload: T): T {
  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (
      MEETING_RECORDER_PII_FIELDS.includes(
        key as (typeof MEETING_RECORDER_PII_FIELDS)[number]
      )
    ) {
      redacted[key] = maskValue(value);
    } else if (Array.isArray(value)) {
      redacted[key] = value.map((item) =>
        typeof item === 'object' && item !== null
          ? redactMeetingRecorderTelemetryPayload(
              item as Record<string, unknown>
            )
          : item
      );
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactMeetingRecorderTelemetryPayload(
        value as Record<string, unknown>
      );
    } else {
      redacted[key] = value;
    }
  }
  return redacted as T;
}

function maskValue(value: unknown): string {
  if (value == null) return '';
  const str = String(value);
  if (str.length <= 4) return '*'.repeat(str.length);
  return `${'*'.repeat(Math.max(str.length - 4, 0))}${str.slice(-4)}`;
}
