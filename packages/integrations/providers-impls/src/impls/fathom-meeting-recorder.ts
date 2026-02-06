import { Fathom } from 'fathom-typescript';
import { TriggeredFor } from 'fathom-typescript/sdk/models/operations';

import type {
  MeetingRecord,
  MeetingRecorderGetMeetingParams,
  MeetingRecorderGetTranscriptParams,
  MeetingRecorderListMeetingsParams,
  MeetingRecorderListMeetingsResult,
  MeetingRecorderProvider,
  MeetingRecorderWebhookEvent,
  MeetingRecorderWebhookRegistration,
  MeetingRecorderWebhookRequest,
  MeetingTranscriptRecord,
} from '../meeting-recorder';
import type {
  FathomMeetingListPage,
  FathomTranscriptResponse,
} from './fathom-meeting-recorder.types';
import {
  extractItems,
  extractNextCursor,
  mapTranscriptSegment,
  matchRecordingId,
  safeReadError,
} from './fathom-meeting-recorder.utils';
import { mapFathomMeeting } from './fathom-meeting-recorder.mapper';
import {
  normalizeTriggeredFor,
  normalizeWebhookHeaders,
} from './fathom-meeting-recorder.webhooks';

export interface FathomMeetingRecorderProviderOptions {
  apiKey: string;
  baseUrl?: string;
  includeTranscript?: boolean;
  includeSummary?: boolean;
  includeActionItems?: boolean;
  includeCrmMatches?: boolean;
  triggeredFor?: string[];
  webhookSecret?: string;
  maxPages?: number;
  client?: Fathom;
}

const DEFAULT_BASE_URL = 'https://api.fathom.ai/external/v1';

export class FathomMeetingRecorderProvider implements MeetingRecorderProvider {
  private readonly client: Fathom;
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly includeTranscript: boolean;
  private readonly includeSummary: boolean;
  private readonly includeActionItems: boolean;
  private readonly includeCrmMatches: boolean;
  private readonly triggeredFor?: string[];
  private readonly webhookSecret?: string;
  private readonly maxPages: number;

  constructor(options: FathomMeetingRecorderProviderOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.includeTranscript = options.includeTranscript ?? false;
    this.includeSummary = options.includeSummary ?? false;
    this.includeActionItems = options.includeActionItems ?? false;
    this.includeCrmMatches = options.includeCrmMatches ?? false;
    this.triggeredFor = options.triggeredFor;
    this.webhookSecret = options.webhookSecret;
    this.maxPages = options.maxPages ?? 5;
    this.client =
      options.client ??
      new Fathom({
        serverURL: this.baseUrl,
        security: {
          apiKeyAuth: this.apiKey,
        },
      });
  }

  async listMeetings(
    params: MeetingRecorderListMeetingsParams
  ): Promise<MeetingRecorderListMeetingsResult> {
    const request = {
      cursor: params.cursor,
      createdAfter: params.from,
      createdBefore: params.to,
      includeTranscript: params.includeTranscript ?? this.includeTranscript,
      includeSummary: params.includeSummary ?? this.includeSummary,
      includeActionItems: this.includeActionItems,
      includeCrmMatches: this.includeCrmMatches,
    };
    const result = await this.client.listMeetings(request);
    let firstPage: FathomMeetingListPage | undefined;
    for await (const page of result as AsyncIterable<FathomMeetingListPage>) {
      firstPage = page;
      break;
    }
    if (!firstPage) {
      return { meetings: [] };
    }
    const rawItems = extractItems(firstPage);
    const meetings = rawItems.map((meeting) =>
      mapFathomMeeting(meeting, params)
    );
    return {
      meetings,
      nextCursor: extractNextCursor(firstPage) ?? undefined,
      hasMore: Boolean(extractNextCursor(firstPage)),
    };
  }

