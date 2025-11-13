export interface CalendarAttendee {
  email: string;
  name?: string;
  optional?: boolean;
  responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
}

export interface CalendarReminder {
  method: 'email' | 'popup';
  minutesBeforeStart: number;
}

export interface CalendarEvent {
  id: string;
  calendarId: string;
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  attendees?: CalendarAttendee[];
  reminders?: CalendarReminder[];
  conferenceLink?: string;
  metadata?: Record<string, string>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CalendarEventInput {
  calendarId: string;
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  attendees?: CalendarAttendee[];
  reminders?: CalendarReminder[];
  conference?: {
    create: boolean;
    type?: 'google_meet' | 'zoom' | 'custom';
  };
  metadata?: Record<string, string>;
}

export interface CalendarEventUpdateInput {
  title?: string;
  description?: string;
  location?: string;
  start?: Date;
  end?: Date;
  allDay?: boolean;
  attendees?: CalendarAttendee[];
  reminders?: CalendarReminder[];
  conference?: {
    create?: boolean;
    type?: 'google_meet' | 'zoom' | 'custom';
  };
  metadata?: Record<string, string>;
}

export interface CalendarListEventsQuery {
  calendarId: string;
  timeMin?: Date;
  timeMax?: Date;
  maxResults?: number;
  pageToken?: string;
  includeCancelled?: boolean;
}

export interface CalendarListEventsResult {
  events: CalendarEvent[];
  nextPageToken?: string;
}

export interface CalendarProvider {
  listEvents(query: CalendarListEventsQuery): Promise<CalendarListEventsResult>;
  createEvent(input: CalendarEventInput): Promise<CalendarEvent>;
  updateEvent(
    calendarId: string,
    eventId: string,
    input: CalendarEventUpdateInput
  ): Promise<CalendarEvent>;
  deleteEvent(calendarId: string, eventId: string): Promise<void>;
}


