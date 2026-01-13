/**
 * Vibe workflow service.
 *
 * Platform-agnostic workflow engine for managing ContractSpec workflows.
 */

// Types
export type {
  Track,
  WorkflowContext,
  WorkflowStep,
  WorkflowStepResult,
  Workflow,
  WorkflowResult,
  VibeConfig,
} from './types';
export { DEFAULT_VIBE_CONFIG } from './types';

// Config
export { loadVibeConfig } from './config';

// Engine
export {
  runWorkflow,
  type WorkflowLogger,
  type WorkflowPrompter,
  silentLogger,
  consoleLogger,
} from './engine';

// Loader
export { loadWorkflows, getWorkflow } from './loader';

// Definitions
export { builtinWorkflows } from './definitions';

// Context
export { exportContext, type ContextExportResult } from './context';

// Pack
export { installPack, type PackInstallResult } from './pack';
