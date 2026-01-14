/**
 * Vibe workflow execution engine.
 *
 * Executes workflow steps with track filtering, conditions, and manual checkpoints.
 */

import { spawn } from 'node:child_process';
import type {
  Workflow,
  WorkflowContext,
  WorkflowResult,
  WorkflowStepResult,
} from './types';

/**
 * Console output adapter for workflow execution.
 * Allows customization of output (e.g., silent mode, JSON mode).
 */
export interface WorkflowLogger {
  log: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
}

/**
 * Prompt adapter for manual checkpoints.
 */
export interface WorkflowPrompter {
  select: (options: {
    message: string;
    choices: { name: string; value: string; description?: string }[];
  }) => Promise<string>;
}

/**
 * No-op logger for silent execution.
 */
export const silentLogger: WorkflowLogger = {
  log: () => {
    /* noop */
  },
  warn: () => {
    /* noop */
  },
  error: () => {
    /* noop */
  },
};

/**
 * Console logger for CLI output.
 */
export const consoleLogger: WorkflowLogger = {
  log: (msg) => console.log(msg),
  warn: (msg) => console.warn(msg),
  error: (msg) => console.error(msg),
};

/**
 * Run a workflow with the given context.
 */
export async function runWorkflow(
  workflow: Workflow,
  context: WorkflowContext,
  options?: {
    logger?: WorkflowLogger;
    prompter?: WorkflowPrompter;
  }
): Promise<WorkflowResult> {
  const logger = options?.logger ?? consoleLogger;
  const prompter = options?.prompter;

  logger.log(`\nRunning Workflow: ${workflow.name}`);
  if (workflow.description) {
    logger.log(workflow.description);
  }
  logger.log(`Track: ${context.track}`);
  if (context.dryRun) {
    logger.warn('🚧 DRY RUN MODE: No changes will be made.\n');
  }

  const results: WorkflowResult = {
    success: true,
    steps: [],
    stepsExecuted: [],
    artifactsTouched: [],
  };

  for (const step of workflow.steps) {
    const stepResult: WorkflowStepResult = {
      id: step.id,
      name: step.label,
      status: 'skip',
      command: step.command,
    };

    // 1. Check tracks
    if (step.tracks && !step.tracks.includes(context.track)) {
      results.steps.push(stepResult);
      continue;
    }

    // 2. Check condition
    if (step.condition) {
      const shouldRun = await step.condition(context);
      if (!shouldRun) {
        results.steps.push(stepResult);
        continue;
      }
    }

    // 3. Print step header
    logger.log(`\n👉 Step: ${step.label}`);
    if (context.dryRun && step.command) {
      logger.log(`   Command: ${step.command}`);
    }

    // 4. Manual Checkpoint
    if (step.manualCheckpoint) {
      if (context.dryRun) {
        logger.warn('   [Manual Checkpoint] Would pause here for user input.');
      } else if (prompter) {
        if (step.manualMessage) {
          logger.log(step.manualMessage);
        }

        const choice = await prompter.select({
          message: 'Checkpoint action:',
          choices: [
            { name: 'Proceed', value: 'proceed', description: 'Run this step' },
            {
              name: 'Skip Step',
              value: 'skip',
              description: 'Skip this step and continue',
            },
            {
              name: 'Abort Workflow',
              value: 'abort',
              description: 'Exit workflow',
            },
          ],
        });

        if (choice === 'abort') {
          logger.warn('Workflow aborted by user.');
          results.success = false;
          results.steps.push({
            ...stepResult,
            status: 'skip',
            error: 'Aborted by user',
          });
          return results;
        }

        if (choice === 'skip') {
          logger.warn('   → Skipped by user.');
          results.steps.push(stepResult);
          continue;
        }
      }
    }

    // 5. Execution
    if (!context.dryRun) {
      try {
        if (step.execute) {
          await step.execute(context);
        } else if (step.command) {
          await runShellCommand(step.command, context.root);
        }
        stepResult.status = 'pass';
        results.stepsExecuted.push(step.id);
        results.steps.push(stepResult);
        logger.log('   ✓ Completed');
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        logger.error(`   ❌ Failed: ${errorMsg}`);
        results.success = false;
        results.error =
          error instanceof Error ? error : new Error(String(error));
        stepResult.status = 'fail';
        stepResult.error = errorMsg;
        results.stepsExecuted.push(step.id);
        results.steps.push(stepResult);
        return results;
      }
    } else {
      results.steps.push(stepResult);
    }
  }

  return results;
}

/**
 * Execute a shell command.
 */
async function runShellCommand(command: string, cwd: string): Promise<void> {
  const parts = command.split(' ');
  const cmd = parts[0];
  const args = parts.slice(1);

  if (!cmd) throw new Error('Invalid command');

  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: true,
    });

    child.on('error', reject);
    child.on('exit', (code: number | null) => {
      if (code === 0) resolve();
      else reject(new Error(`Command exited with code ${code}`));
    });
  });
}
