import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts-spec/workspace-config';
import type { ResolvedSurfacePlan } from '@contractspec/lib.surface-runtime/runtime/resolve-bundle';
import type { BundleContext } from '@contractspec/lib.surface-runtime/spec/types';
import type { AdoptionFamily, AdoptionResolution } from '../adoption/types';
import type {
	ConnectContextPack,
	ConnectPlanPacket,
	ConnectSurface,
} from '../connect/types';

export type OnboardingTrackId =
	| 'contracts'
	| 'ui-design'
	| 'knowledge'
	| 'ai-agents'
	| 'learning-journey';

export type OnboardingBuilderMode = 'none' | 'managed' | 'local' | 'hybrid';

export interface OnboardingExampleRef {
	key: string;
	packageRef: string;
	title: string;
	summary: string;
}

export interface OnboardingTrackDefinition {
	id: OnboardingTrackId;
	title: string;
	summary: string;
	description: string;
	reuseFamily: AdoptionFamily;
	adoptionQuery: string;
	adoptionPlatform?: string;
	primaryDocsRoute: string;
	secondaryDocsRoutes: string[];
	packages: string[];
	recommendedCommands: string[];
	starterExample: OnboardingExampleRef;
	advancedExample?: OnboardingExampleRef;
	connectSurfaces: ConnectSurface[];
}

export interface OnboardingTrackRecommendation {
	track: OnboardingTrackDefinition;
	selected: boolean;
	score: number;
	reason: string;
	resolution: AdoptionResolution;
}

export interface OnboardingGuideRenderResult {
	agentGuide: string;
	humanGuide: string;
}

export interface BuildOnboardingPlanInput {
	cwd?: string;
	workspaceRoot?: string;
	packageRoot?: string;
	config?: ResolvedContractsrcConfig;
	selectedTracks?: OnboardingTrackId[];
	forcedExampleKey?: string;
	agentGuidePath?: string;
	humanGuidePath?: string;
}

export interface OnboardingPlan {
	cwd: string;
	workspaceRoot: string;
	packageRoot: string;
	config: ResolvedContractsrcConfig;
	builderMode: OnboardingBuilderMode;
	primaryTrack: OnboardingTrackDefinition;
	recommendations: OnboardingTrackRecommendation[];
	journeyContext: BundleContext;
	journeyPlan: ResolvedSurfacePlan;
	guides: OnboardingGuideRenderResult;
	agentGuidePath: string;
	humanGuidePath: string;
	selectedExample: OnboardingExampleRef;
	nextCommands: string[];
	builderNextSteps: string[];
}

export interface OnboardingConnectArtifacts {
	contextPack: ConnectContextPack;
	planPacket: ConnectPlanPacket;
}
