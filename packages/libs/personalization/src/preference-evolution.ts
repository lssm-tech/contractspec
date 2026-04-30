import type { PreferenceDimensions } from './preference-dimensions';
import type {
	PreferenceDimension,
	PreferenceDimensionValue,
	PreferenceEvolutionEvidence,
	PreferenceEvolutionInput,
	PreferenceEvolutionObservation,
	PreferenceEvolutionScope,
	PreferenceEvolutionSignal,
	PreferenceEvolutionSuggestion,
} from './preference-evolution-types';

export type {
	PreferenceDimension,
	PreferenceDimensionValue,
	PreferenceEvolutionEvidence,
	PreferenceEvolutionInput,
	PreferenceEvolutionObservation,
	PreferenceEvolutionScope,
	PreferenceEvolutionSignal,
	PreferenceEvolutionSuggestion,
} from './preference-evolution-types';

interface Candidate {
	dimension: PreferenceDimension;
	value: PreferenceDimensionValue;
	signal: PreferenceEvolutionSignal;
	explicit: boolean;
	events: PreferenceEvolutionObservation[];
}

const DEFAULT_MINIMUM_EVIDENCE_COUNT = 3;
const DEFAULT_MINIMUM_SESSION_COUNT = 2;
const DEFAULT_MINIMUM_SURFACE_COUNT_FOR_GLOBAL = 2;
const HIGH_RISK_DIMENSIONS = new Set<PreferenceDimension>([
	'control',
	'dataDepth',
]);
export function suggestPreferenceEvolution({
	current,
	observations,
	preferredScope = 'surface',
	minimumEvidenceCount = DEFAULT_MINIMUM_EVIDENCE_COUNT,
	minimumSessionCount = DEFAULT_MINIMUM_SESSION_COUNT,
	minimumSurfaceCountForGlobal = DEFAULT_MINIMUM_SURFACE_COUNT_FOR_GLOBAL,
}: PreferenceEvolutionInput): PreferenceEvolutionSuggestion[] {
	const explicitChoices = new Set(
		observations
			.filter((event) => event.explicit === true)
			.map((event) => event.dimension)
	);
	const candidates = groupCandidates(observations);

	return candidates
		.filter((candidate) => candidate.value !== current[candidate.dimension])
		.filter(
			(candidate) =>
				!explicitChoices.has(candidate.dimension) || candidate.explicit
		)
		.map((candidate) =>
			toSuggestion(candidate, current, {
				minimumEvidenceCount,
				minimumSessionCount,
				minimumSurfaceCountForGlobal,
				preferredScope,
			})
		)
		.filter(
			(suggestion): suggestion is PreferenceEvolutionSuggestion =>
				suggestion !== undefined
		);
}

function groupCandidates(
	observations: PreferenceEvolutionObservation[]
): Candidate[] {
	const groups = new Map<string, Candidate>();
	for (const event of observations) {
		if (!valueMatchesDimension(event.dimension, event.value)) continue;
		const key = [
			event.dimension,
			event.value,
			event.signal,
			event.explicit ? 'explicit' : 'inferred',
		].join(':');
		const existing = groups.get(key);
		if (existing) {
			existing.events.push(event);
		} else {
			groups.set(key, {
				dimension: event.dimension,
				value: event.value,
				signal: event.signal,
				explicit: event.explicit === true,
				events: [event],
			});
		}
	}
	return Array.from(groups.values());
}

function toSuggestion(
	candidate: Candidate,
	current: PreferenceDimensions,
	options: {
		minimumEvidenceCount: number;
		minimumSessionCount: number;
		minimumSurfaceCountForGlobal: number;
		preferredScope: PreferenceEvolutionScope;
	}
): PreferenceEvolutionSuggestion | undefined {
	const evidence = summarizeEvidence(candidate.events, candidate.signal);
	if (!candidate.explicit && evidence.count < options.minimumEvidenceCount) {
		return undefined;
	}
	if (
		!candidate.explicit &&
		evidence.sessionCount < options.minimumSessionCount
	) {
		return undefined;
	}

	const scope = resolveSuggestionScope(candidate, evidence, options);
	const requiresConfirmation =
		!candidate.explicit ||
		scope !== 'surface' ||
		HIGH_RISK_DIMENSIONS.has(candidate.dimension);

	return {
		id: [
			'preference-evolution',
			scope,
			candidate.dimension,
			String(candidate.value),
		].join(':'),
		dimension: candidate.dimension,
		from: current[candidate.dimension],
		to: candidate.value,
		scope,
		requiresConfirmation,
		reversible: true,
		reasons: buildReasons(candidate, evidence, scope),
		evidence,
		patch: {
			[candidate.dimension]: candidate.value,
		} as Partial<PreferenceDimensions>,
	};
}

function resolveSuggestionScope(
	candidate: Candidate,
	evidence: PreferenceEvolutionEvidence,
	options: {
		minimumSurfaceCountForGlobal: number;
		preferredScope: PreferenceEvolutionScope;
	}
): PreferenceEvolutionScope {
	if (candidate.explicit) return options.preferredScope;
	if (options.preferredScope === 'surface') return 'surface';
	return evidence.surfaceCount >= options.minimumSurfaceCountForGlobal
		? options.preferredScope
		: 'surface';
}

function summarizeEvidence(
	events: PreferenceEvolutionObservation[],
	signal: PreferenceEvolutionSignal
): PreferenceEvolutionEvidence {
	const sessions = new Set(
		events.map((event) => event.sessionId).filter(Boolean)
	);
	const surfaces = new Set(
		events.map((event) => event.surfaceId).filter(Boolean)
	);
	return {
		signal,
		count: events.reduce((total, event) => total + (event.count ?? 1), 0),
		sessionCount: sessions.size || 1,
		surfaceCount: surfaces.size || 1,
		reasons: Array.from(
			new Set(events.flatMap((event) => (event.reason ? [event.reason] : [])))
		),
	};
}

function buildReasons(
	candidate: Candidate,
	evidence: PreferenceEvolutionEvidence,
	scope: PreferenceEvolutionScope
): string[] {
	const reasons = [
		`Observed ${evidence.count} ${candidate.signal.replaceAll('_', ' ')} signals across ${evidence.sessionCount} session(s).`,
		`Suggested as a ${scope} preference change, not a hidden global mutation.`,
	];
	if (candidate.explicit) {
		reasons.push('Explicit user choices take priority over inferred behavior.');
	}
	if (HIGH_RISK_DIMENSIONS.has(candidate.dimension)) {
		reasons.push(
			'This dimension can affect control or data exposure, so confirmation is required.'
		);
	}
	return [...reasons, ...evidence.reasons];
}

const DIMENSION_VALUES: Record<PreferenceDimension, string> = {
	guidance: '|none|hints|tooltips|walkthrough|wizard|',
	density: '|minimal|compact|standard|detailed|dense|',
	dataDepth: '|summary|standard|detailed|exhaustive|',
	control: '|restricted|standard|advanced|full|',
	media: '|text|visual|voice|hybrid|',
	pace: '|deliberate|balanced|rapid|',
	narrative: '|top-down|bottom-up|adaptive|',
};

function valueMatchesDimension(
	dimension: PreferenceDimension,
	value: PreferenceDimensionValue
): boolean {
	return DIMENSION_VALUES[dimension].includes(`|${value}|`);
}
