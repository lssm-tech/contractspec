import type {
	PreferenceDimensions,
	PreferenceScope,
} from './preference-dimensions';

export type PreferenceDimension = keyof PreferenceDimensions;
export type PreferenceDimensionValue =
	PreferenceDimensions[PreferenceDimension];

export type PreferenceEvolutionSignal =
	| 'explicit_choice'
	| 'setting_changed'
	| 'summary_expanded'
	| 'guidance_dismissed'
	| 'advanced_controls_opened'
	| 'media_mode_changed'
	| 'evidence_opened'
	| 'noise_reduced';

export type PreferenceEvolutionScope = Extract<
	PreferenceScope,
	'user' | 'workspace-user' | 'surface'
>;

type PreferenceEvolutionObservationByDimension = {
	[Dimension in PreferenceDimension]: {
		dimension: Dimension;
		value: PreferenceDimensions[Dimension];
	};
}[PreferenceDimension];

export type PreferenceEvolutionObservation =
	PreferenceEvolutionObservationByDimension & {
		signal: PreferenceEvolutionSignal;
		surfaceId?: string;
		sessionId?: string;
		count?: number;
		explicit?: boolean;
		reason?: string;
		occurredAt?: string;
	};

export interface PreferenceEvolutionInput {
	current: PreferenceDimensions;
	observations: PreferenceEvolutionObservation[];
	/** Default: surface. User/workspace promotion still requires cross-session evidence. */
	preferredScope?: PreferenceEvolutionScope;
	minimumEvidenceCount?: number;
	minimumSessionCount?: number;
	minimumSurfaceCountForGlobal?: number;
}

export interface PreferenceEvolutionEvidence {
	signal: PreferenceEvolutionSignal;
	count: number;
	sessionCount: number;
	surfaceCount: number;
	reasons: string[];
}

export interface PreferenceEvolutionSuggestion {
	id: string;
	dimension: PreferenceDimension;
	from: PreferenceDimensionValue;
	to: PreferenceDimensionValue;
	scope: PreferenceEvolutionScope;
	requiresConfirmation: boolean;
	reversible: boolean;
	reasons: string[];
	evidence: PreferenceEvolutionEvidence;
	patch: Partial<PreferenceDimensions>;
}
