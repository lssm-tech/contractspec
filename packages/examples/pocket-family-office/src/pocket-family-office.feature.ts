/**
 * Pocket Family Office Feature Module Specification
 *
 * Defines the feature module for personal finance automation.
 */

/**
 * Pocket Family Office feature module that bundles financial document
 * management, open banking integration, and automated summaries.
 */
import type { DocBlock } from '@contractspec/lib.contracts-spec';
import { defineFeature } from '@contractspec/lib.contracts-spec';
export const PocketFamilyOfficeFeature = defineFeature({
	meta: {
		key: 'pocket-family-office',
		version: '1.0.0',
		title: 'Pocket Family Office',
		description:
			'Personal finance automation with document ingestion, open banking, and AI summaries',
		domain: 'finance',
		owners: ['@platform.finance'],
		tags: [
			'finance',
			'open-banking',
			'documents',
			'automation',
			'family-office',
		],
		stability: 'experimental',
	},

	// All contract operations included in this feature
	operations: [
		{ key: 'pfo.documents.upload', version: '1.0.0' },
		{ key: 'pfo.reminders.schedule-payment', version: '1.0.0' },
		{ key: 'pfo.summary.generate', version: '1.0.0' },
		{ key: 'pfo.email.sync-threads', version: '1.0.0' },
		{ key: 'pfo.summary.dispatch', version: '1.0.0' },
		{ key: 'pfo.openbanking.generate-overview', version: '1.0.0' },
	],

	// No events defined separately for this feature
	events: [],

	// No presentations for this example feature
	presentations: [],
	opToPresentation: [],
	presentationsTargets: [],

	// Capability definitions
	capabilities: {
		provides: [{ key: 'pocket-family-office', version: '1.0.0' }],
		requires: [
			{ key: 'identity', version: '1.0.0' },
			{ key: 'openbanking', version: '1.0.0' },
		],
	},

	workflows: [
		{ key: 'pfo.workflow.sync-openbanking-accounts', version: '1.0.0' },
		{ key: 'pfo.workflow.sync-openbanking-transactions', version: '1.0.0' },
		{ key: 'pfo.workflow.refresh-openbanking-balances', version: '1.0.0' },
		{ key: 'pfo.workflow.generate-openbanking-overview', version: '1.0.0' },
		{ key: 'pfo.workflow.process-uploaded-document', version: '1.0.0' },
		{ key: 'pfo.workflow.upcoming-payments-reminder', version: '1.0.0' },
		{ key: 'pfo.workflow.generate-financial-summary', version: '1.0.0' },
		{ key: 'pfo.workflow.ingest-email-threads', version: '1.0.0' },
	],

	knowledge: [
		{ key: 'knowledge.financial-docs', version: '1.0.0' },
		{ key: 'knowledge.email-threads', version: '1.0.0' },
		{ key: 'knowledge.financial-overview', version: '1.0.0' },
	],

	telemetry: [{ key: 'pfo.telemetry', version: '1.0.0' }],

	policies: [{ key: 'pfo.policy.tenancy', version: '1.0.0' }],

	integrations: [
		{ key: 'pfo.integration.openbanking', version: '1.0.0' },
		{ key: 'pfo.integration.llm', version: '1.0.0' },
	],

	jobs: [
		{ key: 'pfo.job.doc-processing', version: '1.0.0' },
		{ key: 'pfo.job.reminder-dispatch', version: '1.0.0' },
	],

	docs: [
		'docs.examples.pocket-family-office.goal',
		'docs.examples.pocket-family-office.usage',
		'docs.examples.pocket-family-office.reference',
	],
});

