/**
 * Vibe workflow service.
 *
 * Platform-agnostic workflow engine for managing ContractSpec workflows.
 */

// Config
export { loadVibeConfig } from './config';
// Context
export { type ContextExportResult, exportContext } from './context';
// Definitions
export { builtinWorkflows } from './definitions';

// Engine
export {
	consoleLogger,
	runWorkflow,
	silentLogger,
	type WorkflowLogger,
	type WorkflowPrompter,
} from './engine';

// Loader
export { getWorkflow, loadWorkflows } from './loader';
// Pack
export { installPack, type PackInstallResult } from './pack';
// Types
export type {
	Track,
	VibeConfig,
	Workflow,
	WorkflowContext,
	WorkflowResult,
	WorkflowStep,
	WorkflowStepResult,
} from './types';
export { DEFAULT_VIBE_CONFIG } from './types';
