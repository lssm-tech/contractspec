import type { PreferenceDimensions } from './preference-dimensions';

export const PREFERENCE_PRESET_IDS = [
	'balanced',
	'guideMe',
	'summaryFirst',
	'deepAnalyst',
	'builder',
	'opsWarRoom',
	'auditReview',
	'minimalFocus',
] as const;

export type PreferencePresetId = (typeof PREFERENCE_PRESET_IDS)[number];

export interface PreferencePresetDefinition<
	TId extends string = PreferencePresetId,
> {
	id: TId;
	label: string;
	intent: string;
	dimensions: PreferenceDimensions;
}

export type PreferencePresetCatalog<TId extends string = PreferencePresetId> =
	Record<TId, PreferencePresetDefinition<TId>>;

export const PREFERENCE_DIMENSION_PRESETS = {
	balanced: {
		guidance: 'hints',
		density: 'standard',
		dataDepth: 'standard',
		control: 'standard',
		media: 'hybrid',
		pace: 'balanced',
		narrative: 'adaptive',
	},
	guideMe: {
		guidance: 'walkthrough',
		density: 'detailed',
		dataDepth: 'standard',
		control: 'restricted',
		media: 'hybrid',
		pace: 'deliberate',
		narrative: 'top-down',
	},
	summaryFirst: {
		guidance: 'hints',
		density: 'compact',
		dataDepth: 'summary',
		control: 'standard',
		media: 'visual',
		pace: 'rapid',
		narrative: 'top-down',
	},
	deepAnalyst: {
		guidance: 'tooltips',
		density: 'compact',
		dataDepth: 'exhaustive',
		control: 'advanced',
		media: 'hybrid',
		pace: 'balanced',
		narrative: 'bottom-up',
	},
	builder: {
		guidance: 'hints',
		density: 'compact',
		dataDepth: 'detailed',
		control: 'full',
		media: 'text',
		pace: 'rapid',
		narrative: 'bottom-up',
	},
	opsWarRoom: {
		guidance: 'hints',
		density: 'dense',
		dataDepth: 'detailed',
		control: 'advanced',
		media: 'visual',
		pace: 'rapid',
		narrative: 'adaptive',
	},
	auditReview: {
		guidance: 'tooltips',
		density: 'detailed',
		dataDepth: 'exhaustive',
		control: 'advanced',
		media: 'text',
		pace: 'deliberate',
		narrative: 'bottom-up',
	},
	minimalFocus: {
		guidance: 'none',
		density: 'minimal',
		dataDepth: 'summary',
		control: 'restricted',
		media: 'text',
		pace: 'balanced',
		narrative: 'top-down',
	},
} satisfies Record<PreferencePresetId, PreferenceDimensions>;

export const PREFERENCE_PRESET_DEFINITIONS = {
	balanced: definePreset(
		'balanced',
		'Balanced',
		'Safe default for general use.'
	),
	guideMe: definePreset(
		'guideMe',
		'Guide me',
		'Slower, more guided onboarding for new or uncertain users.'
	),
	summaryFirst: definePreset(
		'summaryFirst',
		'Summary-first',
		'Compact, fast, dashboard-style usage that starts with summaries.'
	),
	deepAnalyst: definePreset(
		'deepAnalyst',
		'Deep analyst',
		'Data-rich, evidence-first investigation mode.'
	),
	builder: definePreset(
		'builder',
		'Builder',
		'Fast, configurable mode for admins, developers, and creators.'
	),
	opsWarRoom: definePreset(
		'opsWarRoom',
		'Ops war room',
		'Dense, visual, rapid mode for monitoring and incidents.'
	),
	auditReview: definePreset(
		'auditReview',
		'Audit review',
		'Deliberate, traceable, detail-heavy review mode.'
	),
	minimalFocus: definePreset(
		'minimalFocus',
		'Minimal focus',
		'Low-noise, focused, simple experience.'
	),
} satisfies PreferencePresetCatalog;

export function getPreferencePresetDimensions(
	id: PreferencePresetId
): PreferenceDimensions {
	return { ...PREFERENCE_DIMENSION_PRESETS[id] };
}

export function getPreferencePresetDefinition(
	id: PreferencePresetId
): PreferencePresetDefinition {
	const definition = PREFERENCE_PRESET_DEFINITIONS[id];
	return { ...definition, dimensions: { ...definition.dimensions } };
}

export function createPreferencePresetCatalog<TId extends string>(
	customPresets: PreferencePresetCatalog<TId>
): PreferencePresetCatalog<PreferencePresetId | TId> {
	return {
		...PREFERENCE_PRESET_DEFINITIONS,
		...customPresets,
	};
}

function definePreset(
	id: PreferencePresetId,
	label: string,
	intent: string
): PreferencePresetDefinition {
	return {
		id,
		label,
		intent,
		dimensions: PREFERENCE_DIMENSION_PRESETS[id],
	};
}
