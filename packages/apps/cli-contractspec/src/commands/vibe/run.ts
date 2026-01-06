import { Command } from 'commander';
import chalk from 'chalk';
import { select } from '@inquirer/prompts';
import { findWorkspaceRoot } from '@contractspec/bundle.workspace';
import { runWorkflow } from './workflows/engine';
import { loadWorkflows, getWorkflow } from './workflows/loader';
import { loadVibeConfig } from './config';
import type { Track } from './workflows/types';

export const vibeRunCommand = new Command('run')
  .description('Run a managed workflow')
  .argument('[workflow]', 'Workflow ID to run')
  .option('-t, --track <track>', 'Track profile: quick, product, regulated', 'product')
  .option('--dry-run', 'Print steps without executing', false)
  .option('--json', 'Output results as JSON', false)
  .option('--no-clean', 'Skip cleanup steps', false)
  .action(async (workflowId, options) => {
    try {
      const cwd = process.cwd();
      const root = findWorkspaceRoot(cwd) || cwd;
      const config = await loadVibeConfig();

      let selectedId = workflowId;

      const workflows = await loadWorkflows();

      // Interactive selection if no workflow provided
      if (!selectedId) {
        if (options.json) {
           console.error(JSON.stringify({ error: 'Workflow ID required in JSON mode' }));
           process.exit(1);
        }
        
        selectedId = await select({
            message: 'Select a workflow to run:',
            choices: workflows.map(w => ({
                value: w.id,
                name: `${w.name} ${chalk.gray(`(${w.id})`)}`,
                description: w.description
            }))
        });
      }

      const workflow = await getWorkflow(selectedId);
      if (!workflow) {
        console.error(chalk.red(`Workflow '${selectedId}' not found.`));
        if (!options.json) {
            console.log('Available workflows:');
            workflows.forEach(w => console.log(` - ${w.id}`));
        }
        process.exit(1);
      }

      const context = {
        root,
        config,
        dryRun: options.dryRun,
        track: options.track as Track,
        json: options.json,
        noClean: !options.clean // handling --no-clean property
      };

      const results = await runWorkflow(workflow, context);

      if (options.json) {
        console.log(JSON.stringify(results, null, 2));
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
  });
