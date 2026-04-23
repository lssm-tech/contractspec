import type {
	EvidenceArtifact,
	EvidenceArtifactKind,
	HarnessActionClass,
	HarnessAssertionResult,
	HarnessExecutionMode,
	HarnessPolicyVerdict,
	HarnessRunRecord,
	HarnessScenarioSpec,
	HarnessStepRecord,
	HarnessSuiteSpec,
	HarnessTargetIsolation,
	HarnessTargetRef,
} from '@contractspec/lib.contracts-spec';

export interface HarnessExecutionContext {
	traceId?: string;
	actorId?: string;
	workspaceId?: string;
	controlPlaneExecutionId?: string;
	controlPlanePlanId?: string;
	metadata?: Record<string, unknown>;
}

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
	context: HarnessExecutionContext;
	scenario: HarnessScenarioSpec;
	runId: string;
	step: HarnessScenarioSpec['steps'][number];
	target: HarnessTargetRef;
}

export interface HarnessStepExecutionResult {
	status: 'completed' | 'blocked' | 'failed' | 'unsupported';
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

export interface HarnessApprovalDecision {
	approved: boolean;
	approverId?: string;
	reason?: string;
}

export interface HarnessApprovalGateway {
	approve(input: {
		context: HarnessExecutionContext;
		runId: string;
		stepKey: string;
		actionClass: HarnessActionClass;
		target: HarnessTargetRef;
		reasons: string[];
	}): Promise<HarnessApprovalDecision>;
}

export interface HarnessPolicyDecision {
	verdict: HarnessPolicyVerdict;
	requiresApproval: boolean;
	reasons: string[];
}

export interface HarnessRunScenarioInput {
	scenario: HarnessScenarioSpec;
	suiteKey?: string;
	mode?: HarnessExecutionMode;
	target?: Partial<HarnessTargetRef>;
	context?: HarnessExecutionContext;
}

export interface HarnessRunScenarioResult {
	run: HarnessRunRecord;
	artifacts: HarnessStoredArtifact[];
}

export interface HarnessScenarioEvaluationResult {
	evaluationId: string;
	run: HarnessRunRecord;
	artifacts: HarnessStoredArtifact[];
	assertions: HarnessAssertionResult[];
	replayBundleUri?: string;
	status: 'passed' | 'failed' | 'blocked';
}

export interface HarnessSuiteEvaluationSummary {
	suiteKey: string;
	totalScenarios: number;
	passedScenarios: number;
	failedScenarios: number;
	blockedScenarios: number;
	evidenceCount: number;
	passRate: number;
	flakeRate: number;
}

export interface HarnessSuiteEvaluationResult {
	suite: HarnessSuiteSpec;
	evaluations: HarnessScenarioEvaluationResult[];
	summary: HarnessSuiteEvaluationSummary;
}

export interface HarnessReplaySink {
	save(bundle: unknown): Promise<string | undefined>;
}

export interface HarnessScenarioHookExecutionInput {
	context: HarnessExecutionContext;
	scenario: HarnessScenarioSpec;
	runId: string;
	hook: NonNullable<HarnessScenarioSpec['setup']>[number];
	phase: 'setup' | 'reset';
	target: HarnessTargetRef;
}

export interface HarnessScenarioHookExecutionResult {
	status: 'completed' | 'blocked' | 'failed';
	summary?: string;
	output?: unknown;
	artifacts?: HarnessCapturedArtifact[];
	reasons?: string[];
	metadata?: Record<string, unknown>;
}

export interface HarnessScenarioHookExecutor {
	execute(
		input: HarnessScenarioHookExecutionInput
	): Promise<HarnessScenarioHookExecutionResult>;
}

export interface HarnessRunnerOptions {
	targetResolver: HarnessTargetResolver;
	adapters: HarnessExecutionAdapter[];
	artifactStore: HarnessArtifactStore;
	approvalGateway?: HarnessApprovalGateway;
	hookExecutor?: HarnessScenarioHookExecutor;
	now?: () => Date;
	idFactory?: () => string;
	defaultMode?: HarnessExecutionMode;
}

export interface HarnessRecordedStep extends HarnessStepRecord {
	output?: unknown;
}
