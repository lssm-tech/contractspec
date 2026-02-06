export interface GranolaListNotesResponse {
  notes: GranolaNoteSummary[];
  hasMore: boolean;
  cursor: string | null;
}

export interface GranolaNoteSummary {
  id: string;
  title: string | null;
  owner: GranolaUser;
  created_at: string;
}

export interface GranolaNote extends GranolaNoteSummary {
  calendar_event: GranolaCalendarEvent | null;
  attendees: GranolaUser[];
  folder_membership: GranolaFolder[];
  summary_text: string;
  transcript: GranolaTranscriptSegment[] | null;
}

export interface GranolaUser {
  name: string | null;
  email: string;
}

export interface GranolaInvitee {
  email: string;
}

export interface GranolaCalendarEvent {
  event_title: string | null;
  invitees: GranolaInvitee[];
  organiser: string | null;
  calendar_event_id: string | null;
  scheduled_start_time: string | null;
  scheduled_end_time: string | null;
}

export interface GranolaFolder {
  id: string;
  object: 'folder';
  name: string;
}

export interface GranolaTranscriptSegment {
  speaker?: { source?: string } | null;
  text: string;
  start_time: string;
  end_time: string;
}
