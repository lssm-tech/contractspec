import { describe, expect, it, vi } from 'bun:test';

import { GranolaMeetingRecorderProvider } from './granola-meeting-recorder';

describe('GranolaMeetingRecorderProvider (MCP transport)', () => {
  it('lists meetings using MCP list_meetings tool', async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            result: {
              structuredContent: {
                meetings: [
                  {
                    id: 'meeting-1',
                    title: 'Planning',
                    owner: { email: 'owner@example.com', name: 'Owner' },
                    created_at: '2026-01-10T10:00:00.000Z',
                  },
                ],
                hasMore: true,
                nextCursor: 'cursor-2',
              },
            },
          })
        )
    );

    const provider = new GranolaMeetingRecorderProvider({
      transport: 'mcp',
      mcpUrl: 'https://mcp.granola.ai/mcp',
      mcpAccessToken: 'token',
      fetchFn: fetchMock as unknown as typeof fetch,
    });

    const result = await provider.listMeetings({
      tenantId: 'tenant-1',
      connectionId: 'conn-1',
      pageSize: 20,
    });

    expect(fetchMock).toHaveBeenCalled();
    expect(result.meetings).toHaveLength(1);
    expect(result.meetings[0]?.id).toBe('meeting-1');
    expect(result.nextCursor).toBe('cursor-2');
    expect(result.hasMore).toBe(true);
  });

  it('fetches transcript using MCP get_meeting_transcript tool', async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            result: {
              structuredContent: {
                transcript: [
                  {
                    speaker: { source: 'Alice' },
                    text: 'Hello team',
                    start_time: '00:00:01',
                    end_time: '00:00:05',
                  },
                ],
              },
            },
          })
        )
    );

    const provider = new GranolaMeetingRecorderProvider({
      transport: 'mcp',
      mcpUrl: 'https://mcp.granola.ai/mcp',
      mcpAccessToken: 'token',
      fetchFn: fetchMock as unknown as typeof fetch,
    });

    const transcript = await provider.getTranscript({
      tenantId: 'tenant-1',
      connectionId: 'conn-1',
      meetingId: 'meeting-1',
    });

    expect(transcript.meetingId).toBe('meeting-1');
    expect(transcript.segments?.[0]?.text).toBe('Hello team');
    expect(transcript.metadata).toMatchObject({
      provider: 'granola',
      transport: 'mcp',
    });
  });
});
