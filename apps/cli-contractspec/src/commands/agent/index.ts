import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs/promises';
import {
  exportToClaudeAgent,
  exportToOpenCode,
} from '@contractspec/lib.ai-agent/exporters';
import type { AgentSpec } from '@contractspec/lib.ai-agent';
import { loadSpecFromFile } from '../../utils/spec-load';

export const agentCommand = new Command('agent');

agentCommand
  .command('export')
  .description('Export agent specification to external agent formats')
  .requiredOption('--spec <file>', 'Path to AgentSpec file')
  .requiredOption(
    '--format <format>',
    'Export format: claude (Claude Agent SDK) or opencode (OpenCode SDK)'
  )
  .option('-o, --output <dir>', 'Output directory', './external-agent')
  .action(async (options) => {
    try {
      console.log(chalk.blue(`Exporting agent spec from ${options.spec}...`));

      // 1. Load spec
      const spec = (await loadSpecFromFile(options.spec)) as AgentSpec;
      if (!spec) {
        throw new Error(`Failed to load spec from ${options.spec}`);
      }

      // 2. Export based on format
      const outputDir = path.resolve(options.output);
      await fs.mkdir(outputDir, { recursive: true });

      if (options.format === 'claude') {
        await exportClaude(spec, outputDir);
      } else if (options.format === 'opencode') {
        await exportOpenCode(spec, outputDir);
      } else {
        throw new Error(
          `Unknown format: ${options.format}. Use 'claude' or 'opencode'.`
        );
      }

      console.log(chalk.green(`\n✅ Export completed to ${options.output}`));
    } catch (error) {
      console.error(
        chalk.red('\n❌ Error exporting agent:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });

async function exportClaude(spec: AgentSpec, outputDir: string) {
  const result = exportToClaudeAgent(spec, {
    generateClaudeMd: true,
    computerUse: false, // Could be an option
  });

  // Write agent.ts (dummy wrapper for now or actual code if we generate generic wrapper)
  // For now, Claude Agent SDK usually expects a project structure.
  // We'll write CLAUDE.md which is useful for "Claude for Work"
  if (result.claudeMd) {
    await fs.writeFile(path.join(outputDir, 'CLAUDE.md'), result.claudeMd);
    console.log(chalk.gray(`- Created CLAUDE.md`));
  }

  // Write permissions.json if available
  // (We could write tools definition here too if needed)
  console.log(
    chalk.yellow(
      `⚠️  Note: Full project generation for Claude Agent SDK is not yet implemented. Generated CLAUDE.md for context.`
    )
  );
}

async function exportOpenCode(spec: AgentSpec, outputDir: string) {
  const result = exportToOpenCode(spec);

  // Write agent config JSON
  if (result.jsonConfig) {
    await fs.writeFile(
      path.join(outputDir, 'agent.json'),
      JSON.stringify(result.jsonConfig, null, 2)
    );
    console.log(chalk.gray(`- Created agent.json`));
  }

  // Write markdown definition
  if (result.markdownConfig) {
    await fs.writeFile(
      path.join(outputDir, `${spec.meta.key}.md`),
      result.markdownConfig
    );
    console.log(chalk.gray(`- Created ${spec.meta.key}.md`));
  }
}
