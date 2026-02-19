#!/usr/bin/env node

import { Command } from 'commander';
import { resolve } from 'path';
import { runInit } from './cli/init.js';
import { runGenerate } from './cli/generate.js';
import { runImport } from './cli/import-cmd.js';
import { runPackCreate } from './cli/pack/create.js';
import { runPackList } from './cli/pack/list.js';
import { runPackValidate } from './cli/pack/validate.js';
import { runInstall } from './cli/install.js';
import { runPackEnable, runPackDisable } from './cli/pack/enable.js';
import { runExport } from './cli/export-cmd.js';

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
  .option('--diff', 'Show diff of what would change')
  .option('-v, --verbose', 'Enable verbose logging')
  .action((options) => {
    runGenerate(resolve('.'), options);
  });

// install
program
  .command('install')
  .description('Install remote packs (git, npm) into local cache')
  .option('--update', 'Re-resolve all refs (ignore lockfile)')
  .option('--frozen', 'Fail if lockfile is missing or incomplete')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (options) => {
    await runInstall(resolve('.'), options);
  });

// export
program
  .command('export')
  .description('Export packs to target-native format (e.g. Cursor plugin)')
  .requiredOption('--format <format>', 'Export format (cursor-plugin)')
  .option('-o, --output <dir>', 'Output directory')
  .option('--pack <name>', 'Export a specific pack only')
  .option('-v, --verbose', 'Enable verbose logging')
  .action((options) => {
    runExport(resolve('.'), options);
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

// pack enable
packCmd
  .command('enable <name>')
  .description('Enable a previously disabled pack')
  .action((name: string) => {
    runPackEnable(resolve('.'), name);
  });

// pack disable
packCmd
  .command('disable <name>')
  .description('Disable a pack without removing it')
  .action((name: string) => {
    runPackDisable(resolve('.'), name);
  });

program.parse();
