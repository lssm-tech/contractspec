import type {
  MeetingParticipant,
  MeetingRecord,
  MeetingRecorderGetMeetingParams,
  MeetingRecorderGetTranscriptParams,
  MeetingRecorderListMeetingsParams,
  MeetingRecorderListMeetingsResult,
  MeetingRecorderProvider,
  MeetingRecorderWebhookEvent,
  MeetingRecorderWebhookRequest,
  MeetingTranscriptRecord,
  MeetingTranscriptSegment,
} from '../meeting-recorder';

export interface TldvMeetingRecorderProviderOptions {
  apiKey: string;
  baseUrl?: string;
  pageSize?: number;
}

const DEFAULT_BASE_URL = 'https://pasta.tldv.io/v1alpha1';

export class TldvMeetingRecorderProvider implements MeetingRecorderProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly defaultPageSize?: number;

  constructor(options: TldvMeetingRecorderProviderOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.defaultPageSize = options.pageSize;
  }

  async listMeetings(
    params: MeetingRecorderListMeetingsParams
  ): Promise<MeetingRecorderListMeetingsResult> {
    const page = params.cursor ? Number(params.cursor) : 1;
    const limit = params.pageSize ?? this.defaultPageSize ?? 50;
    const query = new URLSearchParams();
    query.set('page', String(Number.isFinite(page) ? page : 1));
    query.set('limit', String(limit));
    if (params.query) query.set('query', params.query);
    if (params.from) query.set('from', params.from);
    if (params.to) query.set('to', params.to);
    if (params.organizerEmail) query.set('organizer', params.organizerEmail);
    if (params.participantEmail)
      query.set('participant', params.participantEmail);

    const data = await this.request<TldvMeetingListResponse>(
      `/meetings?${query.toString()}`
    );
    const nextPage = data.page < data.pages ? data.page + 1 : undefined;
    return {
      meetings: data.results.map((meeting) => this.mapMeeting(meeting, params)),
      nextCursor: nextPage ? String(nextPage) : undefined,
      hasMore: Boolean(nextPage),
    };
  }

  async getMeeting(
    params: MeetingRecorderGetMeetingParams
  ): Promise<MeetingRecord> {
    const meeting = await this.request<TldvMeeting>(
      `/meetings/${encodeURIComponent(params.meetingId)}`
    );
    return this.mapMeeting(meeting, params);
  }

  async getTranscript(
    params: MeetingRecorderGetTranscriptParams
  ): Promise<MeetingTranscriptRecord> {
    const response = await this.request<TldvTranscriptResponse>(
      `/meetings/${encodeURIComponent(params.meetingId)}/transcript`
    );
    const segments = response.data.map((segment, index) =>
      this.mapTranscriptSegment(segment, index)
    );
    return {
      id: response.id,
      meetingId: response.meetingId,
      tenantId: params.tenantId,
      connectionId: params.connectionId ?? 'unknown',
      externalId: response.id,
      format: 'segments',
      text: segments.map((segment) => segment.text).join('\n'),
      segments,
      metadata: {
        providerMeetingId: response.meetingId,
      },
      raw: response.data,
    };
  }

  async parseWebhook(
    request: MeetingRecorderWebhookRequest
  ): Promise<MeetingRecorderWebhookEvent> {
    const payload = request.parsedBody ?? JSON.parse(request.rawBody);
    const body = payload as {
      id?: string;
      event?: string;
      executedAt?: string;
      data?: { id?: string; meetingId?: string };
    };
    return {
      providerKey: 'meeting-recorder.tldv',
      eventType: body.event,
      meetingId: body.data?.id ?? body.data?.meetingId,
      receivedAt: body.executedAt,
      payload,
    };
  }

  private mapMeeting(
    meeting: TldvMeeting,
    params: MeetingRecorderListMeetingsParams | MeetingRecorderGetMeetingParams
  ): MeetingRecord {
    const connectionId = params.connectionId ?? 'unknown';
    const invitees = meeting.invitees
      ?.map((invitee) => this.mapInvitee(invitee))
      .filter(Boolean);
    return {
      id: meeting.id,
      tenantId: params.tenantId,
      connectionId,
      externalId: meeting.id,
      title: meeting.name,
      organizer: this.mapInvitee(meeting.organizer, 'organizer'),
      invitees: invitees?.length
        ? (invitees as MeetingParticipant[])
        : undefined,
      participants: invitees?.length
        ? (invitees as MeetingParticipant[])
        : undefined,
      scheduledStartAt: meeting.happenedAt,
      recordingStartAt: meeting.happenedAt,
      durationSeconds: meeting.duration,
      meetingUrl: meeting.url,
      transcriptAvailable: true,
      sourcePlatform: 'tldv',
      metadata: {
        template: meeting.template,
        extraProperties: meeting.extraProperties,
      },
    };
  }

  private mapInvitee(
    invitee?: TldvParticipant,
    role = 'attendee'
  ): MeetingParticipant | undefined {
    if (!invitee) return undefined;
    return {
      name: invitee.name ?? undefined,
      email: invitee.email ?? undefined,
      role,
    };
  }

  private mapTranscriptSegment(
    segment: TldvTranscriptSegment,
    index: number
  ): MeetingTranscriptSegment {
    return {
      index,
      speakerName: segment.speaker ?? undefined,
      text: segment.text,
      startTimeMs: parseSeconds(segment.startTime),
      endTimeMs: parseSeconds(segment.endTime),
    };
  }

  private async request<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
      },
    });
    if (!response.ok) {
      const message = await safeReadError(response);
      throw new Error(`tl;dv API error (${response.status}): ${message}`);
    }
    return (await response.json()) as T;
  }
}

interface TldvMeetingListResponse {
  page: number;
  pages: number;
  total: number;
  pageSize: number;
  results: TldvMeeting[];
}

interface TldvMeeting {
  id: string;
  name: string;
  happenedAt: string;
  url?: string;
  duration?: number;
  organizer?: TldvParticipant;
  invitees?: TldvParticipant[];
  template?: string;
  extraProperties?: Record<string, unknown>;
}

interface TldvParticipant {
  name?: string;
  email?: string;
}

interface TldvTranscriptResponse {
  id: string;
  meetingId: string;
  data: TldvTranscriptSegment[];
}

interface TldvTranscriptSegment {
  speaker?: string;
  text: string;
  startTime?: number | string;
  endTime?: number | string;
}

function parseSeconds(value?: number | string): number | undefined {
  if (value == null) return undefined;
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return undefined;
  return num * 1000;
}

async function safeReadError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string };
    return data?.message ?? response.statusText;
  } catch {
    return response.statusText;
  }
}
