import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function IntegrationsSlackPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Slack Messaging</h1>
        <p className="text-muted-foreground">
          ContractSpec supports signed Slack event ingestion and outbox-backed
          outbound replies through the channel runtime.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Required secrets and config</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`// secret payload
{
  "botToken": "xoxb-...",
  "signingSecret": "..."
}

// optional connection config
{
  "defaultChannelId": "C0123456789",
  "apiBaseUrl": "https://slack.com/api"
}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Webhook ingress</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Inbound events are accepted on{' '}
            <code className="bg-background/50 rounded px-2 py-1">
              /webhooks/slack/events
            </code>
            .
          </li>
          <li>
            Requests are validated with Slack signatures (
            <code className="bg-background/50 rounded px-2 py-1">
              x-slack-signature
            </code>{' '}
            + timestamp tolerance).
          </li>
          <li>
            Normalized events are deduplicated and persisted before any outbound
            side effects.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Workspace routing and dispatch</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`# Workspace mapping (recommended)
CHANNEL_WORKSPACE_MAP_SLACK={"T123":"workspace-acme"}

# Dispatch protection
CHANNEL_DISPATCH_TOKEN=...

# Optional scheduler
CHANNEL_DISPATCH_INTERVAL_MS=120000
CHANNEL_DISPATCH_RUN_ON_START=1`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Keep bot tokens and signing secrets in a managed secret provider.
          </li>
          <li>Use workspace mapping to prevent cross-tenant event leakage.</li>
          <li>
            Keep dispatch asynchronous so webhook handlers stay fast and
            reliable.
          </li>
          <li>
            Monitor telemetry for ingest, decision, outbox, and dispatch stages.
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/integrations/twilio" className="btn-ghost">
          Previous: Twilio SMS
        </Link>
        <Link href="/docs/integrations/github" className="btn-primary">
          Next: GitHub Messaging <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
