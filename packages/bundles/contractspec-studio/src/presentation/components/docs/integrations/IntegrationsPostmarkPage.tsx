import Link from '@lssm/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Postmark Integration: ContractSpec Docs',
//   description:
//     'Send transactional emails with high deliverability using Postmark in ContractSpec.',
// };

export function IntegrationsPostmarkPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Postmark</h1>
        <p className="text-muted-foreground">
          Postmark is a transactional email service with industry-leading
          deliverability. Use it to send order confirmations, password resets,
          notifications, and other critical emails.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Setup</h2>
        <p className="text-muted-foreground">
          Add your Postmark credentials to your environment variables:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`# .env
POSTMARK_API_TOKEN=...
POSTMARK_FROM_EMAIL=noreply@example.com
POSTMARK_FROM_NAME="Your App Name"`}</pre>
        </div>
        <p className="text-muted-foreground text-sm">
          Get your API token from the{' '}
          <a
            href="https://account.postmarkapp.com/servers"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:text-violet-300"
          >
            Postmark Dashboard
          </a>
          .
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Sending emails</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`capabilityId: send-email
provider:
  type: postmark
  operation: sendEmail

inputs:
  to:
    type: string
    description: "Recipient email address"
  subject:
    type: string
  htmlBody:
    type: string
    optional: true
  textBody:
    type: string
    optional: true
  templateId:
    type: string
    optional: true
  templateData:
    type: object
    optional: true

outputs:
  messageId:
    type: string
  submittedAt:
    type: timestamp`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Using templates</h2>
        <p className="text-muted-foreground">
          Postmark templates allow you to design emails in their dashboard and
          populate them with data:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`capabilityId: send-welcome-email
provider:
  type: postmark
  operation: sendEmail

inputs:
  to:
    type: string
  userName:
    type: string

config:
  templateId: "welcome-email"
  templateData:
    user_name: \$\{input.userName\}
    login_url: "https://app.example.com/login"`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Webhooks</h2>
        <p className="text-muted-foreground">
          Postmark can notify your app about delivery, bounces, and opens:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`https://your-app.com/api/webhooks/postmark`}</pre>
        </div>
        <p className="text-muted-foreground">
          ContractSpec automatically processes these webhook events:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Delivery</strong> – Email was successfully delivered
          </li>
          <li>
            <strong>Bounce</strong> – Email bounced (hard or soft)
          </li>
          <li>
            <strong>SpamComplaint</strong> – Recipient marked email as spam
          </li>
          <li>
            <strong>Open</strong> – Recipient opened the email
          </li>
          <li>
            <strong>Click</strong> – Recipient clicked a link
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>Use templates for consistent branding</li>
          <li>Always provide both HTML and plain text versions</li>
          <li>Monitor bounce rates and remove invalid addresses</li>
          <li>Use message streams to separate different email types</li>
          <li>Test emails in the Postmark sandbox before going live</li>
          <li>Set up DKIM and SPF records for your domain</li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/integrations/stripe" className="btn-ghost">
          Previous: Stripe
        </Link>
        <Link href="/docs/integrations/resend" className="btn-primary">
          Next: Resend <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
