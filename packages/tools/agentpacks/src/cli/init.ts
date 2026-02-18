import { existsSync, copyFileSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';
import chalk from 'chalk';
import { ensureDir } from '../utils/filesystem.js';

/**
 * Initialize a project with agentpacks.
 * Creates agentpacks.jsonc and a default pack scaffold.
 */
export function runInit(projectRoot: string): void {
  const configPath = resolve(projectRoot, 'agentpacks.jsonc');
  const packsDir = resolve(projectRoot, 'packs', 'default');

  // Check if already initialized
  if (existsSync(configPath)) {
    console.log(
      chalk.yellow('agentpacks.jsonc already exists. Skipping config creation.')
    );
  } else {
    // Create agentpacks.jsonc from template
    const templateDir = resolve(import.meta.dirname, '..', '..', 'templates');
    const templateConfig = resolve(
      templateDir,
      'workspace',
      'agentpacks.jsonc'
    );

    if (existsSync(templateConfig)) {
      copyFileSync(templateConfig, configPath);
    } else {
      // Inline fallback
      const config = {
        $schema: 'https://unpkg.com/agentpacks/schema.json',
        packs: ['./packs/default'],
        disabled: [],
        targets: [
          'opencode',
          'cursor',
          'claudecode',
          'geminicli',
          'codexcli',
          'copilot',
        ],
        features: ['*'],
        mode: 'repo',
        baseDirs: ['.'],
        global: false,
        delete: true,
      };
      writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
    }
    console.log(chalk.green('Created agentpacks.jsonc'));
  }

  // Create default pack
  if (existsSync(packsDir)) {
    console.log(
      chalk.yellow('packs/default/ already exists. Skipping pack scaffold.')
    );
  } else {
    ensureDir(packsDir);
    ensureDir(join(packsDir, 'rules'));
    ensureDir(join(packsDir, 'commands'));
    ensureDir(join(packsDir, 'agents'));
    ensureDir(join(packsDir, 'skills'));

    // Create pack.json
    const packJson = {
      name: 'default',
      version: '1.0.0',
      description: 'Default project pack',
      tags: [],
      dependencies: [],
      conflicts: [],
      targets: '*',
      features: '*',
    };
    writeFileSync(
      join(packsDir, 'pack.json'),
      JSON.stringify(packJson, null, 2) + '\n'
    );

    // Create overview rule from template
    const templateRule = resolve(
      import.meta.dirname,
      '..',
      '..',
      'templates',
      'pack',
      'rules',
      'overview.md'
    );
    if (existsSync(templateRule)) {
      copyFileSync(templateRule, join(packsDir, 'rules', 'overview.md'));
    }

    console.log(chalk.green('Created packs/default/ with scaffold'));
  }

  console.log(
    chalk.cyan('\nNext steps:'),
    '\n  1. Edit packs/default/rules/overview.md with your project guidelines',
    '\n  2. Run',
    chalk.bold('agentpacks generate'),
    'to generate tool configs',
    '\n  3. Or run',
    chalk.bold('agentpacks import --from rulesync'),
    'to migrate from rulesync'
  );
}
