import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function IntegrationsWhatsappMetaPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">WhatsApp Meta</h1>
				<p className="text-muted-foreground">
					Meta WhatsApp is the primary WhatsApp channel for ContractSpec's
					messaging runtime, with signed webhook verification and reliable
					outbound delivery.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Required secrets and config</h2>
				<div className="overflow-x-auto rounded-lg border border-border bg-background/50 p-4 font-mono text-muted-foreground text-sm">
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
				<h2 className="font-bold text-2xl">Webhook endpoints</h2>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
					<li>
						Verification challenge:{' '}
						<code className="rounded bg-background/50 px-2 py-1">
							GET /webhooks/whatsapp/meta
						</code>
					</li>
					<li>
						Inbound messages:{' '}
						<code className="rounded bg-background/50 px-2 py-1">
							POST /webhooks/whatsapp/meta
						</code>
					</li>
					<li>
						Signatures are validated with{' '}
						<code className="rounded bg-background/50 px-2 py-1">
							x-hub-signature-256
						</code>
						.
					</li>
				</ul>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Workspace mapping</h2>
				<div className="overflow-x-auto rounded-lg border border-border bg-background/50 p-4 font-mono text-muted-foreground text-sm">
					<pre>{`CHANNEL_WORKSPACE_MAP_WHATSAPP_META={"120000000001":"workspace-acme"}`}</pre>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Best practices</h2>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
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
