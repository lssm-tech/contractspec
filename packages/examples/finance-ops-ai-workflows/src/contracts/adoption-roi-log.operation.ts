import {
	defineCommand,
	defineSchemaModel,
} from '@contractspec/lib.contracts-spec';
import { ScalarTypeEnum } from '@contractspec/lib.schema';

const AiAdoptionUsageInput = defineSchemaModel({
	name: 'AiAdoptionUsageInput',
	fields: {
		workflowKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		team: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		useCase: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		timeBeforeMinutes: {
			type: ScalarTypeEnum.Float_unsecure(),
			isOptional: false,
		},
		timeAfterMinutes: {
			type: ScalarTypeEnum.Float_unsecure(),
			isOptional: false,
		},
		dataRisk: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		humanValidated: { type: ScalarTypeEnum.Boolean(), isOptional: false },
		qualityRating: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		notes: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

const AiAdoptionUsageResult = defineSchemaModel({
	name: 'AiAdoptionUsageResult',
	fields: {
		usageLogId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		estimatedMinutesSaved: {
			type: ScalarTypeEnum.Float_unsecure(),
			isOptional: false,
		},
		estimatedHoursSaved: {
			type: ScalarTypeEnum.Float_unsecure(),
			isOptional: false,
		},
		roiSummary: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		recommendedNextStep: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		requiresPolicyReview: {
			type: ScalarTypeEnum.Boolean(),
			isOptional: false,
		},
		standardizationCandidate: {
			type: ScalarTypeEnum.Boolean(),
			isOptional: false,
		},
		safetyNotes: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
	},
});

export const LogAiAdoptionRoi = defineCommand({
	meta: {
		key: 'financeOps.aiAdoption.logUsage',
		version: '1.0.0',
		title: 'Log AI Adoption ROI',
		description:
			'Log an AI workflow usage and estimate ROI, data risk and recommended next step.',
		goal: 'Log an AI workflow usage and estimate ROI, data risk and recommended next step.',
		context:
			'Measure finance AI use cases, gains, and risks without intrusive employee surveillance.',
		owners: ['@platform.finance-ops'],
		tags: ['finance', 'agents', 'adoption', 'roi', 'human-review'],
		stability: 'beta',
	},
	io: { input: AiAdoptionUsageInput, output: AiAdoptionUsageResult },
	acceptance: {
		scenarios: [
			{
				key: 'positive-roi-low-risk',
				given: ['Before time is 120, after time is 45, low risk, validated'],
				when: ['Usage is logged'],
				then: ['Saved time is 75 minutes and next step is standardize'],
			},
			{
				key: 'high-risk-data',
				given: ['Data risk is high'],
				when: ['Usage is logged'],
				then: ['Policy review is required'],
			},
			{
				key: 'no-gain',
				given: ['Before time is equal to or lower than after time'],
				when: ['Usage is logged'],
				then: ['Next step is abandon_or_redesign or train'],
			},
			{
				key: 'low-quality',
				given: ['Quality rating is low'],
				when: ['Usage is logged'],
				then: ['Recommended next step is train or redesign'],
			},
		],
	},
	policy: { auth: 'admin' },
});
