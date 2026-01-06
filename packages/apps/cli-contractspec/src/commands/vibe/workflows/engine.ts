import chalk from 'chalk';
import { confirm, select } from '@inquirer/prompts';
import { spawn } from 'node:child_process';
import type { Workflow, WorkflowContext, WorkflowStep } from './types';

export interface WorkflowResult {
  success: boolean;
  stepsExecuted: string[];
  artifactsTouched: string[];
  error?: Error;
}

export async function runWorkflow(workflow: Workflow, context: WorkflowContext): Promise<WorkflowResult> {
  console.log(chalk.bold(`\nRunning Workflow: ${chalk.cyan(workflow.name)}`));
  if (workflow.description) {
    console.log(chalk.gray(workflow.description));
  }
  console.log(chalk.gray(`Track: ${context.track}`));
  if (context.dryRun) {
    console.log(chalk.yellow('🚧 DRY RUN MODE: No changes will be made.\n'));
  }

  const results: WorkflowResult = {
    success: true,
    stepsExecuted: [],
    artifactsTouched: [],
  };

  for (const step of workflow.steps) {
    // 1. Check tracks
    if (step.tracks && !step.tracks.includes(context.track)) {
      if (context.json) {
         // Maybe log skip
      }
      continue;
    }

    // 2. Check condition
    if (step.condition) {
      const shouldRun = await step.condition(context);
      if (!shouldRun) {
        continue;
      }
    }

    // 3. Print step header
    console.log(chalk.bold(`\n👉 Step: ${step.label}`));
    if (context.dryRun && step.command) {
      console.log(chalk.gray(`   Command: ${step.command}`));
    }

    // 4. Manual Checkpoint
    if (step.manualCheckpoint) {
      if (context.dryRun) {
        console.log(chalk.yellow('   [Manual Checkpoint] Would pause here for user input.'));
      } else {
        if (step.manualMessage) {
            console.log(chalk.blue(step.manualMessage));
        }
        
        const choice = await select({
            message: 'Checkpoint action:',
            choices: [
                { name: 'Proceed', value: 'proceed', description: 'Run this step' },
                { name: 'Skip Step', value: 'skip', description: 'Skip this step and continue' },
                { name: 'Abort Workflow', value: 'abort', description: 'Exit workflow' }
            ]
        });
        
        if (choice === 'abort') {
            console.log(chalk.yellow('Workflow aborted by user.'));
            results.success = false;
            return results;
        }
        
        if (choice === 'skip') {
            console.log(chalk.yellow('   → Skipped by user.'));
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
            } else {
                // No op (maybe just manual step)
            }
            results.stepsExecuted.push(step.id);
            console.log(chalk.green(`   ✓ Completed`));
        } catch (error) {
            // Interactive retry?
            // For now just fail. P2: Retry prompt.
            console.error(chalk.red(`   ❌ Failed: ${error instanceof Error ? error.message : String(error)}`));
            results.success = false;
            results.error = error instanceof Error ? error : new Error(String(error));
            return results;
        }
    } else {
        // Record as skipped/dry-run
        results.stepsExecuted.push(`${step.id} (dry-run)`);
    }
  }

  return results;
}

async function runShellCommand(command: string, cwd: string): Promise<void> {
    const parts = command.split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);
    
    if (!cmd) throw new Error('Invalid command');
    
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args, {
            cwd,
            stdio: 'inherit',
            shell: true // important for finding command in path
        });

        child.on('error', reject);
        child.on('exit', (code: number | null) => {
            if (code === 0) resolve();
            else reject(new Error(`Command exited with code ${code}`));
        });
    });
}
