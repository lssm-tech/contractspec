import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import {
	CONTROL_PLANE_DOMAIN,
	CONTROL_PLANE_OWNERS,
	CONTROL_PLANE_STABILITY,
	CONTROL_PLANE_TAGS,
} from '../constants';

const ControlPlaneExecutionShutdownInput = new SchemaModel({
	name: 'ControlPlaneExecutionShutdownInput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		shutdownBy: { type: ScalarTypeEnum.ID(), isOptional: false },
		reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

const ControlPlaneExecutionShutdownOutput = new SchemaModel({
	name: 'ControlPlaneExecutionShutdownOutput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		shutdownAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

export const ControlPlaneExecutionShutdownCommand = defineCommand({
	meta: {
		key: 'controlPlane.execution.shutdown',
		title: 'Shutdown Execution Lane',
		version: '1.0.0',
		description:
			'Shutdown an execution-lane run and move it to a terminal state.',
		goal: 'Provide explicit operator shutdown with audit-friendly reason capture.',
		context:
			'Used when a lane must be terminated rather than paused or retried.',
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
		input: ControlPlaneExecutionShutdownInput,
		output: ControlPlaneExecutionShutdownOutput,
	},
	policy: {
		auth: 'admin',
		pii: [],
	},
});
