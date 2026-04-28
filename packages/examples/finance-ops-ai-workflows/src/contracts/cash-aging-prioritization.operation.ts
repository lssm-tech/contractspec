import {
	defineCommand,
	defineSchemaModel,
} from '@contractspec/lib.contracts-spec';
import { ScalarTypeEnum } from '@contractspec/lib.schema';

const CashAgingPrioritizationInput = defineSchemaModel({
	name: 'CashAgingPrioritizationInput',
	fields: {
		snapshotId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		snapshotDate: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		currency: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		rowsJson: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		reviewOwner: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		dataSensitivity: {
			type: ScalarTypeEnum.NonEmptyString(),
			isOptional: false,
		},
	},
});

const CashAgingPrioritizationResult = defineSchemaModel({
	name: 'CashAgingPrioritizationResult',
	fields: {
		referenceDate: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		totalExposure: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
		overdueExposure: {
			type: ScalarTypeEnum.Float_unsecure(),
			isOptional: false,
		},
		disputedExposure: {
			type: ScalarTypeEnum.Float_unsecure(),
			isOptional: false,
		},
		topPrioritiesJson: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		actionsJson: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		executiveSummary: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		workflowDecision: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		humanReviewRequired: { type: ScalarTypeEnum.Boolean(), isOptional: false },
		safetyNotes: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
	},
});

export const PrioritizeCashAgingSnapshot = defineCommand({
	meta: {
		key: 'financeOps.cashAging.prioritize',
		version: '1.0.0',
		title: 'Prioritize Cash Aging Snapshot',
		description:
			'Prioritize a fictive aged receivables snapshot with deterministic rules and produce reviewable cash actions.',
		goal: 'Prioritize a fictive aged receivables snapshot with deterministic rules and produce reviewable cash actions.',
		context:
			'Desliance cash management, risk anticipation, reporting, and operational finance workflow.',
		owners: ['@platform.finance-ops'],
		tags: ['finance', 'cash-management', 'workflow', 'human-review'],
		stability: 'beta',
	},
	io: {
		input: CashAgingPrioritizationInput,
		output: CashAgingPrioritizationResult,
	},
	acceptance: {
		scenarios: [
			{
				key: 'high-value-overdue',
				given: ['Invoice amount is at least 10000 and overdue over 30 days'],
				when: ['Cash aging is prioritized'],
				then: ['Invoice is high priority and appears in top priorities'],
			},
			{
				key: 'disputed-invoice',
				given: ['Invoice has disputeStatus not equal to none'],
				when: ['Cash aging is prioritized'],
				then: [
					'Action is dispute resolution / owner clarification, not aggressive collection',
				],
			},
			{
				key: 'deterministic-finance-rules',
				given: ['The same input is provided repeatedly'],
				when: ['The handler runs multiple times'],
				then: ['The same deterministic output is returned'],
			},
			{
				key: 'human-review',
				given: ['Any cash snapshot'],
				when: ['Output is produced'],
				then: ['Human review is required before any client communication'],
			},
		],
	},
	policy: { auth: 'admin' },
});
