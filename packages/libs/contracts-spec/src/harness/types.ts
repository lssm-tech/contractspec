import type { OwnerShipMeta } from '../ownership';
import { SpecContractRegistry } from '../registry';
import type { OptionalVersionedSpecRef } from '../versioning';

export type HarnessExecutionMode =
	| 'deterministic-browser'
	| 'visual-computer-use'
	| 'code-execution';

export type HarnessBrowserEngine = 'playwright' | 'agent-browser' | 'both';

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
	| 'visual-diff'
	| 'accessibility-snapshot'
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

export interface HarnessBrowserViewport {
	width: number;
	height: number;
}

export interface HarnessBrowserAuthProfileRef {
	key: string;
	kind: 'storage-state' | 'browser-profile' | 'session-name' | 'headers-env';
	ref: string;
}

export type HarnessBrowserAction =
	| { type: 'click'; selector: string }
	| { type: 'dblclick'; selector: string }
	| { type: 'fill'; selector: string; value: string }
	| { type: 'type'; selector: string; value: string }
	| { type: 'press'; key: string }
	| { type: 'select'; selector: string; value: string | string[] }
	| { type: 'check'; selector: string }
	| { type: 'uncheck'; selector: string }
	| { type: 'hover'; selector: string }
	| {
			type: 'wait';
			selector?: string;
			text?: string;
			url?: string;
			load?: 'domcontentloaded' | 'load' | 'networkidle';
			ms?: number;
	  }
	| { type: 'snapshot'; selector?: string }
	| { type: 'screenshot'; fullPage?: boolean }
	| {
			type: 'get';
			target: 'text' | 'html' | 'value' | 'title' | 'url';
			selector?: string;
	  };

export interface HarnessVisualDiffInput {
	baselinePath: string;
	maxDiffBytes?: number;
	maxDiffRatio?: number;
	updateBaseline?: boolean;
}

export interface HarnessBrowserStepInput {
	url?: string;
	actions?: HarnessBrowserAction[];
	authProfile?: string | HarnessBrowserAuthProfileRef;
	viewport?: HarnessBrowserViewport;
	headersEnv?: string;
	visual?: HarnessVisualDiffInput;
	capture?: {
		screenshot?: boolean;
		dom?: boolean;
		console?: boolean;
		network?: boolean;
		accessibilitySnapshot?: boolean;
	};
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
	type:
		| 'artifact'
		| 'step-status'
		| 'text-match'
		| 'json-match'
		| 'count'
		| 'visual-diff';
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
