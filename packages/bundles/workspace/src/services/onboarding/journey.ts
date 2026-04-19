import { buildContext } from '@contractspec/lib.surface-runtime/runtime/build-context';
import { resolveBundle } from '@contractspec/lib.surface-runtime/runtime/resolve-bundle';
import { defineModuleBundle } from '@contractspec/lib.surface-runtime/spec/define-module-bundle';
import type { ModuleBundleSpec } from '@contractspec/lib.surface-runtime/spec/types';
import type { ConnectSurface } from '../connect/types';
import { getOnboardingTrack, listOnboardingTracks } from './catalog';
import type {
	BuildOnboardingPlanInput,
	OnboardingBuilderMode,
	OnboardingPlan,
	OnboardingTrackDefinition,
	OnboardingTrackRecommendation,
} from './types';

export async function createOnboardingJourneyPlan(
	primaryTrack: OnboardingTrackDefinition,
	tracks: readonly OnboardingTrackDefinition[],
	workspaceRoot: string,
	packageRoot: string
) {
	const journeyContext = buildContext({
		capabilities: primaryTrack.packages,
		device: 'desktop',
		mode: 'guided',
		preferences: {
			control: 'standard',
			dataDepth: 'detailed',
			density: 'standard',
			guidance: 'wizard',
			media: 'text',
			narrative: 'top-down',
			pace: 'balanced',
		},
		route: `/onboard/${primaryTrack.id}`,
		tenantId: workspaceRoot,
		workspaceId: packageRoot,
	});
	const journeyPlan = await resolveBundle(
		defineModuleBundle(createOnboardingBundleSpec(tracks)),
		journeyContext
	);

	return { journeyContext, journeyPlan };
}

export function resolveRequestedTracks(
	selectedTracks: BuildOnboardingPlanInput['selectedTracks']
) {
	if (!selectedTracks || selectedTracks.length === 0) {
		return [...listOnboardingTracks()];
	}

	return selectedTracks.map((trackId) => {
		const track = getOnboardingTrack(trackId);
		if (!track) {
			throw new Error(`Unknown onboarding track: ${trackId}`);
		}
		return track;
	});
}

export function resolveBuilderMode(
	config: OnboardingPlan['config']
): OnboardingBuilderMode {
	if (!config.builder?.enabled) {
		return 'none';
	}
	switch (config.builder.runtimeMode) {
		case 'local':
			return 'local';
		case 'hybrid':
			return 'hybrid';
		default:
			return 'managed';
	}
}

export function buildBuilderNextSteps(builderMode: OnboardingBuilderMode) {
	switch (builderMode) {
		case 'managed':
			return ['contractspec builder status'];
		case 'local':
		case 'hybrid':
			return [
				'contractspec builder status',
				'contractspec builder local status',
			];
		case 'none':
		default:
			return [
				'contractspec init --preset builder-managed',
				'contractspec init --preset builder-local',
				'contractspec init --preset builder-hybrid',
			];
	}
}

export function resolveSelectedExample(
	primaryTrack: OnboardingTrackDefinition,
	forcedExampleKey: string | undefined
) {
	if (!forcedExampleKey) {
		return primaryTrack.starterExample;
	}

	if (primaryTrack.starterExample.key === forcedExampleKey) {
		return primaryTrack.starterExample;
	}

	if (primaryTrack.advancedExample?.key === forcedExampleKey) {
		return primaryTrack.advancedExample;
	}

	for (const track of listOnboardingTracks()) {
		if (track.starterExample.key === forcedExampleKey) {
			return track.starterExample;
		}
		if (track.advancedExample?.key === forcedExampleKey) {
			return track.advancedExample;
		}
	}

	return undefined;
}

export function enrichConnectSurfaces(
	current: readonly ConnectSurface[],
	recommendations: readonly OnboardingTrackRecommendation[]
) {
	return unionStrings(
		current,
		recommendations.flatMap(
			(recommendation) => recommendation.track.connectSurfaces
		)
	);
}

function createOnboardingBundleSpec(
	tracks: readonly OnboardingTrackDefinition[]
) {
	const spec: ModuleBundleSpec = {
		meta: {
			key: 'contractspec.onboarding',
			version: '1.0.0',
			title: 'ContractSpec Onboarding Journey',
		},
		routes: tracks.map((track) => ({
			defaultSurface: track.id,
			path: `/onboard/${track.id}`,
			routeId: `onboard-${track.id}`,
		})),
		surfaces: Object.fromEntries(
			tracks.map((track) => [
				track.id,
				{
					commands: track.recommendedCommands.map((command, index) => ({
						commandId: `${track.id}-${index}`,
						intent: `Run ${command}`,
						title: command,
					})),
					data: [
						{
							hydrateInto: 'track',
							recipeId: `track-${track.id}`,
							source: {
								entityType: `onboarding.${track.id}`,
								kind: 'entity',
							},
						},
					],
					kind: 'workbench',
					layouts: [
						{
							layoutId: `${track.id}-guided`,
							root: { slotId: 'primary', type: 'slot' },
						},
					],
					slots: [
						{
							accepts: ['rich-doc', 'assistant-panel'],
							cardinality: 'many',
							role: 'primary',
							slotId: 'primary',
						},
					],
					surfaceId: track.id,
					title: track.title,
					verification: {
						dimensions: {
							control:
								'Guided onboarding stays within repo-local safe commands.',
							dataDepth: 'Track explains starter and advanced examples.',
							density: 'Readable onboarding layout supports quick scanning.',
							guidance: 'Wizard posture remains explicit and progressive.',
							media: 'Text-first guidance remains valid for CLI and MCP.',
							narrative:
								'Top-down journey starts with the primary track and expands outward.',
							pace: 'Progression stays incremental and bounded.',
						},
					},
				},
			])
		),
	};

	return spec;
}

function unionStrings(
	current: readonly ConnectSurface[],
	extra: readonly ConnectSurface[]
) {
	return [...new Set([...current, ...extra])].sort();
}
