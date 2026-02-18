#!/usr/bin/env node

import { Command } from 'commander';
import { resolve } from 'path';
import { runInit } from './cli/init.js';
import { runGenerate } from './cli/generate.js';
import { runImport } from './cli/import-cmd.js';
import { runPackCreate } from './cli/pack/create.js';
import { runPackList } from './cli/pack/list.js';
import { runPackValidate } from './cli/pack/validate.js';

const program = new Command();

program
  .name('agentpacks')
  .description(
    'Composable AI agent configuration manager. Pack-based rules, commands, skills, hooks, and MCP sync across OpenCode, Cursor, Claude Code, Codex, Gemini, Copilot, and more.'
  )
  .version('0.1.0');

// init
program
  .command('init')
  .description('Initialize agentpacks in the current project')
  .action(() => {
    runInit(resolve('.'));
  });

// generate
program
  .command('generate')
  .description('Generate tool configs from active packs')
  .option(
    '-t, --targets <targets>',
    "Comma-separated target IDs or '*' for all"
  )
  .option(
    '-f, --features <features>',
    "Comma-separated feature IDs or '*' for all"
  )
  .option('--dry-run', 'Preview changes without writing files')
  .option('-v, --verbose', 'Enable verbose logging')
  .action((options) => {
    runGenerate(resolve('.'), options);
  });

// import
program
  .command('import')
  .description('Import from existing tool configurations')
  .requiredOption('--from <source>', 'Import source (rulesync)')
  .option('-o, --output <dir>', 'Output pack directory')
  .action((options) => {
    runImport(resolve('.'), options);
  });

// pack (parent command)
const packCmd = program.command('pack').description('Manage packs');

// pack create
packCmd
  .command('create <name>')
  .description('Create a new pack scaffold')
  .action((name: string) => {
    runPackCreate(resolve('.'), name);
  });

// pack list
packCmd
  .command('list')
  .description('List all configured packs and their status')
  .action(() => {
    runPackList(resolve('.'));
  });

// pack validate
packCmd
  .command('validate')
  .description('Validate all configured packs')
  .action(() => {
    runPackValidate(resolve('.'));
  });

program.parse();
