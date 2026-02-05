import type {
  MeetingParticipant,
  MeetingRecord,
  MeetingRecorderGetMeetingParams,
  MeetingRecorderListMeetingsParams,
} from '../meeting-recorder';
import type {
  FathomMeeting,
  FathomMeetingInvitee,
} from './fathom-meeting-recorder.types';
import { durationSeconds } from './fathom-meeting-recorder.utils';

export const mapFathomMeetingInvites = (
  invitees: FathomMeetingInvitee[]
): MeetingParticipant[] => {
  return invitees.map((invitee) => ({
    ...invitee,
    name: invitee.name ?? undefined,
    email: invitee.email ?? undefined,
  }));
};

export function mapFathomMeeting(
  meeting: FathomMeeting,
  params: MeetingRecorderListMeetingsParams | MeetingRecorderGetMeetingParams
): MeetingRecord {
  const connectionId = params.connectionId ?? 'unknown';
  return {
    id: meeting.recordingId.toString(),
    tenantId: params.tenantId,
    connectionId,
    externalId: meeting.recordingId.toString(),
    title: meeting.title ?? meeting.meetingTitle,
    organizer: meeting.recordedBy
      ? {
          name: meeting.recordedBy.name ?? undefined,
          email: meeting.recordedBy.email ?? undefined,
          role: 'organizer',
        }
      : undefined,
    invitees: meeting.calendarInvitees.length
      ? mapFathomMeetingInvites(meeting.calendarInvitees)
      : undefined,
    participants: meeting.calendarInvitees.length
      ? mapFathomMeetingInvites(meeting.calendarInvitees)
      : undefined,
    scheduledStartAt: meeting.scheduledStartTime?.toISOString(),
    scheduledEndAt: meeting.scheduledEndTime?.toISOString(),
    recordingStartAt: meeting.recordingStartTime?.toISOString(),
    recordingEndAt: meeting.recordingEndTime?.toISOString(),
    durationSeconds: durationSeconds(
      meeting.recordingStartTime,
      meeting.recordingEndTime
    ),
    meetingUrl: meeting.url ?? undefined,
    shareUrl: meeting.shareUrl ?? undefined,
    transcriptAvailable: Array.isArray(meeting.transcript),
    sourcePlatform: 'fathom',
    language: meeting.transcriptLanguage,
    metadata: {
      calendarInviteesDomainsType: meeting.calendarInviteesDomainsType,
    },
  };
}