  async getMeeting(
    params: MeetingRecorderGetMeetingParams
  ): Promise<MeetingRecord> {
    const result = await this.client.listMeetings({
      includeTranscript: params.includeTranscript ?? this.includeTranscript,
      includeSummary: params.includeSummary ?? this.includeSummary,
      includeActionItems: this.includeActionItems,
      includeCrmMatches: this.includeCrmMatches,
    });
    let pageCount = 0;
    const targetId = Number.parseInt(params.meetingId, 10);
    for await (const page of result as AsyncIterable<FathomMeetingListPage>) {
      pageCount += 1;
      const match = extractItems(page).find((meeting) =>
        matchRecordingId(meeting, targetId)
      );
      if (match) {
        return mapFathomMeeting(match, params);
      }
      if (pageCount >= this.maxPages) {
        break;
      }
    }
    throw new Error(`Fathom meeting "${targetId}" not found.`);
  }

  async getTranscript(
    params: MeetingRecorderGetTranscriptParams
  ): Promise<MeetingTranscriptRecord> {
    const response = await this.request<FathomTranscriptResponse>(
      `/recordings/${encodeURIComponent(params.meetingId)}/transcript`
    );
    if (!Array.isArray(response.transcript)) {
      throw new Error('Fathom transcript response did not include transcript.');
    }
    const segments = response.transcript.map((segment, index) =>
      mapTranscriptSegment(segment, index)
    );
    return {
      id: params.meetingId,
      meetingId: params.meetingId,
      tenantId: params.tenantId,
      connectionId: params.connectionId ?? 'unknown',
      externalId: params.meetingId,
      format: 'segments',
      text: segments.map((segment) => segment.text).join('\n'),
      segments,
      metadata: {
        provider: 'fathom',
      },
      raw: response.transcript,
    };
  }

  async parseWebhook(
    request: MeetingRecorderWebhookRequest
  ): Promise<MeetingRecorderWebhookEvent> {
    const payload = request.parsedBody ?? JSON.parse(request.rawBody);
    const body = payload as Record<string, unknown>;
    const recordingId =
      (body.recording_id as string | undefined) ??
      (body.recordingId as string | undefined) ??
      (body.meeting_id as string | undefined) ??
      (body.meetingId as string | undefined);
    const verified = this.webhookSecret
      ? await this.verifyWebhook(request)
      : undefined;
    return {
      providerKey: 'meeting-recorder.fathom',
      eventType:
        (body.event_type as string | undefined) ??
        (body.eventType as string | undefined),
      meetingId: recordingId,
      recordingId,
      verified,
      payload,
    };
  }

  async verifyWebhook(
    request: MeetingRecorderWebhookRequest
  ): Promise<boolean> {
    if (!this.webhookSecret) return true;
    const headers = normalizeWebhookHeaders(request.headers);
    try {
      return Boolean(
        Fathom.verifyWebhook(this.webhookSecret, headers, request.rawBody)
      );
    } catch {
      return false;
    }
  }

  async registerWebhook(
    registration: MeetingRecorderWebhookRegistration
  ): Promise<{ id: string; secret?: string }> {
    const triggeredFor = normalizeTriggeredFor(registration.triggeredFor) ??
      normalizeTriggeredFor(this.triggeredFor) ?? [TriggeredFor.MyRecordings];
    const webhook = await this.client.createWebhook({
      destinationUrl: registration.url,
      includeTranscript: registration.includeTranscript ?? true,
      includeSummary: registration.includeSummary ?? false,
      includeActionItems: registration.includeActionItems ?? false,
      includeCrmMatches: registration.includeCrmMatches ?? false,
      triggeredFor,
    });
    return {
      id: (webhook as { id: string }).id,
      secret: (webhook as { secret?: string }).secret,
    };
  }

  private async request<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': this.apiKey,
      },
    });
    if (!response.ok) {
      const message = await safeReadError(response);
      throw new Error(`Fathom API error (${response.status}): ${message}`);
    }
    return (await response.json()) as T;
  }
}
