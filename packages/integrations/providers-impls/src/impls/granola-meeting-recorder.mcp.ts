import type {
  GranolaFolder,
  GranolaMcpJsonRpcResponse,
  GranolaNote,
  GranolaNoteSummary,
  GranolaTranscriptSegment,
  GranolaUser,
} from './granola-meeting-recorder.types';

const UNKNOWN_EMAIL = 'unknown@granola.local';
const EPOCH = '1970-01-01T00:00:00.000Z';

export interface GranolaMcpClientOptions {
  mcpUrl: string;
  mcpAccessToken?: string;
  mcpHeaders?: Record<string, string>;
  fetchFn?: typeof fetch;
}

export class GranolaMcpClient {
  private requestId = 0;
  private readonly mcpUrl: string;
  private readonly mcpAccessToken?: string;
  private readonly mcpHeaders?: Record<string, string>;
  private readonly fetchFn: typeof fetch;

  constructor(options: GranolaMcpClientOptions) {
    this.mcpUrl = options.mcpUrl;
    this.mcpAccessToken = options.mcpAccessToken;
    this.mcpHeaders = options.mcpHeaders;
    this.fetchFn = options.fetchFn ?? fetch;
  }

  async callTool(
    name: string,
    args: Record<string, unknown>
  ): Promise<unknown> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.mcpHeaders ?? {}),
    };
    if (this.mcpAccessToken) {
      headers.Authorization = `Bearer ${this.mcpAccessToken}`;
    }

    const response = await this.fetchFn(this.mcpUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: ++this.requestId,
        method: 'tools/call',
        params: {
          name,
          arguments: args,
        },
      }),
    });

    if (!response.ok) {
      const message = await safeReadText(response);
      throw new Error(`Granola MCP error (${response.status}): ${message}`);
    }

    const rpc = (await response.json()) as GranolaMcpJsonRpcResponse;
    if (rpc.error) {
      throw new Error(rpc.error.message ?? 'Granola MCP returned an error.');
    }
    return extractRpcResult(rpc);
  }
}

export interface GranolaMcpListResult {
  notes: GranolaNoteSummary[];
  nextCursor?: string;
  hasMore?: boolean;
}

export function normalizeMcpListResult(payload: unknown): GranolaMcpListResult {
  const root = asObject(payload);
  const list =
    asArray(payload) ??
    asArray(root?.notes) ??
    asArray(root?.meetings) ??
    asArray(root?.items) ??
    asArray(root?.results) ??
    asArray(root?.data) ??
    [];

  const notes = list
    .map((item) => mapSummaryItem(item))
    .filter((item): item is GranolaNoteSummary => Boolean(item));

  return {
    notes,
    nextCursor: readString(root, ['nextCursor', 'next_cursor', 'cursor']),
    hasMore: readBoolean(root, ['hasMore', 'has_more']),
  };
}

export function normalizeMcpMeeting(
  payload: unknown,
  targetMeetingId: string
): GranolaNote | undefined {
  const root = asObject(payload);
  const candidates =
    asArray(payload) ??
    asArray(root?.meetings) ??
    asArray(root?.notes) ??
    asArray(root?.items) ??
    asArray(root?.results) ??
    asArray(root?.data);

  if (candidates?.length) {
    const selected =
      candidates.find((item) => readId(item) === targetMeetingId) ??
      candidates.find((item) =>
        String(readId(item) ?? '').includes(targetMeetingId)
      ) ??
      candidates[0];
    return selected ? mapMeetingItem(selected) : undefined;
  }

  const direct = mapMeetingItem(payload);
  if (direct && direct.id === targetMeetingId) {
    return direct;
  }
  return direct;
}

export function normalizeMcpTranscript(
  payload: unknown
): GranolaTranscriptSegment[] {
  const root = asObject(payload);
  const list =
    asArray(payload) ??
    asArray(root?.transcript) ??
    asArray(root?.segments) ??
    asArray(root?.items) ??
    asArray(root?.data) ??
    [];

  if (list.length === 0 && typeof payload === 'string') {
    return [
      {
        text: payload,
        start_time: '00:00:00',
        end_time: '00:00:00',
      },
    ];
  }

  return list
    .map((item) => mapTranscriptSegment(item))
    .filter((item): item is GranolaTranscriptSegment => Boolean(item));
}

function extractRpcResult(rpc: GranolaMcpJsonRpcResponse): unknown {
  const result = rpc.result;
  if (!result) return null;
  if (result.structuredContent !== undefined) return result.structuredContent;
  if (result.data !== undefined) return result.data;

  const textPayload = result.content?.find(
    (entry) => entry?.type === 'text'
  )?.text;
  if (!textPayload) return result;

  try {
    return JSON.parse(textPayload) as unknown;
  } catch {
    return textPayload;
  }
}

function mapSummaryItem(value: unknown): GranolaNoteSummary | undefined {
  const object = asObject(value);
  if (!object) return undefined;

  const id = readId(object);
  if (!id) return undefined;

  const owner = mapOwner(object);

  return {
    id,
    title: readString(object, ['title', 'name', 'meeting_title']) ?? null,
    owner,
    created_at:
      readString(object, ['created_at', 'createdAt', 'date', 'meeting_date']) ??
      EPOCH,
  };
}

