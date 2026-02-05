export interface FirefliesTranscriptsResponse {
  transcripts: FirefliesTranscript[];
}

export interface FirefliesTranscriptResponse {
  transcript: FirefliesTranscript;
}

export interface FirefliesTranscript {
  id: string;
  title?: string | null;
  organizer_email?: string | null;
  participants?: string[] | null;
  meeting_attendees?: FirefliesMeetingAttendee[] | null;
  dateString?: string | null;
  duration?: number | null;
  meeting_link?: string | null;
  transcript_url?: string | null;
  sentences?: FirefliesSentence[] | null;
}

export interface FirefliesMeetingAttendee {
  name?: string | null;
  displayName?: string | null;
  email?: string | null;
}

export interface FirefliesSentence {
  index?: number | null;
  speaker_id?: string | null;
  speaker_name?: string | null;
  text: string;
  start_time?: string | number | null;
  end_time?: string | number | null;
}
