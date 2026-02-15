export interface MeetingParticipant {
  id?: string;
  externalId?: string;
  name?: string;
  email?: string;
  role?: string;
  isExternal?: boolean;
  metadata?: Record<string, unknown>;
}

export interface MeetingRecord {
  id: string;
  tenantId: string;
  connectionId: string;
  externalId: string;
  title?: string;
  summary?: string;
  organizer?: MeetingParticipant;
  invitees?: MeetingParticipant[];
  participants?: MeetingParticipant[];
  scheduledStartAt?: string;
  scheduledEndAt?: string;
  recordingStartAt?: string;
  recordingEndAt?: string;
  durationSeconds?: number;
  meetingUrl?: string;
  recordingUrl?: string;
  shareUrl?: string;
  sourcePlatform?: string;
  language?: string;
  transcriptAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface MeetingTranscriptSegment {
  index?: number;
  speakerId?: string;
  speakerName?: string;
  speakerEmail?: string;
  text: string;
  startTimeMs?: number;
  endTimeMs?: number;
  startTime?: string;
  endTime?: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

export interface MeetingTranscriptRecord {
  id: string;
  meetingId: string;
  tenantId: string;
  connectionId: string;
  externalId?: string;
  format?: string;
  text?: string;
  segments?: MeetingTranscriptSegment[];
  language?: string;
  sourceUrl?: string;
  generatedAt?: string;
  metadata?: Record<string, unknown>;
  raw?: unknown;
}

export interface MeetingRecorderListMeetingsParams {
  tenantId: string;
  connectionId?: string;
  from?: string;
  to?: string;
  cursor?: string;
  pageSize?: number;
  query?: string;
  organizerEmail?: string;
  participantEmail?: string;
  includeTranscript?: boolean;
  includeSummary?: boolean;
}

export interface MeetingRecorderListMeetingsResult {
  meetings: MeetingRecord[];
  nextCursor?: string;
  hasMore?: boolean;
}

export interface MeetingRecorderGetMeetingParams {
  tenantId: string;
  meetingId: string;
  connectionId?: string;
  includeTranscript?: boolean;
  includeSummary?: boolean;
}

export interface MeetingRecorderGetTranscriptParams {
  tenantId: string;
  meetingId: string;
  connectionId?: string;
  includeSegments?: boolean;
  format?: string;
}

export interface MeetingRecorderWebhookRequest {
  headers: Record<string, string | string[] | undefined>;
  rawBody: string;
  parsedBody?: unknown;
}

export interface MeetingRecorderWebhookEvent {
  providerKey: string;
  eventType?: string;
  meetingId?: string;
  transcriptId?: string;
  recordingId?: string;
  receivedAt?: string;
  verified?: boolean;
  payload?: unknown;
  metadata?: Record<string, unknown>;
}

export interface MeetingRecorderWebhookRegistration {
  url: string;
  includeTranscript?: boolean;
  includeSummary?: boolean;
  includeActionItems?: boolean;
  includeCrmMatches?: boolean;
  triggeredFor?: string[];
}

export interface MeetingRecorderProvider {
  listMeetings(
    params: MeetingRecorderListMeetingsParams
  ): Promise<MeetingRecorderListMeetingsResult>;
  getMeeting(params: MeetingRecorderGetMeetingParams): Promise<MeetingRecord>;
  getTranscript(
    params: MeetingRecorderGetTranscriptParams
  ): Promise<MeetingTranscriptRecord>;
  parseWebhook?(
    request: MeetingRecorderWebhookRequest
  ): Promise<MeetingRecorderWebhookEvent>;
  verifyWebhook?(request: MeetingRecorderWebhookRequest): Promise<boolean>;
  registerWebhook?(
    registration: MeetingRecorderWebhookRegistration
  ): Promise<{ id: string; secret?: string }>;
}
