/**
 * Vibe run command.
 *
 * Thin CLI adapter - business logic is in @contractspec/bundle.workspace.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { select } from '@inquirer/prompts';
import { vibe, findWorkspaceRoot } from '@contractspec/bundle.workspace';

export const vibeRunCommand = new Command('run')
  .description('Run a managed workflow')
  .argument('[workflow]', 'Workflow ID to run')
  .option(
    '-t, --track <track>',
    'Track profile: quick, product, regulated',
    'product'
  )
  .option('--dry-run', 'Print steps without executing', false)
  .option('--json', 'Output results as JSON', false)
  .option('--no-clean', 'Skip cleanup steps', false)
  .option('--fail-fast', 'Stop on first step failure', false)
  .option('--non-interactive', 'Skip all prompts', false)
  .action(runVibeRunCommand);

export interface VibeRunCommandOptions {
  track: string;
  dryRun?: boolean;
  json?: boolean;
  clean?: boolean;
  failFast?: boolean;
  nonInteractive?: boolean;
}

/**
 * Dependencies interface for testability.
 */
export interface VibeRunDeps {
  runWorkflow: typeof vibe.runWorkflow;
  loadWorkflows: typeof vibe.loadWorkflows;
  getWorkflow: typeof vibe.getWorkflow;
  loadVibeConfig: typeof vibe.loadVibeConfig;
  findWorkspaceRoot: typeof findWorkspaceRoot;
}

const defaultDeps: VibeRunDeps = {
  runWorkflow: vibe.runWorkflow,
  loadWorkflows: vibe.loadWorkflows,
  getWorkflow: vibe.getWorkflow,
  loadVibeConfig: vibe.loadVibeConfig,
  findWorkspaceRoot,
};

export async function runVibeRunCommand(
  workflowId: string | undefined,
  options: VibeRunCommandOptions,
  deps: VibeRunDeps = defaultDeps
) {
  try {
    const cwd = process.cwd();
    const root = deps.findWorkspaceRoot(cwd) || cwd;
    const config = await deps.loadVibeConfig(cwd);

    let selectedId = workflowId;

    const workflows = await deps.loadWorkflows(cwd);

    // Interactive selection if no workflow provided
    if (!selectedId) {
      if (options.json || options.nonInteractive) {
        console.error(
          JSON.stringify({
            error: 'Workflow ID required in non-interactive/JSON mode',
          })
        );
        process.exit(1);
      }

      selectedId = await select({
        message: 'Select a workflow to run:',
        choices: workflows.map((w) => ({
          value: w.id,
          name: `${w.name} ${chalk.gray(`(${w.id})`)}`,
          description: w.description,
        })),
      });
    }

    const workflow = await deps.getWorkflow(selectedId, cwd);
    if (!workflow) {
      console.error(chalk.red(`Workflow '${selectedId}' not found.`));
      if (!options.json) {
        console.log('Available workflows:');
        workflows.forEach((w) => console.log(` - ${w.id}`));
      }
      process.exit(1);
    }

    const context: vibe.WorkflowContext = {
      root,
      config,
      dryRun: options.dryRun ?? false,
      track: options.track as vibe.Track,
      json: options.json ?? false,
      noClean: !options.clean,
      failFast: options.failFast ?? false,
      nonInteractive: options.nonInteractive ?? false,
    };

    // Create CLI-specific logger with chalk
    const logger: vibe.WorkflowLogger = {
      log: (msg) => console.log(chalk.cyan(msg)),
      warn: (msg) => console.log(chalk.yellow(msg)),
      error: (msg) => console.error(chalk.red(msg)),
    };

    // Create CLI-specific prompter
    const prompter: vibe.WorkflowPrompter = {
      select: async (opts) => {
        const result = await select({
          message: opts.message,
          choices: opts.choices.map((c) => ({
            value: c.value,
            name: c.name,
            description: c.description,
          })),
        });
        return result;
      },
    };

    const results = await deps.runWorkflow(workflow, context, {
      logger,
      prompter,
    });

    if (options.json) {
      const output = {
        schemaVersion: '1.0',
        workflow: selectedId,
        track: context.track,
        steps: results.steps.map((s) => ({
          name: s.id,
          status: s.status,
          command: s.command,
          artifactsTouched: s.artifactsTouched,
          error: s.error,
        })),
        result: {
          status: results.success ? 'pass' : 'fail',
          exitCode: results.success ? 0 : 1,
          error: results.error?.message,
        },
      };
      console.log(JSON.stringify(output, null, 2));
    } else {
      if (results.success) {
        console.log(chalk.bold.green('\n✅ Workflow completed successfully!'));
      } else {
        console.log(chalk.bold.red('\n❌ Workflow failed.'));
        process.exit(1);
      }
    }
  } catch (error) {
    if (options.json) {
      console.log(JSON.stringify({ success: false, error: String(error) }));
    } else {
      console.error(chalk.red('\n❌ Error:'), error);
    }
    process.exit(1);
  }
}
