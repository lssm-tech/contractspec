import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function IntegrationsGithubPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">GitHub Messaging</h1>
				<p className="text-muted-foreground">
					Use GitHub issue and pull request comments as an AI-native messaging
					channel with webhook verification, policy checks, and reliable
					outbound dispatch.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Required secrets and config</h2>
				<div className="overflow-x-auto rounded-lg border border-border bg-background/50 p-4 font-mono text-muted-foreground text-sm">
					<pre>{`// secret payload
{
  "token": "ghp_...",
  "webhookSecret": "..."
}

// optional connection config
{
  "defaultOwner": "lssm-tech",
  "defaultRepo": "contractspec",
  "apiBaseUrl": "https://api.github.com"
}`}</pre>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Webhook ingress</h2>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
					<li>
						Inbound GitHub events are accepted on{' '}
						<code className="rounded bg-background/50 px-2 py-1">
							/webhooks/github/events
						</code>
						.
					</li>
					<li>
						Signatures are checked using{' '}
						<code className="rounded bg-background/50 px-2 py-1">
							x-hub-signature-256
						</code>{' '}
						and the configured webhook secret.
					</li>
					<li>
						Current normalization focuses on issue comment workflows and durable
						comment dispatch.
					</li>
				</ul>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Workspace mapping</h2>
				<div className="overflow-x-auto rounded-lg border border-border bg-background/50 p-4 font-mono text-muted-foreground text-sm">
					<pre>{`CHANNEL_WORKSPACE_MAP_GITHUB={"lssm-tech/contractspec":"workspace-acme"}

# Optional dev fallback (off by default)
CHANNEL_ALLOW_UNMAPPED_WORKSPACE=0`}</pre>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Best practices</h2>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
					<li>Use a least-privileged token scoped for comment operations.</li>
					<li>
						Route repositories explicitly with workspace maps in multi-tenant
						environments.
					</li>
					<li>Keep dispatch endpoints protected with token or bearer auth.</li>
				</ul>
			</div>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/integrations/slack" className="btn-ghost">
					Previous: Slack Messaging
				</Link>
				<Link href="/docs/integrations/whatsapp-meta" className="btn-primary">
					Next: WhatsApp Meta <ChevronRight size={16} />
				</Link>
			</div>
		</div>
	);
}
