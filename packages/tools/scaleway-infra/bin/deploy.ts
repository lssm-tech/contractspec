#!/usr/bin/env bun

import { Command } from 'commander';
import { plan, formatPlan } from '../src/commands/plan.js';
import { apply } from '../src/commands/apply.js';
import { destroy } from '../src/commands/destroy.js';
import { status, formatStatus } from '../src/commands/status.js';

const program = new Command();

program
  .name('scaleway-infra')
  .description('Infrastructure-as-code tool for Scaleway resources')
  .version('0.1.0');

program
  .command('plan')
  .description('Show infrastructure plan (dry-run)')
  .option('-e, --env <env>', 'Environment (prd|stg)', 'prd')
  .action(async (options) => {
    try {
      const planResult = await plan(options.env);
      console.log(formatPlan(planResult));
    } catch (error) {
      console.error('Error planning infrastructure:', error);
      process.exit(1);
    }
  });

program
  .command('apply')
  .description('Apply infrastructure changes')
  .option('-e, --env <env>', 'Environment (prd|stg)', 'prd')
  .option('--auto-approve', 'Skip confirmation prompt', false)
  .action(async (options) => {
    try {
      await apply(options.env, options.autoApprove);
    } catch (error) {
      console.error('Error applying infrastructure:', error);
      process.exit(1);
    }
  });

program
  .command('destroy')
  .description('Destroy infrastructure')
  .option('-e, --env <env>', 'Environment (prd|stg)', 'prd')
  .option('--auto-approve', 'Skip confirmation prompt', false)
  .action(async (options) => {
    try {
      await destroy(options.env, options.autoApprove);
    } catch (error) {
      console.error('Error destroying infrastructure:', error);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Show infrastructure status')
  .option('-e, --env <env>', 'Environment (prd|stg)', 'prd')
  .action(async (options) => {
    try {
      const statusResult = await status(options.env);
      console.log(formatStatus(statusResult));
    } catch (error) {
      console.error('Error getting infrastructure status:', error);
      process.exit(1);
    }
  });

program.parse();





