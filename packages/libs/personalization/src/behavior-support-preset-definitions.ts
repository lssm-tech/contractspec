import type { BehaviorSupportDimensions } from './behavior-support';
import {
	BEHAVIOR_SUPPORT_PRESETS,
	type BehaviorSupportPresetId,
} from './behavior-support-presets';

export interface BehaviorSupportPresetDefinition<
	TId extends string = BehaviorSupportPresetId,
> {
	id: TId;
	label: string;
	intent: string;
	dimensions: BehaviorSupportDimensions;
}

export type BehaviorSupportPresetCatalog<
	TId extends string = BehaviorSupportPresetId,
> = Record<TId, BehaviorSupportPresetDefinition<TId>>;

export const BEHAVIOR_SUPPORT_PRESET_DEFINITIONS = {
	steadyMomentum: defineBehaviorSupportPreset(
		'steadyMomentum',
		'Steady momentum',
		'Consistent progress with moderate support.'
	),
	activationFirst: defineBehaviorSupportPreset(
		'activationFirst',
		'Activation-first',
		'Reduces start friction and makes the first useful action easier.'
	),
	permissionFirst: defineBehaviorSupportPreset(
		'permissionFirst',
		'Permission-first',
		'Helps users start smaller, pause, or renegotiate without friction.'
	),
	deepWorkBuilder: defineBehaviorSupportPreset(
		'deepWorkBuilder',
		'Deep work builder',
		'Protects focus, mastery, and intentional work.'
	),
	recoveryFirst: defineBehaviorSupportPreset(
		'recoveryFirst',
		'Recovery-first',
		'Makes repair and resumption easier after misses or interruptions.'
	),
	identityBuilder: defineBehaviorSupportPreset(
		'identityBuilder',
		'Identity builder',
		'Connects action to user-defined values or commitments.'
	),
	selfAuthorityBuilder: defineBehaviorSupportPreset(
		'selfAuthorityBuilder',
		'Self-authority builder',
		'Builds confidence, composure, structure, and follow-through.'
	),
	socialMomentum: defineBehaviorSupportPreset(
		'socialMomentum',
		'Social momentum',
		'Uses shared rhythm, collaboration, or review when explicitly wanted.'
	),
	deadlineSprint: defineBehaviorSupportPreset(
		'deadlineSprint',
		'Deadline sprint',
		'Supports short-term urgency and focused execution.'
	),
	minimalNudge: defineBehaviorSupportPreset(
		'minimalNudge',
		'Minimal nudge',
		'Keeps behavior support low-noise with minimal intervention.'
	),
} satisfies BehaviorSupportPresetCatalog;

export function getBehaviorSupportPresetDefinition(
	id: BehaviorSupportPresetId
): BehaviorSupportPresetDefinition {
	const definition = BEHAVIOR_SUPPORT_PRESET_DEFINITIONS[id];
	return { ...definition, dimensions: { ...definition.dimensions } };
}

function defineBehaviorSupportPreset(
	id: BehaviorSupportPresetId,
	label: string,
	intent: string
): BehaviorSupportPresetDefinition {
	return {
		id,
		label,
		intent,
		dimensions: BEHAVIOR_SUPPORT_PRESETS[id],
	};
}
