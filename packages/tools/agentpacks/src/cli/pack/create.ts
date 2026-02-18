import { existsSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';
import chalk from 'chalk';
import { ensureDir } from '../../utils/filesystem.js';

/**
 * Create a new pack scaffold.
 */
export function runPackCreate(projectRoot: string, name: string): void {
  const packDir = resolve(projectRoot, 'packs', name);

  if (existsSync(packDir)) {
    console.log(chalk.red(`Pack "${name}" already exists at packs/${name}/`));
    return;
  }

  ensureDir(packDir);
  ensureDir(join(packDir, 'rules'));
  ensureDir(join(packDir, 'commands'));
  ensureDir(join(packDir, 'agents'));
  ensureDir(join(packDir, 'skills'));

  const packJson = {
    name,
    version: '1.0.0',
    description: '',
    tags: [],
    dependencies: [],
    conflicts: [],
    targets: '*',
    features: '*',
  };

  writeFileSync(
    join(packDir, 'pack.json'),
    JSON.stringify(packJson, null, 2) + '\n'
  );

  console.log(chalk.green(`Created pack "${name}" at packs/${name}/`));
  console.log(
    chalk.dim(
      '  Add rules, commands, agents, skills, hooks, plugins, mcp.json, or ignore files.'
    )
  );
  console.log(
    chalk.dim(
      `  Then add "${join('./packs', name)}" to packs[] in agentpacks.jsonc.`
    )
  );
}
