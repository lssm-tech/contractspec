import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import {
	CONTROL_PLANE_DOMAIN,
	CONTROL_PLANE_OWNERS,
	CONTROL_PLANE_STABILITY,
	CONTROL_PLANE_TAGS,
} from '../constants';

const ControlPlaneExecutionResumeInput = new SchemaModel({
	name: 'ControlPlaneExecutionResumeInput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		resumedBy: { type: ScalarTypeEnum.ID(), isOptional: false },
	},
});

const ControlPlaneExecutionResumeOutput = new SchemaModel({
	name: 'ControlPlaneExecutionResumeOutput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		resumedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

export const ControlPlaneExecutionResumeCommand = defineCommand({
	meta: {
		key: 'controlPlane.execution.resume',
		title: 'Resume Execution Lane',
		version: '1.0.0',
		description: 'Resume a paused execution-lane run.',
		goal: 'Return a lane to active execution after operator intervention.',
		context: 'Used when paused work is allowed to continue.',
		domain: CONTROL_PLANE_DOMAIN,
		owners: CONTROL_PLANE_OWNERS,
		tags: [...CONTROL_PLANE_TAGS, 'execution', 'lane'],
		stability: CONTROL_PLANE_STABILITY,
	},
	capability: {
		key: 'control-plane.core',
		version: '1.0.0',
	},
	io: {
		input: ControlPlaneExecutionResumeInput,
		output: ControlPlaneExecutionResumeOutput,
	},
	policy: {
		auth: 'admin',
		pii: [],
	},
});