export const tech_contracts_vertical_pocket_family_office_DocBlocks: DocBlock[] =
	[
		{
			id: 'docs.tech.contracts.vertical-pocket-family-office',
			title: 'Pocket Family Office Vertical',
			summary: 'Pocket Family Office is a ContractSpec reference vertical that',
			kind: 'reference',
			visibility: 'public',
			route: '/docs/tech/contracts/vertical-pocket-family-office',
			tags: ['tech', 'contracts', 'vertical-pocket-family-office'],
			body: `# Pocket Family Office Vertical

Pocket Family Office is a ContractSpec reference vertical that
demonstrates finance automation atop the integration and knowledge
layers. It is optimised for the hackathon stack (Google Cloud, Mistral,
Qdrant, ElevenLabs) while remaining provider-agnostic.

## Goals

- Ingest household financial documents (uploads + Gmail threads).
- Generate AI summaries and optionally deliver them as voice notes.
- Schedule multi-channel reminders for upcoming bills.
- Showcase spec-first composition of integrations, knowledge spaces, and
  workflows.

## Blueprint Overview

Source: \`packages/examples/pocket-family-office/blueprint.ts\`

- **Integration slots**
  - \`primaryLLM\` \u2192 Mistral chat/embeddings
  - \`primaryVectorDb\` \u2192 Qdrant
  - \`primaryStorage\` \u2192 Google Cloud Storage
  - \`primaryOpenBanking\` \u2192 Powens BYOK project for account aggregation
  - \`emailInbound\` / \`emailOutbound\` \u2192 Gmail + Postmark
  - \`calendarScheduling\` \u2192 Google Calendar
  - \`voicePlayback\` \u2192 ElevenLabs (optional)
  - \`smsNotifications\` \u2192 Twilio (optional)
  - \`paymentsProcessing\` \u2192 Stripe (optional)
- **Workflows**
  - \`process-uploaded-document\`
  - \`upcoming-payments-reminder\`
  - \`generate-financial-summary\`
  - \`ingest-email-threads\`
  - \`sync-openbanking-accounts\`
  - \`sync-openbanking-transactions\`
  - \`refresh-openbanking-balances\`
  - \`generate-openbanking-overview\`
- **Policies/Telemetry** \u2013 references tenant policy specs and
  \`pfo.telemetry\` for observability.

## Tenant Sample

\`tenant.sample.ts\` binds each slot to sample connections defined in
\`connections/samples.ts\`. Key details:

- Uses Google Cloud Secret Manager URIs for all credentials.
- Enables knowledge spaces \`knowledge.financial-docs\` and
  \`knowledge.email-threads\`, plus the derived summaries space
  \`knowledge.financial-overview\` populated by open banking workflows.
- Keeps \`voicePlayback\` and \`paymentsProcessing\` optional so tenants can
  enable them incrementally.

## Contracts

\`contracts/index.ts\` defines command/query specs that power the
workflows:

- \`pfo.documents.upload\` \u2013 store object + enqueue ingestion.
- \`pfo.reminders.schedule-payment\` \u2013 send email/SMS/calendar reminders.
- \`pfo.summary.generate\` \u2013 run RAG over knowledge spaces.
- \`pfo.summary.dispatch\` \u2013 deliver summaries via email / voice.
- \`pfo.email.sync-threads\` \u2013 ingest Gmail threads.

## Workflows

- **Process Uploaded Document**
  1. Upload to storage / queue ingestion.
  2. Optional human review step.
- **Upcoming Payments Reminder**
  1. Human review (confirm due date / channel).
  2. Automation schedules reminders (email/SMS/calendar).
- **Generate Financial Summary**
  1. Run RAG to produce Markdown summary.
  2. Dispatch summary (email + optional ElevenLabs voice note).
- **Ingest Email Threads**
  1. Sync Gmail threads into knowledge space.
  2. Triage step for operators when nothing new is ingested.

## Knowledge & Jobs

- Knowledge spaces registered via
  \`registerFinancialDocsKnowledgeSpace\` and
  \`registerEmailThreadsKnowledgeSpace\`.
- Ingestion adapters (\`GmailIngestionAdapter\`, \`StorageIngestionAdapter\`)
  and job handlers (\`createGmailSyncHandler\`,
  \`createStorageDocumentHandler\`) wire Gmail labels & GCS prefixes into
  Qdrant.
- \`KnowledgeQueryService\` provides summarisation + references for the
  summary generation workflow.

## Tests & Usage

\`tests/pocket-family-office.test.ts\` exercises:

- Blueprint validation + config composition.
- In-memory ingestion of a sample invoice.
- Retrieval augmented generation producing a summary with references.

Use these files as scaffolding for new tenants or as a template for the
hackathon deliverable. Replace the sample connection metadata with
tenant-specific IDs/secret references before deploying.



`,
		},
	];
