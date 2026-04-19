/**
 * @contractspec/bundle.workspace
 *
 * Reusable use-cases and services for ContractSpec workspace operations.
 */

// Re-export module for convenience
export * as module from '@contractspec/module.workspace';
// Adapters (Node.js implementations)
export * from './adapters/index';
export * from './ai';
export * from './bundles/WorkspaceBundle';
// Formatters (CI output formats)
export * as formatters from './formatters/index';
// Ports (adapter interfaces)
export * from './ports/index';
// Operation registry
export * from './registry';
export type { FixableIssue, FixStrategyType } from './services/fix/types';
// Services (use-cases)
export * from './services/index';
// Templates (re-export for CLI usage)
export * as templates from './templates';
// Utilities
export * as utils from './utils/index';
