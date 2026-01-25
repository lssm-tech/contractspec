export * from './spec';
export * from './validation';
export * from './state';
export * from './runner';
export * from './expression';
export * from './adapters';
export * from './context';
export * from './sla-monitor';

import type { WorkflowSpec } from './spec';

/**
 * Helper to define a Workflow.
 */
export const defineWorkflow = (spec: WorkflowSpec): WorkflowSpec => spec;
