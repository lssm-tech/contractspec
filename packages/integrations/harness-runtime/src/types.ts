import type {
	EvidenceArtifact,
	EvidenceArtifactKind,
	HarnessExecutionMode,
	HarnessScenarioSpec,
	HarnessTargetIsolation,
	HarnessTargetRef,
} from '@contractspec/lib.contracts-spec';

export interface HarnessTargetResolutionRequest {
	explicitTargetId?: string;
	preferredTargets?: HarnessTargetRef['kind'][];
	isolation?: HarnessTargetIsolation;
	baseUrl?: string;
	allowlistedDomains?: string[];
	metadata?: Record<string, unknown>;
}

export interface HarnessTargetResolver {
	resolve(request: HarnessTargetResolutionRequest): Promise<HarnessTargetRef>;
}

export interface HarnessStoredArtifact extends EvidenceArtifact {
	body?: unknown;
}

export interface HarnessArtifactQuery {
	runId?: string;
	stepId?: string;
	kind?: EvidenceArtifactKind;
}

export interface HarnessArtifactStore {
	put(artifact: HarnessStoredArtifact): Promise<HarnessStoredArtifact>;
	get(artifactId: string): Promise<HarnessStoredArtifact | undefined>;
	list(query?: HarnessArtifactQuery): Promise<HarnessStoredArtifact[]>;
}

export interface HarnessCapturedArtifact {
	kind: EvidenceArtifactKind;
	uri?: string;
	contentType?: string;
	body?: unknown;
	hash?: string;
	summary?: string;
	metadata?: Record<string, unknown>;
}

export interface HarnessStepExecutionInput {
	context: Record<string, unknown>;
	scenario: HarnessScenarioSpec;
	runId: string;
	step: HarnessScenarioSpec['steps'][number];
	target: HarnessTargetRef;
}

export interface HarnessStepExecutionResult {
	status: 'completed' | 'failed' | 'blocked' | 'unsupported';
	summary?: string;
	output?: unknown;
	artifacts?: HarnessCapturedArtifact[];
	proposedMode?: HarnessExecutionMode;
	reasons?: string[];
	metadata?: Record<string, unknown>;
}

export interface HarnessExecutionAdapter {
	readonly mode: HarnessExecutionMode;
	supports(step: HarnessScenarioSpec['steps'][number]): boolean;
	execute(
		input: HarnessStepExecutionInput
	): Promise<HarnessStepExecutionResult>;
}
