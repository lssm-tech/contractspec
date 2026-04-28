import {
	defineCommand,
	defineSchemaModel,
} from '@contractspec/lib.contracts-spec';
import { ScalarTypeEnum } from '@contractspec/lib.schema';

const ReportingNarrativeInput = defineSchemaModel({
	name: 'ReportingNarrativeInput',
	fields: {
		reportingPeriod: {
			type: ScalarTypeEnum.NonEmptyString(),
			isOptional: false,
		},
		currency: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		kpiSnapshotJson: {
			type: ScalarTypeEnum.NonEmptyString(),
			isOptional: false,
		},
		knownContext: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		audience: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		dataSensitivity: {
			type: ScalarTypeEnum.NonEmptyString(),
			isOptional: false,
		},
	},
});

const ReportingNarrativeResult = defineSchemaModel({
	name: 'ReportingNarrativeResult',
	fields: {
		period: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		executiveSummary: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		varianceHighlightsJson: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		questionsForReviewJson: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		recommendedFollowUpsJson: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		confidenceNotes: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		humanReviewRequired: { type: ScalarTypeEnum.Boolean(), isOptional: false },
		safetyNotes: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
	},
});

export const ComposeReportingNarrative = defineCommand({
	meta: {
		key: 'financeOps.reportingNarrative.compose',
		version: '1.0.0',
		title: 'Compose Reporting Narrative',
		description:
			'Convert a fictive KPI snapshot into a management reporting narrative with deterministic interpretation helpers and human-review guardrails.',
		goal: 'Convert a fictive KPI snapshot into a management reporting narrative with deterministic interpretation helpers and human-review guardrails.',
		context:
			'Financial reporting, management control, BI, steering tools, and executive decision support workflow.',
		owners: ['@platform.finance-ops'],
		tags: ['finance', 'reporting', 'workflow', 'human-review'],
		stability: 'beta',
	},
	io: { input: ReportingNarrativeInput, output: ReportingNarrativeResult },
	acceptance: {
		scenarios: [
			{
				key: 'variance-detected',
				given: ['KPI current value differs materially from target'],
				when: ['The reporting narrative is composed'],
				then: ['Variance is highlighted and review questions are generated'],
			},
			{
				key: 'no-invention',
				given: ['Context is missing'],
				when: ['Output is produced'],
				then: ['Confidence notes mention missing context instead of causes'],
			},
			{
				key: 'human-review',
				given: ['Any reporting snapshot'],
				when: ['Output is produced'],
				then: ['Human review is required before sending to management'],
			},
		],
	},
	policy: { auth: 'admin' },
});
