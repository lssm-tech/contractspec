export * from './spec';
export * from './validation';
export * from './state';
export * from './runner';
export * from './expression';
export * from './adapters';

import type { WorkflowSpec } from './spec';

/**
 * Helper to define a Workflow.
 */
export const defineWorkflow = (spec: WorkflowSpec): WorkflowSpec => spec;
