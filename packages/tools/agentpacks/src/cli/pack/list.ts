import chalk from 'chalk';
import { loadWorkspaceConfig } from '../../core/config.js';
import { PackLoader } from '../../core/pack-loader.js';

/**
 * List all packs and their status.
 */
export function runPackList(projectRoot: string): void {
  const config = loadWorkspaceConfig(projectRoot);
  const loader = new PackLoader(projectRoot, config);
  const { packs, warnings } = loader.loadAll();
  const disabledSet = new Set(config.disabled);

  for (const w of warnings) {
    console.log(chalk.yellow(`  warn: ${w}`));
  }

  if (packs.length === 0 && config.packs.length === 0) {
    console.log(
      chalk.dim("No packs configured. Run 'agentpacks init' to get started.")
    );
    return;
  }

  console.log(chalk.bold('Active packs:\n'));

  for (const pack of packs) {
    const m = pack.manifest;
    const features: string[] = [];
    if (pack.rules.length > 0) features.push(`${pack.rules.length} rules`);
    if (pack.commands.length > 0)
      features.push(`${pack.commands.length} commands`);
    if (pack.agents.length > 0) features.push(`${pack.agents.length} agents`);
    if (pack.skills.length > 0) features.push(`${pack.skills.length} skills`);
    if (pack.hooks) features.push('hooks');
    if (pack.plugins.length > 0)
      features.push(`${pack.plugins.length} plugins`);
    if (pack.mcp)
      features.push(`${Object.keys(pack.mcp.servers).length} MCP servers`);
    if (pack.ignore) features.push('ignore');

    const status = disabledSet.has(m.name)
      ? chalk.red('[disabled]')
      : chalk.green('[active]');

    console.log(`  ${status} ${chalk.bold(m.name)} v${m.version}`);
    if (m.description) {
      console.log(`    ${chalk.dim(m.description)}`);
    }
    if (features.length > 0) {
      console.log(`    ${chalk.dim(features.join(', '))}`);
    }
    console.log();
  }

  // Show disabled packs that weren't loaded
  for (const ref of config.disabled) {
    if (!packs.some((p) => p.manifest.name === ref)) {
      console.log(`  ${chalk.red('[disabled]')} ${chalk.dim(ref)}`);
    }
  }
}
