import { createHmac } from 'crypto';

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
import {
  TRANSCRIPT_QUERY,
  TRANSCRIPTS_QUERY,
  TRANSCRIPT_WITH_SEGMENTS_QUERY,
} from './fireflies-meeting-recorder.queries';
import type {
  FirefliesMeetingAttendee,
  FirefliesSentence,
  FirefliesTranscript,
  FirefliesTranscriptResponse,
  FirefliesTranscriptsResponse,
} from './fireflies-meeting-recorder.types';
import {
  normalizeHeader,
  parseSeconds,
  safeCompareHex,
  safeReadError,
} from './fireflies-meeting-recorder.utils';

export interface FirefliesMeetingRecorderProviderOptions {
  apiKey: string;
  baseUrl?: string;
  pageSize?: number;
  webhookSecret?: string;
}

const DEFAULT_BASE_URL = 'https://api.fireflies.ai/graphql';

export class FirefliesMeetingRecorderProvider implements MeetingRecorderProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly defaultPageSize?: number;
  private readonly webhookSecret?: string;

  constructor(options: FirefliesMeetingRecorderProviderOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.defaultPageSize = options.pageSize;
    this.webhookSecret = options.webhookSecret;
  }

  async listMeetings(
    params: MeetingRecorderListMeetingsParams
  ): Promise<MeetingRecorderListMeetingsResult> {
    const limit = params.pageSize ?? this.defaultPageSize ?? 25;
    const skip = params.cursor ? Number(params.cursor) : 0;
    const data = await this.query<FirefliesTranscriptsResponse>(
      TRANSCRIPTS_QUERY,
      {
        limit,
        skip: Number.isFinite(skip) ? skip : 0,
        fromDate: params.from,
        toDate: params.to,
        keyword: params.query,
        scope: params.query ? 'all' : undefined,
      }
    );
    const meetings = data.transcripts.map((transcript) =>
      this.mapTranscriptToMeeting(transcript, params)
    );
    const nextCursor =
      meetings.length === limit ? String(skip + limit) : undefined;
    return {
      meetings,
      nextCursor,
      hasMore: Boolean(nextCursor),
    };
  }

  async getMeeting(
    params: MeetingRecorderGetMeetingParams
  ): Promise<MeetingRecord> {
    const data = await this.query<FirefliesTranscriptResponse>(
      TRANSCRIPT_QUERY,
      {
        transcriptId: params.meetingId,
      }
    );
    return this.mapTranscriptToMeeting(data.transcript, params);
  }

  async getTranscript(
    params: MeetingRecorderGetTranscriptParams
  ): Promise<MeetingTranscriptRecord> {
    const data = await this.query<FirefliesTranscriptResponse>(
      TRANSCRIPT_WITH_SEGMENTS_QUERY,
      { transcriptId: params.meetingId }
    );
    const transcript = data.transcript;
    const segments = (transcript.sentences ?? []).map((segment) =>
      this.mapSentence(segment)
    );
    return {
      id: transcript.id,
      meetingId: transcript.id,
      tenantId: params.tenantId,
      connectionId: params.connectionId ?? 'unknown',
      externalId: transcript.id,
      format: 'segments',
      text: segments.map((segment) => segment.text).join('\n'),
      segments,
      generatedAt: transcript.dateString ?? undefined,
      sourceUrl: transcript.transcript_url ?? undefined,
      metadata: {
        meetingLink: transcript.meeting_link,
        durationMinutes: transcript.duration,
      },
      raw: transcript,
    };
  }

  async parseWebhook(
    request: MeetingRecorderWebhookRequest
  ): Promise<MeetingRecorderWebhookEvent> {
    const payload = request.parsedBody ?? JSON.parse(request.rawBody);
    const body = payload as {
      meetingId?: string;
      eventType?: string;
      clientReferenceId?: string;
    };
    const verified = this.webhookSecret
      ? await this.verifyWebhook(request)
      : undefined;
    return {
      providerKey: 'meeting-recorder.fireflies',
      eventType: body.eventType,
      meetingId: body.meetingId,
      transcriptId: body.meetingId,
      verified,
      payload,
      metadata: {
        clientReferenceId: body.clientReferenceId,
      },
    };
  }

  async verifyWebhook(
    request: MeetingRecorderWebhookRequest
  ): Promise<boolean> {
    if (!this.webhookSecret) return true;
    const signatureHeader = normalizeHeader(request.headers, 'x-hub-signature');
    if (!signatureHeader) return false;
    const signature = signatureHeader.replace(/^sha256=/, '');
    const digest = createHmac('sha256', this.webhookSecret)
      .update(request.rawBody)
      .digest('hex');
    return safeCompareHex(digest, signature);
  }

  private mapTranscriptToMeeting(
    transcript: FirefliesTranscript,
    params: MeetingRecorderListMeetingsParams | MeetingRecorderGetMeetingParams
  ): MeetingRecord {
    const connectionId = params.connectionId ?? 'unknown';
    const organizer = transcript.organizer_email
      ? { email: transcript.organizer_email, role: 'organizer' }
      : undefined;
    const attendees = transcript.meeting_attendees?.length
      ? transcript.meeting_attendees.map((attendee) =>
          this.mapAttendee(attendee)
        )
      : transcript.participants?.map((email) => ({ email, role: 'attendee' }));
    return {
      id: transcript.id,
      tenantId: params.tenantId,
      connectionId,
      externalId: transcript.id,
      title: transcript.title ?? undefined,
      organizer,
      invitees: attendees,
      participants: attendees,
      scheduledStartAt: transcript.dateString ?? undefined,
      recordingStartAt: transcript.dateString ?? undefined,
      durationSeconds: transcript.duration
        ? transcript.duration * 60
        : undefined,
      meetingUrl:
        transcript.meeting_link ?? transcript.transcript_url ?? undefined,
      transcriptAvailable: Boolean(transcript.transcript_url),
      sourcePlatform: 'fireflies',
      metadata: {
        transcriptUrl: transcript.transcript_url,
      },
    };
  }

  private mapAttendee(attendee: FirefliesMeetingAttendee): MeetingParticipant {
    return {
      name: attendee.name ?? attendee.displayName ?? undefined,
      email: attendee.email ?? undefined,
      role: 'attendee',
    };
  }

  private mapSentence(segment: FirefliesSentence): MeetingTranscriptSegment {
    return {
      index: segment.index ?? undefined,
      speakerId: segment.speaker_id ?? undefined,
      speakerName: segment.speaker_name ?? undefined,
      text: segment.text,
      startTimeMs: parseSeconds(segment.start_time),
      endTimeMs: parseSeconds(segment.end_time),
    };
  }

  private async query<T>(query: string, variables: Record<string, unknown>) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!response.ok) {
      const message = await safeReadError(response);
      throw new Error(`Fireflies API error (${response.status}): ${message}`);
    }
    const result = (await response.json()) as {
      data?: T;
      errors?: { message: string }[];
    };
    if (result.errors?.length) {
      throw new Error(result.errors.map((error) => error.message).join('; '));
    }
    if (!result.data) {
      throw new Error('Fireflies API returned empty data payload.');
    }
    return result.data;
  }
}