function mapMeetingItem(value: unknown): GranolaNote | undefined {
  const summary = mapSummaryItem(value);
  if (!summary) return undefined;

  const object = asObject(value) ?? {};
  const attendees =
    asArray(object.attendees) ??
    asArray(object.participants) ??
    asArray(object.invitees) ??
    [];

  const mappedAttendees = attendees
    .map((entry) => mapUser(entry))
    .filter((entry): entry is GranolaUser => Boolean(entry));

  const folders =
    asArray(object.folder_membership) ?? asArray(object.folders) ?? [];
  const folderMembership = folders
    .map((entry, index) => mapFolder(entry, index))
    .filter((entry): entry is GranolaFolder => Boolean(entry));

  const calendarEvent = asObject(object.calendar_event)
    ? {
        event_title:
          readString(asObject(object.calendar_event), [
            'event_title',
            'title',
          ]) ?? null,
        invitees: mappedAttendees.map((attendee) => ({
          email: attendee.email,
        })),
        organiser:
          readString(asObject(object.calendar_event), [
            'organiser',
            'organizer',
          ]) ?? summary.owner.email,
        calendar_event_id:
          readString(asObject(object.calendar_event), [
            'calendar_event_id',
            'id',
          ]) ?? null,
        scheduled_start_time:
          readString(asObject(object.calendar_event), [
            'scheduled_start_time',
            'start_time',
            'start',
          ]) ?? null,
        scheduled_end_time:
          readString(asObject(object.calendar_event), [
            'scheduled_end_time',
            'end_time',
            'end',
          ]) ?? null,
      }
    : null;

  const transcript = normalizeMcpTranscript(
    object.transcript ?? object.segments
  );

  return {
    ...summary,
    calendar_event: calendarEvent,
    attendees: mappedAttendees,
    folder_membership: folderMembership,
    summary_text:
      readString(object, ['summary_text', 'summary', 'enhanced_notes']) ?? '',
    transcript: transcript.length ? transcript : null,
  };
}

function mapTranscriptSegment(
  value: unknown
): GranolaTranscriptSegment | undefined {
  const object = asObject(value);
  if (!object) {
    if (typeof value !== 'string') return undefined;
    return {
      text: value,
      start_time: '00:00:00',
      end_time: '00:00:00',
    };
  }

  const text = readString(object, ['text', 'content', 'utterance']);
  if (!text) return undefined;

  const speakerSource =
    readString(asObject(object.speaker), ['source', 'name']) ??
    readString(object, ['speaker', 'speaker_name']);

  return {
    speaker: speakerSource ? { source: speakerSource } : undefined,
    text,
    start_time:
      readString(object, ['start_time', 'startTime', 'timestamp', 'time']) ??
      '00:00:00',
    end_time: readString(object, ['end_time', 'endTime']) ?? '00:00:00',
  };
}

function mapOwner(object: Record<string, unknown>): GranolaUser {
  const ownerObject =
    asObject(object.owner) ??
    asObject(object.organizer) ??
    asObject(object.organiser);

  const attendee =
    asArray(object.attendees)?.[0] ??
    asArray(object.participants)?.[0] ??
    asArray(object.invitees)?.[0];

  const ownerCandidate = ownerObject ?? asObject(attendee) ?? {};

  return {
    name: readString(ownerCandidate, ['name', 'displayName']) ?? null,
    email: readString(ownerCandidate, ['email']) ?? UNKNOWN_EMAIL,
  };
}

function mapUser(value: unknown): GranolaUser | undefined {
  if (typeof value === 'string') {
    return {
      name: null,
      email: value,
    };
  }

  const object = asObject(value);
  if (!object) return undefined;

  const email = readString(object, ['email']);
  if (!email) return undefined;

  return {
    name: readString(object, ['name', 'displayName']) ?? null,
    email,
  };
}

function mapFolder(value: unknown, index: number): GranolaFolder | undefined {
  const object = asObject(value);
  if (!object) return undefined;

  const id = readString(object, ['id']) ?? `folder-${index}`;
  const name = readString(object, ['name']) ?? 'Folder';

  return {
    id,
    object: 'folder',
    name,
  };
}

function readId(value: unknown): string | undefined {
  const object = asObject(value);
  if (!object) return undefined;
  return readString(object, [
    'id',
    'meeting_id',
    'meetingId',
    'note_id',
    'noteId',
  ]);
}

function readString(
  object: Record<string, unknown> | undefined,
  keys: string[]
): string | undefined {
  if (!object) return undefined;
  for (const key of keys) {
    const value = object[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }
  return undefined;
}

function readBoolean(
  object: Record<string, unknown> | undefined,
  keys: string[]
): boolean | undefined {
  if (!object) return undefined;
  for (const key of keys) {
    const value = object[key];
    if (typeof value === 'boolean') return value;
  }
  return undefined;
}

function asObject(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return undefined;
  return value as Record<string, unknown>;
}

function asArray(value: unknown): unknown[] | undefined {
  return Array.isArray(value) ? value : undefined;
}

async function safeReadText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return response.statusText;
  }
}
