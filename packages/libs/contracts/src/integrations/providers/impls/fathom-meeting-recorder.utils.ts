import type {
  MeetingParticipant,
  MeetingTranscriptSegment,
} from '../meeting-recorder';
import type {
  FathomMeeting,
  FathomMeetingListPage,
  FathomTranscriptSegment,
} from './fathom-meeting-recorder.types';

export function extractItems(page: FathomMeetingListPage): FathomMeeting[] {
  if (Array.isArray(page.items)) return page.items;
  if (Array.isArray((page as { data?: unknown }).data)) {
    return (page as { data: FathomMeeting[] }).data;
  }
  return [];
}

export function extractNextCursor(
  page: FathomMeetingListPage
): string | null | undefined {
  return page.nextCursor ?? page.next_cursor ?? undefined;
}

export function mapInvitee(
  invitee: Record<string, unknown>
): MeetingParticipant | undefined {
  const email = invitee.email as string | undefined;
  const name = invitee.name as string | undefined;
  if (!email && !name) return undefined;
  return {
    email,
    name,
    role: 'attendee',
    isExternal: invitee.is_external as boolean | undefined,
  };
}

export function matchRecordingId(
  meeting: FathomMeeting,
  targetId: number
): boolean {
  return meeting.recordingId === targetId;
}

export function durationSeconds(
  start?: Date | string | null,
  end?: Date | string | null
): number | undefined {
  if (!start || !end) return undefined;
  const startDate = start instanceof Date ? start : new Date(start);
  const endDate = end instanceof Date ? end : new Date(end);
  if (Number.isNaN(startDate.valueOf()) || Number.isNaN(endDate.valueOf())) {
    return undefined;
  }
  return Math.max(0, (endDate.valueOf() - startDate.valueOf()) / 1000);
}

export function mapTranscriptSegment(
  segment: FathomTranscriptSegment,
  index: number
): MeetingTranscriptSegment {
  return {
    index,
    speakerName: segment.speaker?.display_name ?? undefined,
    speakerEmail: segment.speaker?.matched_calendar_invitee_email ?? undefined,
    text: segment.text,
    startTimeMs: parseTimestamp(segment.timestamp),
  };
}

export function parseTimestamp(value: string): number | undefined {
  const parts = value.split(':').map((part) => Number(part));
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    return undefined;
  }
  const [hours = 0, minutes = 0, seconds = 0] = parts;
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

export async function safeReadError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string };
    return data?.message ?? response.statusText;
  } catch {
    return response.statusText;
  }
}
