import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import {
	CONTROL_PLANE_DOMAIN,
	CONTROL_PLANE_OWNERS,
	CONTROL_PLANE_STABILITY,
	CONTROL_PLANE_TAGS,
} from '../constants';

const ControlPlaneExecutionAbortInput = new SchemaModel({
	name: 'ControlPlaneExecutionAbortInput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		abortedBy: { type: ScalarTypeEnum.ID(), isOptional: false },
		reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

const ControlPlaneExecutionAbortOutput = new SchemaModel({
	name: 'ControlPlaneExecutionAbortOutput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		abortedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

export const ControlPlaneExecutionAbortCommand = defineCommand({
	meta: {
		key: 'controlPlane.execution.abort',
		title: 'Abort Execution Lane',
		version: '1.0.0',
		description: 'Abort an execution-lane run immediately.',
		goal: 'Provide a hard terminal stop distinct from graceful shutdown.',
		context:
			'Used when operators must terminate a lane instead of pausing or shutting it down gracefully.',
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
		input: ControlPlaneExecutionAbortInput,
		output: ControlPlaneExecutionAbortOutput,
	},
	policy: {
		auth: 'admin',
		pii: [],
	},
});
