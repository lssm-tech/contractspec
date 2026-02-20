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
import { runSearch } from './cli/search.js';
import { runInfo } from './cli/info.js';
import { runPublish } from './cli/publish.js';
import { runLogin } from './cli/login.js';
import { runModelsExplain } from './cli/models-explain.js';

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

// search
program
  .command('search [query]')
  .description('Search for packs in the registry')
  .option('--tags <tags>', 'Filter by tags (comma-separated)')
  .option('--targets <targets>', 'Filter by targets (comma-separated)')
  .option('--sort <sort>', 'Sort by: downloads, updated, name, weekly')
  .option('-l, --limit <limit>', 'Max results to show')
  .option('-v, --verbose', 'Show additional details')
  .action(async (query: string, options) => {
    await runSearch(query ?? '', options);
  });

// info
program
  .command('info <pack>')
  .description('Show detailed pack information from the registry')
  .action(async (packName: string) => {
    await runInfo(packName);
  });

// publish
program
  .command('publish')
  .description('Publish a pack to the registry')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (options) => {
    await runPublish(resolve('.'), options);
  });

// login
program
  .command('login')
  .description('Authenticate with the agentpacks registry')
  .option('--token <token>', 'API token')
  .option('--registry <url>', 'Registry URL')
  .action(async (options) => {
    await runLogin(options);
  });

// models (parent command)
const modelsCmd = program
  .command('models')
  .description('Model configuration and routing');

modelsCmd
  .command('explain')
  .description('Explain model profile and routing resolution')
  .option('-c, --config <path>', 'Path to agentpacks.yaml')
  .option('-p, --profile <name>', 'Profile to activate')
  .option('-t, --target <id>', 'Target to resolve for')
  .option('--task <description>', 'Task description for routing match')
  .action((options) => {
    runModelsExplain(options);
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
