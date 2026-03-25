export * from './adapters';
export * from './context';
export * from './expression';
export * from './runner';
export * from './sla-monitor';
export * from './spec';
export * from './state';
export * from './validation';
export * from './workflow-devkit';

import type { WorkflowSpec } from './spec';

/**
 * Helper to define a Workflow.
 */
export const defineWorkflow = (spec: WorkflowSpec): WorkflowSpec => spec;
