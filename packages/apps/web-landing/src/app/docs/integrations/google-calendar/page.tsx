import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Google Calendar Integration: ContractSpec Docs',
//   description:
//     'Schedule events and manage calendars with Google Calendar API in ContractSpec.',
// };

export default function GoogleCalendarIntegrationPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Google Calendar</h1>
        <p className="text-muted-foreground">
          Integrate Google Calendar to schedule appointments, manage
          availability, and sync events with your application.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Setup</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`# .env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALENDAR_ID=primary`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Creating events</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`capabilityId: calendar-create-event
provider:
  type: google-calendar
  operation: createEvent

inputs:
  summary:
    type: string
  description:
    type: string
    optional: true
  startTime:
    type: timestamp
  endTime:
    type: timestamp
  attendees:
    type: array
    items:
      type: string

outputs:
  eventId:
    type: string
  htmlLink:
    type: string`}</pre>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/integrations/gmail" className="btn-ghost">
          Previous: Gmail API
        </Link>
        <Link href="/docs/integrations/openai" className="btn-primary">
          Next: OpenAI <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
