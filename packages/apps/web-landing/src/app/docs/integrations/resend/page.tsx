import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Resend Integration: ContractSpec Docs',
//   description:
//     "Send transactional emails with Resend's modern API in ContractSpec.",
// };

export default function ResendIntegrationPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Resend</h1>
        <p className="text-muted-foreground">
          Resend is a modern email API built for developers. It provides a
          simple, reliable way to send transactional emails with React Email
          templates.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Setup</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`# .env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@resend.dev`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Sending emails</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`capabilityId: resend-send-email
provider:
  type: resend
  operation: sendEmail

inputs:
  to:
    type: string
  subject:
    type: string
  html:
    type: string
  text:
    type: string
    optional: true
  replyTo:
    type: string
    optional: true

outputs:
  id:
    type: string`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>Use React Email for type-safe templates</li>
          <li>Verify your domain for better deliverability</li>
          <li>Monitor email analytics in the Resend dashboard</li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/integrations/postmark" className="btn-ghost">
          Previous: Postmark
        </Link>
        <Link href="/docs/integrations/gmail" className="btn-primary">
          Next: Gmail API <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
