import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import {
	CONTROL_PLANE_DOMAIN,
	CONTROL_PLANE_OWNERS,
	CONTROL_PLANE_STABILITY,
	CONTROL_PLANE_TAGS,
} from '../constants';

const ControlPlaneExecutionPauseInput = new SchemaModel({
	name: 'ControlPlaneExecutionPauseInput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		pausedBy: { type: ScalarTypeEnum.ID(), isOptional: false },
		reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

const ControlPlaneExecutionPauseOutput = new SchemaModel({
	name: 'ControlPlaneExecutionPauseOutput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		pausedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

export const ControlPlaneExecutionPauseCommand = defineCommand({
	meta: {
		key: 'controlPlane.execution.pause',
		title: 'Pause Execution Lane',
		version: '1.0.0',
		description: 'Pause an active execution-lane run.',
		goal: 'Let operators halt lane progress without losing runtime state.',
		context: 'Used for operator intervention when a lane should stop in-place.',
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
		input: ControlPlaneExecutionPauseInput,
		output: ControlPlaneExecutionPauseOutput,
	},
	policy: {
		auth: 'admin',
		pii: [],
	},
});
