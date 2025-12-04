import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Gmail API Integration: ContractSpec Docs',
//   description:
//     'Process inbound emails and manage threads with Gmail API in ContractSpec.',
// };

export default function GmailIntegrationPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Gmail API</h1>
        <p className="text-muted-foreground">
          The Gmail API integration allows you to read inbound emails, manage
          threads, and build email-based workflows. Perfect for support tickets,
          email parsing, and automated responses.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Setup</h2>
        <p className="text-muted-foreground">
          Configure OAuth 2.0 credentials in Google Cloud Console:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`# .env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://your-app.com/auth/google/callback`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Reading emails</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`capabilityId: gmail-list-messages
provider:
  type: gmail
  operation: listMessages

inputs:
  query:
    type: string
    description: "Gmail search query"
  maxResults:
    type: number
    default: 10

outputs:
  messages:
    type: array
    items:
      type: object
      properties:
        id: string
        threadId: string
        snippet: string`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Use cases</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>Parse support emails and create tickets</li>
          <li>Extract attachments and process them</li>
          <li>Build email-to-task workflows</li>
          <li>Monitor specific email threads</li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/integrations/resend" className="btn-ghost">
          Previous: Resend
        </Link>
        <Link href="/docs/integrations/google-calendar" className="btn-primary">
          Next: Google Calendar <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
