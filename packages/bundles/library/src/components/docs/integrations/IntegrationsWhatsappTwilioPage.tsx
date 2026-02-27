import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function IntegrationsWhatsappTwilioPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">WhatsApp Twilio</h1>
        <p className="text-muted-foreground">
          Twilio WhatsApp support provides a durable fallback channel with
          signature verification and outbox-backed outbound dispatch.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Required secrets and config</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`// secret payload
{
  "accountSid": "AC123",
  "authToken": "..."
}

// optional connection config
{
  "fromNumber": "whatsapp:+15550002"
}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Webhook ingress</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Inbound Twilio form payloads are accepted on{' '}
            <code className="bg-background/50 rounded px-2 py-1">
              /webhooks/whatsapp/twilio
            </code>
            .
          </li>
          <li>
            Signatures are validated with{' '}
            <code className="bg-background/50 rounded px-2 py-1">
              x-twilio-signature
            </code>{' '}
            and the configured auth token.
          </li>
          <li>
            For deterministic verification, set the exact public webhook URL in{' '}
            <code className="bg-background/50 rounded px-2 py-1">
              WHATSAPP_TWILIO_WEBHOOK_URL
            </code>
            .
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Workspace mapping</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`CHANNEL_WORKSPACE_MAP_WHATSAPP_TWILIO={"AC123":"workspace-acme"}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Use Twilio as fallback when Meta WhatsApp is your primary route.
          </li>
          <li>Keep account SID mapping explicit to avoid tenant misrouting.</li>
          <li>
            Protect internal dispatch endpoints with
            <code className="bg-background/50 ml-1 rounded px-2 py-1">
              CHANNEL_DISPATCH_TOKEN
            </code>
            .
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/integrations/whatsapp-meta" className="btn-ghost">
          Previous: WhatsApp Meta
        </Link>
        <Link href="/docs/integrations/health-routing" className="btn-primary">
          Next: Health Routing <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
