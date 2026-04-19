import type { WorkspaceAdapters } from '../../ports/logger';
import {
	type AdoptionResolverRuntime,
	resolveAdoption,
	resolveAdoptionWorkspace,
} from '../adoption';
import { buildConnectContextPack, compileConnectPlanPacket } from '../connect';
import {
	buildBuilderNextSteps,
	createOnboardingJourneyPlan,
	enrichConnectSurfaces,
	resolveBuilderMode,
	resolveRequestedTracks,
	resolveSelectedExample,
} from './journey';
import { renderOnboardingGuides } from './render';
import type {
	BuildOnboardingPlanInput,
	OnboardingConnectArtifacts,
	OnboardingPlan,
	OnboardingTrackRecommendation,
} from './types';

export async function buildOnboardingPlan(
	runtime: AdoptionResolverRuntime,
	input: BuildOnboardingPlanInput = {}
): Promise<OnboardingPlan> {
	const workspace = await resolveAdoptionWorkspace(runtime.fs, input);
	const requestedTracks = resolveRequestedTracks(input.selectedTracks);
	const builderMode = resolveBuilderMode(workspace.config);
	const recommendations = await Promise.all(
		requestedTracks.map(async (track) => {
			const resolution = await resolveAdoption(runtime, {
				config: workspace.config,
				cwd: workspace.cwd,
				family: track.reuseFamily,
				packageRoot: workspace.packageRoot,
				platform: track.adoptionPlatform,
				query: track.adoptionQuery,
				workspaceRoot: workspace.workspaceRoot,
			});
			return {
				reason: resolution.reason,
				resolution,
				score: resolution.selected?.score ?? 0,
				selected: false,
				track,
			} satisfies OnboardingTrackRecommendation;
		})
	);
	const orderedRecommendations = [...recommendations]
		.sort((left, right) => right.score - left.score)
		.map((recommendation, index) => ({
			...recommendation,
			selected: index === 0,
		}));
	const primaryTrack = orderedRecommendations[0]?.track;
	if (!primaryTrack) {
		throw new Error('No onboarding tracks are available.');
	}

	const { journeyContext, journeyPlan } = await createOnboardingJourneyPlan(
		primaryTrack,
		requestedTracks,
		workspace.workspaceRoot,
		workspace.packageRoot
	);
	const selectedExample =
		resolveSelectedExample(primaryTrack, input.forcedExampleKey) ??
		primaryTrack.starterExample;
	const nextCommands = dedupeCommands([
		'contractspec onboard',
		...primaryTrack.recommendedCommands,
		'contractspec doctor',
	]);
	const builderNextSteps = buildBuilderNextSteps(builderMode);
	const draftPlan = {
		agentGuidePath: input.agentGuidePath ?? 'AGENTS.md',
		builderMode,
		builderNextSteps,
		config: workspace.config,
		cwd: workspace.cwd,
		humanGuidePath: input.humanGuidePath ?? 'USAGE.md',
		journeyContext,
		journeyPlan,
		nextCommands,
		packageRoot: workspace.packageRoot,
		primaryTrack,
		recommendations: orderedRecommendations,
		selectedExample,
		workspaceRoot: workspace.workspaceRoot,
	} satisfies Omit<OnboardingPlan, 'guides'>;

	return {
		...draftPlan,
		guides: renderOnboardingGuides(draftPlan),
	};
}

export async function createOnboardingConnectArtifacts(
	adapters: Pick<WorkspaceAdapters, 'fs' | 'git'>,
	plan: OnboardingPlan
): Promise<OnboardingConnectArtifacts | undefined> {
	if (!plan.config.connect?.enabled) {
		return undefined;
	}

	const taskId = `task_onboard_${plan.primaryTrack.id.replaceAll('-', '_')}`;
	const paths = [plan.agentGuidePath, plan.humanGuidePath];
	const contextPack = await buildConnectContextPack(adapters, {
		config: plan.config,
		cwd: plan.cwd,
		packageRoot: plan.packageRoot,
		paths,
		taskId,
		workspaceRoot: plan.workspaceRoot,
	});
	const planResult = await compileConnectPlanPacket(adapters, {
		candidate: {
			objective: `Onboard this repository for ${plan.recommendations
				.map((recommendation) => recommendation.track.id)
				.join(', ')}`,
			steps: plan.recommendations.map((recommendation) => ({
				commands: recommendation.track.recommendedCommands,
				paths,
				summary: `Adopt ${recommendation.track.title}`,
			})),
			touchedPaths: paths,
		},
		config: plan.config,
		cwd: plan.cwd,
		packageRoot: plan.packageRoot,
		paths,
		taskId,
		workspaceRoot: plan.workspaceRoot,
	});

	return {
		contextPack: {
			...contextPack,
			affectedSurfaces: enrichConnectSurfaces(
				contextPack.affectedSurfaces,
				plan.recommendations
			),
		},
		planPacket: {
			...planResult.planPacket,
			affectedSurfaces: enrichConnectSurfaces(
				planResult.planPacket.affectedSurfaces,
				plan.recommendations
			),
		},
	};
}

function dedupeCommands(commands: readonly string[]) {
	return [...new Set(commands)];
}
