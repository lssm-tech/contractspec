import type {
	Step,
	WorkflowSpec,
} from '@contractspec/lib.contracts-spec/workflow/spec';
import type {
	WorkflowDevkitHostTarget,
	WorkflowDevkitIntegrationMode,
	WorkflowDevkitStepBehavior,
	WorkflowDevkitStepRuntimeConfig,
} from '@contractspec/lib.contracts-spec/workflow/workflow-devkit';
import type { UIMessageChunk } from 'ai';

export interface WorkflowDevkitCompiledTransition {
	condition?: string;
	to: string;
}

export interface WorkflowDevkitCompiledStep {
	behavior: Step['type'] | WorkflowDevkitStepBehavior;
	id: string;
	label: string;
	operationRef?: string;
	runtime?: WorkflowDevkitStepRuntimeConfig;
	transitions: WorkflowDevkitCompiledTransition[];
	type: Step['type'];
	waitToken?: string;
}

export interface WorkflowDevkitCompilation {
	entryStepId: string;
	hostTarget: WorkflowDevkitHostTarget;
	hookTokenStrategy: string;
	integrationMode: WorkflowDevkitIntegrationMode;
	runIdentityStrategy: string;
	specKey: string;
	specVersion: string;
	steps: WorkflowDevkitCompiledStep[];
}

export interface WorkflowDevkitGeneratedArtifacts {
	genericBootstrap: string;
	manifest: string;
	nextFollowUpRoute: string;
	nextStartRoute: string;
	nextStreamRoute: string;
	workflowModule: string;
}

export interface WorkflowDevkitRuntimeStepContext {
	data: Record<string, unknown>;
	input?: unknown;
	runIdentity?: string;
	runtime?: WorkflowDevkitStepRuntimeConfig;
	spec: WorkflowSpec;
	step: Step;
}

export interface WorkflowDevkitExternalWaitContext
	extends WorkflowDevkitRuntimeStepContext {
	behavior: WorkflowDevkitStepBehavior;
	token: string;
}

export interface WorkflowDevkitRuntimeBridge {
	awaitHumanInput?: (
		context: WorkflowDevkitRuntimeStepContext
	) => Promise<unknown>;
	executeAutomationStep?: (
		context: WorkflowDevkitRuntimeStepContext
	) => Promise<unknown>;
	executeDecisionStep?: (
		context: WorkflowDevkitRuntimeStepContext
	) => Promise<unknown>;
	onApprovalRequested?: (
		context: WorkflowDevkitExternalWaitContext
	) => Promise<void> | void;
	onExternalWait?: (
		context: WorkflowDevkitExternalWaitContext
	) => Promise<void> | void;
	onStreamSession?: (
		context: WorkflowDevkitExternalWaitContext
	) => Promise<void> | void;
}

export interface WorkflowDevkitHookLike<T = unknown>
	extends AsyncIterable<T>,
		PromiseLike<T> {
	dispose?: () => Promise<void> | void;
	token: string;
}

export interface WorkflowDevkitPrimitives {
	createHook: <T = unknown>(options?: {
		token?: string;
	}) => WorkflowDevkitHookLike<T>;
	createWebhook?: <T = unknown>(options?: {
		method?: string;
		path?: string;
		token?: string;
	}) => WorkflowDevkitHookLike<T>;
	sleep: (duration: string) => Promise<void>;
}

export interface WorkflowDevkitExecutionRecord {
	behavior: Step['type'] | WorkflowDevkitStepBehavior;
	input?: unknown;
	output?: unknown;
	stepId: string;
	token?: string;
}

export interface WorkflowDevkitRunResult {
	currentStep: string | null;
	data: Record<string, unknown>;
	history: WorkflowDevkitExecutionRecord[];
	status: 'completed';
}

export interface WorkflowRunReadableLike
	extends ReadableStream<UIMessageChunk> {
	getTailIndex?: () => number | Promise<number>;
}

export interface WorkflowRunLike {
	getReadable?: (options?: { startIndex?: number }) => WorkflowRunReadableLike;
	readable?: WorkflowRunReadableLike;
	runId: string;
}

export interface WorkflowApiLike {
	getRun: (runId: string) => WorkflowRunLike | null | undefined;
	resumeHook: (token: string, payload: unknown) => Promise<unknown>;
	start: (
		workflow: (...args: unknown[]) => Promise<unknown>,
		args: unknown[]
	) => Promise<WorkflowRunLike>;
}
