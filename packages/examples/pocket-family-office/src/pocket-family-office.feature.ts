/**
 * Pocket Family Office Feature Module Specification
 *
 * Defines the feature module for personal finance automation.
 */
import { defineFeature } from '@contractspec/lib.contracts-spec';

/**
 * Pocket Family Office feature module that bundles financial document
 * management, open banking integration, and automated summaries.
 */
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
