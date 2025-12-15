/**
 * @lssm/bundle.contractspec-workspace
 *
 * Reusable use-cases and services for ContractSpec workspace operations.
 */

// Re-export module for convenience
export * from '@lssm/module.contractspec-workspace';

// Ports (adapter interfaces)
export * from './ports/index';

// Adapters (Node.js implementations)
export * from './adapters/index';

// Types
export type { Config, AiProvider, AgentMode } from './types/config';

// Services (use-cases)
export * from './services/index';

// Templates (re-export for CLI usage)
export * as templates from './templates';
export * as ai from './ai';
