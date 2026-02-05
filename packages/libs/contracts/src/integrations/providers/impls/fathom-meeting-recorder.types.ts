import type { Invitee, Meeting } from 'fathom-typescript/sdk/models/shared';

export type FathomMeeting = Meeting;
export type FathomMeetingInvitee = Invitee;

export interface FathomMeetingListPage {
  items?: FathomMeeting[];
  nextCursor?: string | null;
  next_cursor?: string | null;
}

export interface FathomTranscriptResponse {
  transcript?: FathomTranscriptSegment[];
}

export interface FathomTranscriptSegment {
  speaker?: { display_name?: string; matched_calendar_invitee_email?: string };
  text: string;
  timestamp: string;
}
