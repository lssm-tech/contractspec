import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineQuery } from '../../operations';
import {
	CONTROL_PLANE_DOMAIN,
	CONTROL_PLANE_OWNERS,
	CONTROL_PLANE_STABILITY,
	CONTROL_PLANE_TAGS,
} from '../constants';
import { ControlPlaneExecutionLaneSummaryModel } from './controlPlaneExecutionLane.models';

const ControlPlaneExecutionLaneListInput = new SchemaModel({
	name: 'ControlPlaneExecutionLaneListInput',
	fields: {
		laneKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		laneStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

const ControlPlaneExecutionLaneListOutput = new SchemaModel({
	name: 'ControlPlaneExecutionLaneListOutput',
	fields: {
		items: {
			type: ControlPlaneExecutionLaneSummaryModel,
			isOptional: false,
			isArray: true,
		},
		total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
	},
});

export const ControlPlaneExecutionLaneListQuery = defineQuery({
	meta: {
		key: 'controlPlane.execution.lane.list',
		title: 'List Execution Lanes',
		version: '1.0.0',
		description: 'List execution-lane runs with lane-focused filters.',
		goal: 'Provide contract-backed lane inventory for operators.',
		context:
			'Used by dashboards, APIs, and CLI surfaces to inspect lane queues and status.',
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
		input: ControlPlaneExecutionLaneListInput,
		output: ControlPlaneExecutionLaneListOutput,
	},
	policy: {
		auth: 'admin',
		pii: [],
	},
});
