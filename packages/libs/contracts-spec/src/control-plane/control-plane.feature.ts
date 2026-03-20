import { defineFeature } from '../features';
import {
	CONTROL_PLANE_DOMAIN,
	CONTROL_PLANE_OWNERS,
	CONTROL_PLANE_STABILITY,
	CONTROL_PLANE_TAGS,
} from './constants';

export const ControlPlaneFeature = defineFeature({
	meta: {
		key: 'platform.control-plane',
		version: '1.0.0',
		title: 'Control Plane Runtime',
		description:
			'Deterministic intent, planning, execution, approvals, audit, and skill governance surfaces.',
		domain: CONTROL_PLANE_DOMAIN,
		owners: CONTROL_PLANE_OWNERS,
		tags: [...CONTROL_PLANE_TAGS],
		stability: CONTROL_PLANE_STABILITY,
	},

	operations: [
		{ key: 'controlPlane.intent.submit', version: '1.0.0' },
		{ key: 'controlPlane.plan.compile', version: '1.0.0' },
		{ key: 'controlPlane.plan.verify', version: '1.0.0' },
		{ key: 'controlPlane.execution.start', version: '1.0.0' },
		{ key: 'controlPlane.execution.cancel', version: '1.0.0' },
		{ key: 'controlPlane.execution.approve', version: '1.0.0' },
		{ key: 'controlPlane.execution.reject', version: '1.0.0' },
		{ key: 'controlPlane.execution.get', version: '1.0.0' },
		{ key: 'controlPlane.execution.list', version: '1.0.0' },
		{ key: 'controlPlane.trace.get', version: '1.0.0' },
		{ key: 'controlPlane.policy.explain', version: '1.0.0' },
		{ key: 'controlPlane.skill.install', version: '1.0.0' },
		{ key: 'controlPlane.skill.disable', version: '1.0.0' },
		{ key: 'controlPlane.skill.list', version: '1.0.0' },
		{ key: 'controlPlane.skill.verify', version: '1.0.0' },
	],

	events: [
		{ key: 'controlPlane.intent.received', version: '1.0.0' },
		{ key: 'controlPlane.plan.compiled', version: '1.0.0' },
		{ key: 'controlPlane.plan.rejected', version: '1.0.0' },
		{ key: 'controlPlane.execution.step.started', version: '1.0.0' },
		{ key: 'controlPlane.execution.step.completed', version: '1.0.0' },
		{ key: 'controlPlane.execution.step.blocked', version: '1.0.0' },
		{ key: 'controlPlane.execution.completed', version: '1.0.0' },
		{ key: 'controlPlane.execution.failed', version: '1.0.0' },
		{ key: 'controlPlane.skill.installed', version: '1.0.0' },
		{ key: 'controlPlane.skill.rejected', version: '1.0.0' },
	],

	capabilities: {
		provides: [
			{ key: 'control-plane.core', version: '1.0.0' },
			{ key: 'control-plane.approval', version: '1.0.0' },
			{ key: 'control-plane.audit', version: '1.0.0' },
			{ key: 'control-plane.skill-registry', version: '1.0.0' },
			{ key: 'control-plane.channel-runtime', version: '1.0.0' },
		],
	},
});
