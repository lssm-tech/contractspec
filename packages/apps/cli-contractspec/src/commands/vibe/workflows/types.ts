
export type Track = 'quick' | 'product' | 'regulated';

export interface WorkflowContext {
  root: string;
  config: any;
  dryRun: boolean;
  track: Track;
  json: boolean;
  [key: string]: any;
}

export interface WorkflowStep {
  id: string;
  label: string; // Human readable
  command?: string; // e.g. "contractspec extract ..."
  args?: string[];
  
  // If true, pauses and asks for user confirmation (or just prints instructions in P0)
  manualCheckpoint?: boolean; 
  manualMessage?: string;

  // Function to determine if step should run
  condition?: (ctx: WorkflowContext) => boolean | Promise<boolean>;

  // Function to execute the step (internal execution)
  execute?: (ctx: WorkflowContext) => Promise<void>;
  
  // Tracks where this step is active. If undefined, active for all.
  tracks?: Track[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
}
