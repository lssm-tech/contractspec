import type { calendar_v3 } from 'googleapis';
import type { AuthClient } from 'google-auth-library';
import { describe, expect, it, vi } from 'vitest';

import { GoogleCalendarProvider } from './google-calendar';

describe('GoogleCalendarProvider', () => {
  it('lists events', async () => {
    const calendar = createMockCalendar();
    const provider = new GoogleCalendarProvider({
      auth: {} as AuthClient,
      calendar,
    });

    const result = await provider.listEvents({
      calendarId: 'primary',
      timeMin: new Date('2024-01-01T00:00:00Z'),
      timeMax: new Date('2024-01-31T00:00:00Z'),
    });

    expect(calendar.events.list).toHaveBeenCalled();
    expect(result.events).toHaveLength(1);
    expect(result.events[0].title).toBe('Planning');
  });

  it('creates events with reminders', async () => {
    const calendar = createMockCalendar();
    const provider = new GoogleCalendarProvider({
      auth: {} as AuthClient,
      calendar,
    });

    const event = await provider.createEvent({
      calendarId: 'primary',
      title: 'Planning',
      start: new Date('2024-01-01T10:00:00Z'),
      end: new Date('2024-01-01T11:00:00Z'),
      attendees: [{ email: 'user@example.com' }],
      reminders: [{ method: 'email', minutesBeforeStart: 30 }],
    });

    expect(calendar.events.insert).toHaveBeenCalled();
    expect(event.title).toBe('Planning');
  });

  it('updates events', async () => {
    const calendar = createMockCalendar();
    const provider = new GoogleCalendarProvider({
      auth: {} as AuthClient,
      calendar,
    });

    const event = await provider.updateEvent('primary', 'event-1', {
      title: 'Updated',
    });

    expect(calendar.events.patch).toHaveBeenCalledWith(
      expect.objectContaining({
        calendarId: 'primary',
        eventId: 'event-1',
      })
    );
    expect(event.title).toBe('Planning');
  });

  it('deletes events', async () => {
    const calendar = createMockCalendar();
    const provider = new GoogleCalendarProvider({
      auth: {} as AuthClient,
      calendar,
    });

    await provider.deleteEvent('primary', 'event-1');
    expect(calendar.events.delete).toHaveBeenCalledWith({
      calendarId: 'primary',
      eventId: 'event-1',
    });
  });
});

function createMockCalendar() {
  const event: calendar_v3.Schema$Event = {
    id: 'event-1',
    summary: 'Planning',
    start: { dateTime: '2024-01-01T10:00:00Z' },
    end: { dateTime: '2024-01-01T11:00:00Z' },
  };
  return {
    events: {
      list: vi.fn(async () => ({
        data: { items: [event] },
      })),
      insert: vi.fn(async () => ({
        data: event,
      })),
      patch: vi.fn(async () => ({
        data: event,
      })),
      delete: vi.fn(async () => ({})),
    },
  } as unknown as calendar_v3.Calendar;
}


