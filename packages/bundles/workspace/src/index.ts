/**
 * @contractspec/bundle.workspace
 *
 * Reusable use-cases and services for ContractSpec workspace operations.
 */

// Re-export module for convenience
export * as module from '@contractspec/module.workspace';

// Ports (adapter interfaces)
export * from './ports/index';

// Adapters (Node.js implementations)
export * from './adapters/index';

// Types
export type { Config, AiProvider, AgentMode } from './types/config';

// Services (use-cases)
export * from './services/index';

// Formatters (CI output formats)
export * as formatters from './formatters/index';

// Templates (re-export for CLI usage)
export * as templates from './templates';
export * from './ai';
