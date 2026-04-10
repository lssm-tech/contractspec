import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineQuery } from '../../operations';
import {
	CONTROL_PLANE_DOMAIN,
	CONTROL_PLANE_OWNERS,
	CONTROL_PLANE_STABILITY,
	CONTROL_PLANE_TAGS,
} from '../constants';
import { ControlPlaneExecutionLaneDetailModel } from './controlPlaneExecutionLane.models';

const ControlPlaneExecutionLaneGetInput = new SchemaModel({
	name: 'ControlPlaneExecutionLaneGetInput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
	},
});

const ControlPlaneExecutionLaneGetOutput = new SchemaModel({
	name: 'ControlPlaneExecutionLaneGetOutput',
	fields: {
		run: { type: ControlPlaneExecutionLaneDetailModel, isOptional: false },
	},
});

export const ControlPlaneExecutionLaneGetQuery = defineQuery({
	meta: {
		key: 'controlPlane.execution.lane.get',
		title: 'Get Execution Lane',
		version: '1.0.0',
		description: 'Fetch the current state of one execution-lane run.',
		goal: 'Provide contract-backed lane detail for operator surfaces.',
		context:
			'Used by dashboards, APIs, and CLI surfaces to inspect one lane run.',
		domain: CONTROL_PLANE_DOMAIN,
		owners: CONTROL_PLANE_OWNERS,
		tags: [...CONTROL_PLANE_TAGS, 'execution', 'lane'],
		stability: CONTROL_PLANE_STABILITY,
	},
	capability: {
		key: 'control-plane.audit',
		version: '1.0.0',
	},
	io: {
		input: ControlPlaneExecutionLaneGetInput,
		output: ControlPlaneExecutionLaneGetOutput,
	},
	policy: {
		auth: 'admin',
		pii: [],
	},
});
