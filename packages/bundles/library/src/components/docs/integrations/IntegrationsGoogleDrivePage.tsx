import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function IntegrationsGoogleDrivePage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">Google Drive</h1>
				<p className="text-muted-foreground">
					Google Drive is modeled as a storage and knowledge-ingestion provider
					with explicit delta watch state. The contract covers file listing,
					file retrieval, Drive watches, channel/resource expiry, replay
					checkpoints, dedupe, idempotency, and tombstones.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Provider contract</h2>
				<CodeBlock
					language="typescript"
					filename="google-drive-provider.ts"
					code={`interface GoogleDriveProvider {
  listFiles(query?: GoogleDriveListFilesQuery): Promise<GoogleDriveListFilesResult>;
  getFile(fileId: string): Promise<GoogleDriveFile | null>;
  watchChanges?(input: GoogleDriveWatchInput): Promise<GoogleDriveWatchResult>;
}`}
				/>
				<p className="text-muted-foreground text-sm">
					The provider advertises <code>storage.objects</code>,{' '}
					<code>knowledge.ingestion.drive</code>, and{' '}
					<code>provider.delta.watch</code>. Runtime implementations should
					persist returned deltas before acknowledging sync work.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Delta-aware ingestion</h2>
				<CodeBlock
					language="typescript"
					filename="drive-sync.ts"
					code={`await knowledge.syncDriveFiles(
  {
    query: "mimeType = 'text/plain' and trashed = false",
  },
  {
    sourceId: "src_drive_support",
    evidenceRef: "audit://sync/drive/support",
  },
);

await knowledge.watchDriveChanges(
  {
    channelId: "drive-support-watch",
    webhookUrl: "https://app.example.com/webhooks/google-drive",
  },
  { sourceId: "src_drive_support" },
);`}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Production checklist</h2>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
					<li>Persist `ProviderDeltaSyncState` per Drive source.</li>
					<li>Renew webhook channels before `webhookChannel.expiresAt`.</li>
					<li>Skip tombstoned files before indexing or mutating them.</li>
					<li>
						Record replay checkpoint and idempotency evidence for retries.
					</li>
					<li>
						Use mutation governance before changing permissions or sending
						outbound notifications.
					</li>
				</ul>
			</div>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/integrations/gmail" className="btn-ghost">
					Previous: Gmail API
				</Link>
				<Link href="/docs/knowledge/governance" className="btn-primary">
					Knowledge governance <ChevronRight size={16} />
				</Link>
			</div>
		</div>
	);
}
