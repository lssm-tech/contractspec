import { google, type calendar_v3 } from 'googleapis';

import type {
  CalendarEvent,
  CalendarEventInput,
  CalendarEventUpdateInput,
  CalendarListEventsQuery,
  CalendarListEventsResult,
  CalendarProvider,
} from '../calendar';

export interface GoogleCalendarProviderOptions {
  auth: calendar_v3.Options['auth'];
  calendar?: calendar_v3.Calendar;
  calendarId?: string;
}

export class GoogleCalendarProvider implements CalendarProvider {
  private readonly calendar: calendar_v3.Calendar;
  private readonly defaultCalendarId: string;
  private readonly auth: calendar_v3.Options['auth'];

  constructor(options: GoogleCalendarProviderOptions) {
    this.auth = options.auth;
    this.calendar =
      options.calendar ??
      google.calendar({
        version: 'v3',
        auth: options.auth,
      });
    this.defaultCalendarId = options.calendarId ?? 'primary';
  }

  async listEvents(
    query: CalendarListEventsQuery
  ): Promise<CalendarListEventsResult> {
    const response = await this.calendar.events.list({
      calendarId: query.calendarId ?? this.defaultCalendarId,
      timeMin: query.timeMin?.toISOString(),
      timeMax: query.timeMax?.toISOString(),
      maxResults: query.maxResults,
      pageToken: query.pageToken,
      singleEvents: true,
      orderBy: 'startTime',
      auth: this.auth,
    });

    const events =
      response.data.items?.map((item) =>
        this.fromGoogleEvent(query.calendarId ?? this.defaultCalendarId, item)
      ) ?? [];

    return {
      events,
      nextPageToken: response.data.nextPageToken ?? undefined,
    };
  }

  async createEvent(input: CalendarEventInput): Promise<CalendarEvent> {
    const calendarId = input.calendarId ?? this.defaultCalendarId;
    const response = await this.calendar.events.insert({
      calendarId,
      requestBody: this.toGoogleEvent(input),
      conferenceDataVersion: input.conference?.create ? 1 : undefined,
      auth: this.auth,
    });
    return this.fromGoogleEvent(calendarId, response.data);
  }

  async updateEvent(
    calendarId: string,
    eventId: string,
    input: CalendarEventUpdateInput
  ): Promise<CalendarEvent> {
    const response = await this.calendar.events.patch({
      calendarId: calendarId ?? this.defaultCalendarId,
      eventId,
      requestBody: this.toGoogleEvent(input),
      conferenceDataVersion: input.conference?.create ? 1 : undefined,
      auth: this.auth,
    });
    return this.fromGoogleEvent(calendarId, response.data);
  }

  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    await this.calendar.events.delete({
      calendarId: calendarId ?? this.defaultCalendarId,
      eventId,
      auth: this.auth,
    });
  }

  private fromGoogleEvent(
    calendarId: string,
    event: calendar_v3.Schema$Event
  ): CalendarEvent {
    const start = parseDateTime(event.start);
    const end = parseDateTime(event.end);
    const attendees =
      event.attendees?.map((attendee) => ({
        email: attendee.email ?? '',
        name: attendee.displayName ?? undefined,
        optional: attendee.optional ?? undefined,
        responseStatus: normalizeResponseStatus(attendee.responseStatus),
      })) ?? [];
    const reminders =
      event.reminders?.overrides?.map((reminder) => ({
        method: (reminder.method as 'email' | 'popup') ?? 'popup',
        minutesBeforeStart: reminder.minutes ?? 0,
      })) ?? [];
    const metadata = buildMetadata(event);
    return {
      id: event.id ?? '',
      calendarId,
      title: event.summary ?? '',
      description: event.description ?? undefined,
      location: event.location ?? undefined,
      start,
      end,
      allDay: event.start?.date ? true : undefined,
      attendees,
      reminders,
      conferenceLink:
        event.hangoutLink ??
        event.conferenceData?.entryPoints?.find((entry) => entry.uri)?.uri ??
        undefined,
      metadata,
      createdAt: event.created ? new Date(event.created) : undefined,
      updatedAt: event.updated ? new Date(event.updated) : undefined,
    };
  }

  private toGoogleEvent(
    input: CalendarEventInput | CalendarEventUpdateInput
  ): calendar_v3.Schema$Event {
    const event: calendar_v3.Schema$Event = {};
    if ('title' in input && input.title) event.summary = input.title;
    if (input.description !== undefined) event.description = input.description;
    if (input.location !== undefined) event.location = input.location;
    if (input.start) {
      event.start = formatDateTime(input.start, input.allDay);
    }
    if (input.end) {
      event.end = formatDateTime(input.end, input.allDay);
    }
    if (input.attendees) {
      event.attendees = input.attendees.map((attendee) => ({
        email: attendee.email,
        displayName: attendee.name,
        optional: attendee.optional,
        responseStatus: attendee.responseStatus,
      }));
    }
    if (input.reminders) {
      event.reminders = {
        useDefault: false,
        overrides: input.reminders.map((reminder) => ({
          method: reminder.method,
          minutes: reminder.minutesBeforeStart,
        })),
      };
    }
    if (input.conference?.create) {
      event.conferenceData = {
        createRequest: {
          requestId: `conf-${Date.now()}`,
        },
      };
    }
    if (input.metadata) {
      event.extendedProperties = {
        ...(event.extendedProperties ?? {}),
        private: {
          ...(event.extendedProperties?.private ?? {}),
          ...input.metadata,
        },
      };
    }
    return event;
  }
}

function parseDateTime(time?: calendar_v3.Schema$EventDateTime | null): Date {
  if (!time) return new Date();
  if (time.dateTime) return new Date(time.dateTime);
  if (time.date) return new Date(`${time.date}T00:00:00`);
  return new Date();
}

function formatDateTime(
  date: Date,
  allDay?: boolean
): calendar_v3.Schema$EventDateTime {
  if (allDay) {
    return { date: date.toISOString().slice(0, 10) };
  }
  return { dateTime: date.toISOString() };
}

type CalendarResponseStatus =
  | 'needsAction'
  | 'declined'
  | 'tentative'
  | 'accepted';

function normalizeResponseStatus(
  status?: string | null
): CalendarResponseStatus | undefined {
  if (!status) return undefined;
  const allowed: CalendarResponseStatus[] = [
    'needsAction',
    'declined',
    'tentative',
    'accepted',
  ];
  return allowed.includes(status as CalendarResponseStatus)
    ? (status as CalendarResponseStatus)
    : undefined;
}

function buildMetadata(
  event: calendar_v3.Schema$Event
): Record<string, string> | undefined {
  const metadata: Record<string, string> = {};
  if (event.status) metadata.status = event.status;
  if (event.htmlLink) metadata.htmlLink = event.htmlLink;
  if (event.iCalUID) metadata.iCalUID = event.iCalUID;
  if (event.etag) metadata.etag = event.etag;
  if (event.conferenceData?.conferenceSolution?.name) {
    metadata.conferenceSolution = event.conferenceData.conferenceSolution.name;
  }
  if (event.extendedProperties?.private) {
    Object.entries(event.extendedProperties.private).forEach(([key, value]) => {
      if (typeof value === 'string') {
        metadata[`extended.${key}`] = value;
      }
    });
  }
  return Object.keys(metadata).length > 0 ? metadata : undefined;
}
