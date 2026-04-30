import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

const evidenceChecklist = [
	'ProviderDeltaSyncState persisted for each source after sync or watch renewal.',
	'Tombstoned provider records are skipped before indexing or mutation.',
	'Outbound mutations carry dry-run, approval, idempotency, audit, and send-gate evidence.',
	'Connect adoption resolves existing knowledge and integration surfaces before new runtime code is added.',
];

export function GuideProviderBackedKnowledgePage() {
	return (
		<div className="space-y-8">
			<div className="space-y-3">
				<h1 className="font-bold text-4xl">Adopt provider-backed knowledge</h1>
				<p className="text-lg text-muted-foreground">
					Turn Gmail and Google Drive into queryable knowledge without hiding
					provider state, webhook expiry, or mutation risk in background jobs.
					The contract layer models the source, the integration layer models
					provider deltas, and the knowledge runtime owns ingestion/query
					orchestration.
				</p>
			</div>

			<div className="card-subtle space-y-4 p-6">
				<h2 className="font-bold text-2xl">What you&apos;ll build</h2>
				<ul className="space-y-2 text-muted-foreground text-sm">
					<li>Gmail and Drive sources bound to explicit knowledge spaces.</li>
					<li>
						A checkpoint store for leases, cursors, webhook channel expiry, and
						replay evidence.
					</li>
					<li>
						A mutation gate that blocks unsafe external sends or provider
						writes.
					</li>
					<li>
						Connect adoption evidence proving you reused the existing
						ContractSpec surfaces before adding custom provider code.
					</li>
				</ul>
			</div>

			<div className="space-y-6">
				<section className="space-y-3">
					<h2 className="font-bold text-2xl">
						1) Start from specs and sources
					</h2>
					<p className="text-muted-foreground text-sm">
						Define the knowledge space and source binding before runtime sync.
						Provider credentials stay in integration connections; source config
						stores only identity, scope, and replayable sync state.
					</p>
					<CodeBlock
						language="typescript"
						filename="knowledge-source.ts"
						code={`const source = {
  meta: {
    id: "src_drive_support",
    tenantId: "tenant-acme",
    integrationConnectionId: "conn_google_drive",
    spaceKey: "knowledge.support-faq",
    spaceVersion: "1.0.0",
    label: "Support Drive",
    sourceType: "google_drive",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  syncState: {
    cursorId: "drive-start-page-token",
    watermarkVersion: "drive-v1",
    lease: {
      holder: "knowledge-sync-worker",
      expiresAt: new Date(Date.now() + 5 * 60_000),
      renewalWindowMs: 60_000,
    },
  },
  config: {
    query: "mimeType = 'text/plain' and trashed = false",
  },
};`}
					/>
				</section>

				<section className="space-y-3">
					<h2 className="font-bold text-2xl">
						2) Sync with checkpoints, not blind polling
					</h2>
					<p className="text-muted-foreground text-sm">
						`KnowledgeRuntime` can load a stored provider delta before listing
						Gmail or Drive, then save the next checkpoint after indexing. The
						store can be a database table, workflow state, or Connect-backed
						replay artifact.
					</p>
					<CodeBlock
						language="typescript"
						filename="knowledge-runtime.ts"
						code={`const knowledge = createKnowledgeRuntime({
  collection: "knowledge-support",
  namespace: "tenant-acme",
  embeddings,
  vectorStore,
  gmail,
  drive,
  deltaCheckpointStore,
});

await knowledge.syncGmail(
  { label: "support" },
  { sourceId: "src_gmail_support", evidenceRef: "audit://sync/gmail" },
);

await knowledge.syncDriveFiles(
  { query: "mimeType = 'text/plain' and trashed = false" },
  { sourceId: "src_drive_support", evidenceRef: "audit://sync/drive" },
);

await knowledge.watchDriveChanges(
  {
    channelId: "drive-watch-support",
    webhookUrl: "https://app.example.com/webhooks/google-drive",
  },
  { sourceId: "src_drive_support" },
);`}
					/>
				</section>

				<section className="space-y-3">
					<h2 className="font-bold text-2xl">
						3) Gate mutations before provider writes
					</h2>
					<p className="text-muted-foreground text-sm">
						External sends and provider mutations should produce a decision
						envelope whether they execute, block, or run as dry-run. Persist
						that envelope with the same audit trail as the provider checkpoint.
					</p>
					<CodeBlock
						language="typescript"
						filename="governed-mutation.ts"
						code={`const result = await knowledge.runGovernedMutation(
  {
    operation: "gmail.message.send",
    sourceId: "src_gmail_support",
    requiresApproval: true,
    outboundSend: true,
    governance: {
      idempotencyKey: "tenant:gmail-send:123",
      auditEvidence: { evidenceRef: "audit://gmail-send/123" },
      approvalRefs: [{ id: "approval-123" }],
      outboundSendGate: {
        status: "approved",
        evidenceRef: "gate://gmail-send/123",
      },
    },
  },
  () => gmail.sendEmail(message),
  { audit: (envelope) => auditTrail.write(envelope) },
);`}
					/>
				</section>

				<section className="card-subtle space-y-3 p-6">
					<h2 className="font-bold text-2xl">4) Adoption evidence</h2>
					<ul className="space-y-2 text-muted-foreground text-sm">
						{evidenceChecklist.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<CodeBlock
						language="bash"
						filename="connect-adoption"
						code={`contractspec connect adoption sync --json

printf '{"goal":"Wire provider-backed knowledge for Gmail and Drive"}' | \\
  contractspec connect adoption resolve --family knowledge --stdin --json`}
					/>
				</section>
			</div>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/knowledge/sources" className="btn-ghost">
					Knowledge sources
				</Link>
				<Link href="/docs/integrations/google-drive" className="btn-primary">
					Google Drive integration <ChevronRight size={16} />
				</Link>
			</div>
		</div>
	);
}
