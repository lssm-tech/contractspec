/**
 * Vibe workflow types.
 *
 * Platform-agnostic types for workflow execution.
 */

export type Track = 'quick' | 'product' | 'regulated';

export interface WorkflowContext {
  root: string;
  config: Record<string, unknown>;
  dryRun: boolean;
  track: Track;
  json: boolean;
  [key: string]: unknown;
}

export interface WorkflowStep {
  id: string;
  label: string;
  command?: string;
  args?: string[];
  manualCheckpoint?: boolean;
  manualMessage?: string;
  condition?: (ctx: WorkflowContext) => boolean | Promise<boolean>;
  execute?: (ctx: WorkflowContext) => Promise<void>;
  tracks?: Track[];
}

export interface WorkflowStepResult {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'skip';
  command?: string;
  artifactsTouched?: string[];
  error?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
}

export interface WorkflowResult {
  success: boolean;
  steps: WorkflowStepResult[];
  stepsExecuted: string[];
  artifactsTouched: string[];
  error?: Error;
}

export interface VibeConfig {
  canonicalRoot: string;
  workRoot: string;
  generatedRoot: string;
  alwaysInjectFiles: string[];
  contextExportAllowlist: string[];
  [key: string]: unknown;
}

export const DEFAULT_VIBE_CONFIG: VibeConfig = {
  canonicalRoot: 'contracts',
  workRoot: '.contractspec/work',
  generatedRoot: 'src/generated',
  alwaysInjectFiles: [],
  contextExportAllowlist: [],
};
