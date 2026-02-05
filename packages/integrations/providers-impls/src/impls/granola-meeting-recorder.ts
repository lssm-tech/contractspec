import type {
  MeetingParticipant,
  MeetingRecord,
  MeetingRecorderGetMeetingParams,
  MeetingRecorderGetTranscriptParams,
  MeetingRecorderListMeetingsParams,
  MeetingRecorderListMeetingsResult,
  MeetingRecorderProvider,
  MeetingTranscriptRecord,
  MeetingTranscriptSegment,
} from '../meeting-recorder';
import type {
  GranolaInvitee,
  GranolaListNotesResponse,
  GranolaNote,
  GranolaNoteSummary,
  GranolaTranscriptSegment,
  GranolaUser,
} from './granola-meeting-recorder.types';

export interface GranolaMeetingRecorderProviderOptions {
  apiKey: string;
  baseUrl?: string;
  pageSize?: number;
}

const DEFAULT_BASE_URL = 'https://public-api.granola.ai';
const MAX_PAGE_SIZE = 30;

export class GranolaMeetingRecorderProvider implements MeetingRecorderProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly defaultPageSize?: number;

  constructor(options: GranolaMeetingRecorderProviderOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.defaultPageSize = options.pageSize;
  }

  async listMeetings(
    params: MeetingRecorderListMeetingsParams
  ): Promise<MeetingRecorderListMeetingsResult> {
    const query = new URLSearchParams();
    if (params.from) query.set('created_after', params.from);
    if (params.to) query.set('created_before', params.to);
    if (params.cursor) query.set('cursor', params.cursor);
    const pageSize = params.pageSize ?? this.defaultPageSize;
    if (pageSize) {
      query.set('page_size', String(Math.min(pageSize, MAX_PAGE_SIZE)));
    }

    const data = await this.request<GranolaListNotesResponse>(
      `/v1/notes?${query.toString()}`
    );
    return {
      meetings: data.notes.map((note) => this.mapNoteSummary(note, params)),
      nextCursor: data.cursor ?? undefined,
      hasMore: data.hasMore,
    };
  }

  async getMeeting(
    params: MeetingRecorderGetMeetingParams
  ): Promise<MeetingRecord> {
    const includeTranscript = params.includeTranscript ?? false;
    const note = await this.getNote(params.meetingId, includeTranscript);
    return this.mapNoteDetail(note, params);
  }

  async getTranscript(
    params: MeetingRecorderGetTranscriptParams
  ): Promise<MeetingTranscriptRecord> {
    const note = await this.getNote(params.meetingId, true);
    const segments = this.mapTranscriptSegments(note.transcript);
    return {
      id: note.id,
      meetingId: note.id,
      tenantId: params.tenantId,
      connectionId: params.connectionId ?? 'unknown',
      externalId: note.id,
      format: 'segments',
      text: segments.map((segment) => segment.text).join('\n'),
      segments,
      generatedAt: note.created_at,
      metadata: {
        summaryText: note.summary_text,
      },
      raw: note.transcript ?? undefined,
    };
  }

  private async getNote(noteId: string, includeTranscript: boolean) {
    const query = includeTranscript ? '?include=transcript' : '';
    return this.request<GranolaNote>(`/v1/notes/${noteId}${query}`);
  }

  private mapNoteSummary(
    note: GranolaNoteSummary,
    params: MeetingRecorderListMeetingsParams
  ): MeetingRecord {
    const connectionId = params.connectionId ?? 'unknown';
    return {
      id: note.id,
      tenantId: params.tenantId,
      connectionId,
      externalId: note.id,
      title: note.title ?? undefined,
      organizer: this.mapUser(note.owner),
      scheduledStartAt: note.created_at,
      recordingStartAt: note.created_at,
      transcriptAvailable: false,
      createdAt: note.created_at,
      updatedAt: note.created_at,
      sourcePlatform: 'granola',
    };
  }

  private mapNoteDetail(
    note: GranolaNote,
    params: MeetingRecorderGetMeetingParams
  ): MeetingRecord {
    const connectionId = params.connectionId ?? 'unknown';
    const calendarEvent = note.calendar_event ?? undefined;
    const invitees = calendarEvent?.invitees
      ? calendarEvent.invitees.map((invitee) => this.mapInvitee(invitee))
      : note.attendees
          ?.map((attendee) => this.mapUser(attendee))
          .filter(Boolean);
    const participants = note.attendees
      ?.map((attendee) => this.mapUser(attendee))
      .filter(Boolean);
    return {
      id: note.id,
      tenantId: params.tenantId,
      connectionId,
      externalId: note.id,
      title: note.title ?? calendarEvent?.event_title ?? undefined,
      summary: note.summary_text ?? undefined,
      organizer: this.mapUser(note.owner),
      invitees: invitees?.length
        ? (invitees as MeetingParticipant[])
        : undefined,
      participants: participants?.length
        ? (participants as MeetingParticipant[])
        : undefined,
      scheduledStartAt: calendarEvent?.scheduled_start_time ?? undefined,
      scheduledEndAt: calendarEvent?.scheduled_end_time ?? undefined,
      recordingStartAt: calendarEvent?.scheduled_start_time ?? note.created_at,
      recordingEndAt: calendarEvent?.scheduled_end_time ?? undefined,
      transcriptAvailable: Array.isArray(note.transcript),
      createdAt: note.created_at,
      updatedAt: note.created_at,
      sourcePlatform: 'granola',
      metadata: {
        calendarEvent,
        folderMembership: note.folder_membership,
      },
    };
  }

  private mapTranscriptSegments(
    transcript: GranolaTranscriptSegment[] | null
  ): MeetingTranscriptSegment[] {
    if (!transcript) return [];
    return transcript.map((segment, index) => ({
      index,
      speakerName: segment.speaker?.source ?? undefined,
      text: segment.text,
      startTime: segment.start_time,
      endTime: segment.end_time,
    }));
  }

  private mapUser(user?: GranolaUser | null): MeetingParticipant | undefined {
    if (!user) return undefined;
    return {
      name: user.name ?? undefined,
      email: user.email ?? undefined,
      role: 'organizer',
    };
  }

  private mapInvitee(invitee: GranolaInvitee): MeetingParticipant {
    return {
      email: invitee.email,
      role: 'attendee',
    };
  }

  private async request<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const message = await safeReadError(response);
      throw new Error(`Granola API error (${response.status}): ${message}`);
    }
    return (await response.json()) as T;
  }
}

async function safeReadError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string };
    return data?.message ?? response.statusText;
  } catch {
    return response.statusText;
  }
}
