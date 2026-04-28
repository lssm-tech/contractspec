import {
	defineCommand,
	defineSchemaModel,
} from '@contractspec/lib.contracts-spec';
import { ScalarTypeEnum } from '@contractspec/lib.schema';

const ProcedureDraftInput = defineSchemaModel({
	name: 'ProcedureDraftInput',
	fields: {
		procedureName: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		processArea: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		rawNotes: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		stakeholders: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		frequency: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		knownRisks: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		dataSensitivity: {
			type: ScalarTypeEnum.NonEmptyString(),
			isOptional: false,
		},
	},
});

const ProcedureDraftResult = defineSchemaModel({
	name: 'ProcedureDraftResult',
	fields: {
		procedureTitle: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		purpose: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		scope: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		rolesAndResponsibilitiesJson: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		stepByStepProcedureJson: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		controlsJson: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		kpisJson: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		openQuestionsJson: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		trainingNotes: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		humanReviewRequired: { type: ScalarTypeEnum.Boolean(), isOptional: false },
		safetyNotes: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
	},
});

export const CreateFinanceProcedureDraft = defineCommand({
	meta: {
		key: 'financeOps.procedureDraft.create',
		version: '1.0.0',
		title: 'Create Finance Procedure Draft',
		description:
			'Turn messy fictive process notes into a structured internal procedure draft with roles, controls and validation steps.',
		goal: 'Turn messy fictive process notes into a structured internal procedure draft with roles, controls and validation steps.',
		context:
			'NDconsulting / Desliance procedure, administrative process, change management, and training support workflow.',
		owners: ['@platform.finance-ops'],
		tags: ['finance', 'procedure', 'workflow', 'human-review'],
		stability: 'beta',
	},
	io: { input: ProcedureDraftInput, output: ProcedureDraftResult },
	acceptance: {
		scenarios: [
			{
				key: 'messy-notes',
				given: ['Disorganized notes about receivables follow-up'],
				when: ['The procedure draft is created'],
				then: ['Output includes steps, roles, controls and open questions'],
			},
			{
				key: 'controls-required',
				given: ['Procedure area is finance or cash'],
				when: ['The draft is created'],
				then: ['Controls and review points are included'],
			},
			{
				key: 'no-final-policy',
				given: ['Any procedure draft'],
				when: ['Output is produced'],
				then: ['Output is a draft requiring management validation'],
			},
		],
	},
	policy: { auth: 'admin' },
});
