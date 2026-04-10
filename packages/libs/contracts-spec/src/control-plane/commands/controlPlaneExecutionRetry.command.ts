import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import {
	CONTROL_PLANE_DOMAIN,
	CONTROL_PLANE_OWNERS,
	CONTROL_PLANE_STABILITY,
	CONTROL_PLANE_TAGS,
} from '../constants';

const ControlPlaneExecutionRetryInput = new SchemaModel({
	name: 'ControlPlaneExecutionRetryInput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		retriedBy: { type: ScalarTypeEnum.ID(), isOptional: false },
	},
});

const ControlPlaneExecutionRetryOutput = new SchemaModel({
	name: 'ControlPlaneExecutionRetryOutput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		phase: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		retriedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

export const ControlPlaneExecutionRetryCommand = defineCommand({
	meta: {
		key: 'controlPlane.execution.retry',
		title: 'Retry Execution Lane',
		version: '1.0.0',
		description: 'Retry the current lane execution phase.',
		goal: 'Allow operators to restart remediation without re-creating the run.',
		context:
			'Used when evidence, verification, or worker failure requires a retry.',
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
		input: ControlPlaneExecutionRetryInput,
		output: ControlPlaneExecutionRetryOutput,
	},
	policy: {
		auth: 'admin',
		pii: [],
	},
});
