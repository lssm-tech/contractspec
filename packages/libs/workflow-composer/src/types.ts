import type { Step, WorkflowSpec } from '@contractspec/lib.contracts-spec/workflow';

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
