import {
	defineCommand,
	defineSchemaModel,
} from '@contractspec/lib.contracts-spec';
import { ScalarTypeEnum } from '@contractspec/lib.schema';

const MissionIntakeTriageInput = defineSchemaModel({
	name: 'MissionIntakeTriageInput',
	fields: {
		clientName: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		companyContext: {
			type: ScalarTypeEnum.NonEmptyString(),
			isOptional: false,
		},
		companySize: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		revenueBand: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		industry: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		situationSummary: {
			type: ScalarTypeEnum.NonEmptyString(),
			isOptional: false,
		},
		painPoints: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		requestedOutcome: {
			type: ScalarTypeEnum.NonEmptyString(),
			isOptional: false,
		},
		urgency: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		dataSensitivity: {
			type: ScalarTypeEnum.NonEmptyString(),
			isOptional: false,
		},
		knownSystems: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		availableDocuments: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
	},
});

const MissionIntakeTriageResult = defineSchemaModel({
	name: 'MissionIntakeTriageResult',
	fields: {
		missionType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		priority: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		riskSummary: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		risksJson: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		missingInformationJson: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		documentsToRequestJson: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		questionsForExecutiveJson: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		thirtySixtyNinetyPlanJson: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		suggestedNextWorkflow: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		humanReviewRequired: { type: ScalarTypeEnum.Boolean(), isOptional: false },
		safetyNotes: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
	},
});

export const TriageFinanceMissionIntake = defineCommand({
	meta: {
		key: 'financeOps.missionIntake.triage',
		version: '1.0.0',
		title: 'Triage Finance Mission Intake',
		description:
			'Turn a fictive client intake brief into a reviewable DAF or finance transformation mission triage package.',
		goal: 'Turn a fictive client intake brief into a reviewable DAF / finance transformation mission triage package.',
		context:
			'NDconsulting / Desliance style finance operations intake for transition management, reporting, cash, procedures, and finance team reinforcement.',
		owners: ['@platform.finance-ops'],
		tags: ['finance', 'finance-ops', 'workflow', 'human-review'],
		stability: 'beta',
	},
	io: { input: MissionIntakeTriageInput, output: MissionIntakeTriageResult },
	acceptance: {
		scenarios: [
			{
				key: 'cash-tension-intake',
				given: ['Company brief mentions cash tension and missing reporting'],
				when: ['The triage operation is executed'],
				then: [
					'Priority is high, cash/reporting documents are requested, and human review is required',
				],
			},
			{
				key: 'process-improvement-intake',
				given: [
					'Brief mentions internal processes and administrative inefficiency',
				],
				when: ['The triage operation is executed'],
				then: ['Procedure and process documents are requested'],
			},
			{
				key: 'safe-review-draft',
				given: ['Any intake'],
				when: ['The triage operation is executed'],
				then: [
					'Output states it is a review draft and not final financial advice',
				],
			},
		],
	},
	policy: { auth: 'admin' },
});
