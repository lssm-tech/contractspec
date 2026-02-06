import { google } from 'googleapis';
import { GoogleCalendarProvider } from '@contractspec/integration.providers-impls/impls/google-calendar';
import type {
  CalendarEvent,
  CalendarEventInput,
  CalendarListEventsQuery,
  CalendarProvider,
} from '@contractspec/integration.providers-impls/calendar';

export type CalendarSyncOutput = {
  created?: CalendarEvent | CalendarEventInput;
  upcoming: CalendarEvent[] | CalendarEventInput[];
};

export async function runCalendarSyncFromEnv(): Promise<CalendarSyncOutput> {
  const calendarId = resolveCalendarId();
  const dryRun = process.env.CONTRACTSPEC_CALENDAR_DRY_RUN === 'true';
  const eventInput = buildSampleEvent(calendarId);
  const listQuery = buildUpcomingQuery(calendarId);

  if (dryRun) {
    return { created: eventInput, upcoming: [eventInput] };
  }

  const provider = createProviderFromEnv(calendarId);
  const created = await provider.createEvent(eventInput);
  const upcoming = await provider.listEvents(listQuery);
  return { created, upcoming: upcoming.events };
}

export function buildSampleEvent(calendarId: string): CalendarEventInput {
  const start = new Date();
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  return {
    calendarId,
    title: 'Product sync review',
    description: 'Review onboarding friction and sync action items.',
    location: 'Zoom',
    start,
    end,
    conference: { create: true, type: 'google_meet' },
    attendees: [{ email: 'teammate@example.com', name: 'Teammate' }],
    reminders: [{ method: 'popup', minutesBeforeStart: 10 }],
    metadata: { source: 'contractspec-example' },
  };
}

export function buildUpcomingQuery(
  calendarId: string
): CalendarListEventsQuery {
  const now = new Date();
  const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return {
    calendarId,
    timeMin: now,
    timeMax: inSevenDays,
    maxResults: 5,
  };
}

export function createProviderFromEnv(calendarId: string): CalendarProvider {
  const auth = createGoogleAuthFromEnv();
  return new GoogleCalendarProvider({ auth, calendarId });
}

function createGoogleAuthFromEnv() {
  const clientId = requireEnv('GOOGLE_CLIENT_ID');
  const clientSecret = requireEnv('GOOGLE_CLIENT_SECRET');
  const refreshToken = requireEnv('GOOGLE_REFRESH_TOKEN');
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ??
    'https://developers.google.com/oauthplayground';
  const oauth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  oauth.setCredentials({ refresh_token: refreshToken });
  return oauth;
}

function resolveCalendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID ?? 'primary';
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(buildMissingEnvMessage(key));
  }
  return value;
}

function buildMissingEnvMessage(key: string): string {
  if (key !== 'GOOGLE_REFRESH_TOKEN') {
    return `Missing required env var: ${key}`;
  }
  return [
    `Missing required env var: ${key}`,
    'Get a refresh token with OAuth Playground:',
    '1) Open https://developers.google.com/oauthplayground',
    '2) Click the gear icon and enable "Use your own OAuth credentials"',
    '3) Enter GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET',
    '4) Authorize scope https://www.googleapis.com/auth/calendar',
    '5) Exchange for tokens and copy the refresh token',
    'Then export GOOGLE_REFRESH_TOKEN and rerun the script.',
  ].join('\n');
}
