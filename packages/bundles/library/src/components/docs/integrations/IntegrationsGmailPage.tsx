import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Gmail API Integration: ContractSpec Docs',
//   description:
//     'Process inbound emails and manage threads with Gmail API in ContractSpec.',
// };

export function IntegrationsGmailPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">Gmail API</h1>
				<p className="text-muted-foreground">
					The Gmail API integration allows you to read inbound emails, manage
					threads, and build email-based workflows. Perfect for support tickets,
					email parsing, and automated responses.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Setup</h2>
				<p className="text-muted-foreground">
					Configure OAuth 2.0 credentials in Google Cloud Console:
				</p>
				<div className="overflow-x-auto rounded-lg border border-border bg-background/50 p-4 font-mono text-muted-foreground text-sm">
					<pre>{`# .env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://your-app.com/auth/google/callback`}</pre>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Reading emails</h2>
				<div className="overflow-x-auto rounded-lg border border-border bg-background/50 p-4 font-mono text-muted-foreground text-sm">
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
				<h2 className="font-bold text-2xl">Use cases</h2>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
					<li>Parse support emails and create tickets</li>
					<li>Extract attachments and process them</li>
					<li>Build email-to-task workflows</li>
					<li>Monitor specific email threads</li>
					<li>Sync threads into governed knowledge spaces with checkpointed deltas</li>
				</ul>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Knowledge sync and mutation gates</h2>
				<p className="text-muted-foreground">
					Gmail supports the shared <code>provider.delta.watch</code>{' '}
					capability. Knowledge runtimes should persist provider cursor,
					watermark, dedupe, idempotency, replay, and tombstone state before
					acknowledging sync work. Outbound email sends should pass through
					knowledge mutation governance so dry-runs, approvals, audit evidence,
					and outbound-send gates are recorded.
				</p>
				<div className="flex flex-wrap gap-3">
					<Link href="/docs/guides/provider-backed-knowledge" className="btn-ghost">
						Provider-backed knowledge guide
					</Link>
					<Link href="/docs/knowledge/governance" className="btn-ghost">
						Mutation governance
					</Link>
				</div>
			</div>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/integrations/resend" className="btn-ghost">
					Previous: Resend
				</Link>
				<Link href="/docs/integrations/google-drive" className="btn-primary">
					Next: Google Drive <ChevronRight size={16} />
				</Link>
			</div>
		</div>
	);
}
