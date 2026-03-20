import type { OwnerShipMeta } from '../ownership';
import { SpecContractRegistry } from '../registry';
import type { OptionalVersionedSpecRef } from '../versioning';

export type HarnessExecutionMode =
	| 'deterministic-browser'
	| 'visual-computer-use'
	| 'code-execution';

export type HarnessActionClass =
	| 'read'
	| 'navigate'
	| 'login'
	| 'secret-input'
	| 'form-submit'
	| 'upload'
	| 'download'
	| 'payment'
	| 'destructive'
	| 'code-exec-read'
	| 'code-exec-mutate'
	| 'unknown';

export type HarnessPolicyVerdict = 'autonomous' | 'assist' | 'blocked';
export type HarnessTargetIsolation = 'preview' | 'task' | 'shared' | 'sandbox';
export type EvidenceArtifactKind =
	| 'screenshot'
	| 'dom-snapshot'
	| 'console'
	| 'network'
	| 'app-log'
	| 'metric'
	| 'trace'
	| 'step-summary';

export interface HarnessTargetRef {
	targetId: string;
	kind: 'preview' | 'task' | 'shared' | 'sandbox';
	isolation: HarnessTargetIsolation;
	environment: string;
	baseUrl?: string;
	allowlistedDomains?: string[];
	metadata?: Record<string, unknown>;
}

export interface EvidenceArtifact {
	artifactId: string;
	kind: EvidenceArtifactKind;
	runId: string;
	stepId?: string;
	uri: string;
	contentType?: string;
	hash?: string;
	summary?: string;
	createdAt: string;
	metadata?: Record<string, unknown>;
}

export interface HarnessStepRecord {
	stepId: string;
	stepKey: string;
	runId: string;
	mode: HarnessExecutionMode;
	actionClass: HarnessActionClass;
	verdict: HarnessPolicyVerdict;
	requiresApproval: boolean;
	status: 'pending' | 'running' | 'completed' | 'blocked' | 'failed';
	summary?: string;
	startedAt?: string;
	completedAt?: string;
	metadata?: Record<string, unknown>;
}

export interface HarnessAssertionResult {
	assertionKey: string;
	status: 'passed' | 'failed';
	message?: string;
	evidenceArtifactIds?: string[];
}

export interface HarnessRunRecord {
	runId: string;
	status:
		| 'queued'
		| 'running'
		| 'completed'
		| 'blocked'
		| 'failed'
		| 'cancelled';
	mode: HarnessExecutionMode;
	scenarioKey?: string;
	suiteKey?: string;
	controlPlaneExecutionId?: string;
	target: HarnessTargetRef;
	steps: HarnessStepRecord[];
	evidenceCount?: number;
	createdAt: string;
	updatedAt: string;
}

export interface HarnessScenarioHook {
	operation: OptionalVersionedSpecRef;
	input?: unknown;
	description?: string;
}

export interface HarnessScenarioStep {
	key: string;
	description: string;
	mode?: HarnessExecutionMode;
	actionClass: HarnessActionClass;
	intent: string;
	mutatesState?: boolean;
	input?: Record<string, unknown>;
	expectedEvidence?: EvidenceArtifactKind[];
}

export interface HarnessScenarioAssertion {
	key: string;
	type: 'artifact' | 'step-status' | 'text-match' | 'json-match' | 'count';
	description?: string;
	source?: string;
	match?: unknown;
	min?: number;
	max?: number;
}

export interface HarnessScenarioTargetRequirements {
	isolation?: HarnessTargetIsolation;
	allowlistedDomains?: string[];
	preferredTargets?: HarnessTargetRef['kind'][];
}

export type HarnessScenarioMeta = OwnerShipMeta;
export type HarnessScenarioRef = OptionalVersionedSpecRef;

export interface HarnessScenarioSpec {
	meta: HarnessScenarioMeta;
	target: HarnessScenarioTargetRequirements;
	allowedModes: HarnessExecutionMode[];
	setup?: HarnessScenarioHook[];
	reset?: HarnessScenarioHook[];
	steps: HarnessScenarioStep[];
	assertions: HarnessScenarioAssertion[];
	requiredEvidence?: EvidenceArtifactKind[];
	success?: {
		requireAllAssertions?: boolean;
		maxBlockedSteps?: number;
	};
}

export interface HarnessSuiteEntry {
	scenario: HarnessScenarioRef;
	required?: boolean;
	weight?: number;
}

export type HarnessSuiteMeta = OwnerShipMeta;
export type HarnessSuiteRef = OptionalVersionedSpecRef;

export interface HarnessSuiteSpec {
	meta: HarnessSuiteMeta;
	scenarios: HarnessSuiteEntry[];
	summary?: string;
	tags?: string[];
}

export class HarnessScenarioRegistry extends SpecContractRegistry<
	'harness-scenario',
	HarnessScenarioSpec
> {
	public constructor(items?: HarnessScenarioSpec[]) {
		super('harness-scenario', items);
	}
}

export class HarnessSuiteRegistry extends SpecContractRegistry<
	'harness-suite',
	HarnessSuiteSpec
> {
	public constructor(items?: HarnessSuiteSpec[]) {
		super('harness-suite', items);
	}
}

export function defineHarnessScenario(spec: HarnessScenarioSpec) {
	return spec;
}

export function defineHarnessSuite(spec: HarnessSuiteSpec) {
	return spec;
}
