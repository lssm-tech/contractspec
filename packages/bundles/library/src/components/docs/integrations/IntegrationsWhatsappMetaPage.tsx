import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function IntegrationsWhatsappMetaPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">WhatsApp Meta</h1>
        <p className="text-muted-foreground">
          Meta WhatsApp is the primary WhatsApp channel for ContractSpec's
          messaging runtime, with signed webhook verification and reliable
          outbound delivery.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Required secrets and config</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`// secret payload
{
  "accessToken": "...",
  "appSecret": "...",
  "verifyToken": "..."
}

// required connection config
{
  "phoneNumberId": "120000000001",
  "apiVersion": "v22.0"
}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Webhook endpoints</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Verification challenge:{' '}
            <code className="bg-background/50 rounded px-2 py-1">
              GET /webhooks/whatsapp/meta
            </code>
          </li>
          <li>
            Inbound messages:{' '}
            <code className="bg-background/50 rounded px-2 py-1">
              POST /webhooks/whatsapp/meta
            </code>
          </li>
          <li>
            Signatures are validated with{' '}
            <code className="bg-background/50 rounded px-2 py-1">
              x-hub-signature-256
            </code>
            .
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Workspace mapping</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`CHANNEL_WORKSPACE_MAP_WHATSAPP_META={"120000000001":"workspace-acme"}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>Keep verify and app secrets separate from access tokens.</li>
          <li>
            Map each phone number ID to a workspace for strict tenant routing.
          </li>
          <li>
            Use Twilio WhatsApp only as fallback when you need active-passive
            routing.
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/integrations/github" className="btn-ghost">
          Previous: GitHub Messaging
        </Link>
        <Link href="/docs/integrations/whatsapp-twilio" className="btn-primary">
          Next: WhatsApp Twilio <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
