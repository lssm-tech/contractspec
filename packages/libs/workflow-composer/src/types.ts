import type { ModelSelector } from '@contractspec/lib.ai-providers/selector-types';
import type {
	Step,
	StepModelHints,
	WorkflowSpec,
} from '@contractspec/lib.contracts-spec/workflow';

/**
 * Context provided to operation executors during workflow step execution.
 * Includes an optional ranking-driven model selector for AI-powered steps.
 */
export interface OperationExecutorContext {
	tenantId?: string;
	role?: string;
	/** Ranking-driven model selector; executors should use this when selecting AI models. */
	modelSelector?: ModelSelector;
	/** Model hints from the current step, if any. */
	stepModelHints?: StepModelHints;
	metadata?: Record<string, unknown>;
}

export interface WorkflowExtensionScope {
	tenantId?: string;
	role?: string;
	device?: string;
}

export interface StepInjection {
	id?: string;
	after?: string;
	before?: string;
	inject: Step;
	when?: string;
	transitionTo?: string;
	transitionFrom?: string;
}

export interface WorkflowExtension extends WorkflowExtensionScope {
	workflow: string;
	baseVersion?: string;
	priority?: number;
	customSteps?: StepInjection[];
	hiddenSteps?: string[];
	metadata?: Record<string, unknown>;
	annotations?: Record<string, unknown>;
}

export interface ComposeParams extends WorkflowExtensionScope {
	base: WorkflowSpec;
}
