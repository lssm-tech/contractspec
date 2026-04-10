import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import {
	CONTROL_PLANE_DOMAIN,
	CONTROL_PLANE_OWNERS,
	CONTROL_PLANE_STABILITY,
	CONTROL_PLANE_TAGS,
} from '../constants';

const ControlPlaneExecutionEvidenceExportInput = new SchemaModel({
	name: 'ControlPlaneExecutionEvidenceExportInput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		exportedBy: { type: ScalarTypeEnum.ID(), isOptional: false },
	},
});

const ControlPlaneExecutionEvidenceExportOutput = new SchemaModel({
	name: 'ControlPlaneExecutionEvidenceExportOutput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		evidenceBundleCount: {
			type: ScalarTypeEnum.Int_unsecure(),
			isOptional: false,
		},
		exportedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

export const ControlPlaneExecutionEvidenceExportCommand = defineCommand({
	meta: {
		key: 'controlPlane.execution.evidence.export',
		title: 'Export Execution Lane Evidence',
		version: '1.0.0',
		description: 'Export the evidence set attached to an execution-lane run.',
		goal: 'Make evidence handoff explicit and auditable for operators.',
		context:
			'Used when exporting lane evidence for review, replay, or packaging.',
		domain: CONTROL_PLANE_DOMAIN,
		owners: CONTROL_PLANE_OWNERS,
		tags: [...CONTROL_PLANE_TAGS, 'execution', 'evidence'],
		stability: CONTROL_PLANE_STABILITY,
	},
	capability: {
		key: 'control-plane.audit',
		version: '1.0.0',
	},
	io: {
		input: ControlPlaneExecutionEvidenceExportInput,
		output: ControlPlaneExecutionEvidenceExportOutput,
	},
	policy: {
		auth: 'admin',
		pii: [],
	},
});
