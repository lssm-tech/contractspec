/**
 * LLM Guide Command
 *
 * Generate implementation guides for AI coding agents.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'path';
import { existsSync, writeFileSync } from 'fs';
import type { AgentType } from '@contractspec/lib.contracts/llm';
import { loadSpecFromSource } from '@contractspec/module.workspace';
import {
  generateGuideFromParsedSpec,
  generateCursorRulesFromParsedSpec,
} from '@contractspec/bundle.workspace';

export const guideLLMCommand = new Command('guide')
  .description('Generate an implementation guide for AI coding agents')
  .argument('<spec-file>', 'Path to the spec file')
  .option(
    '-a, --agent <type>',
    'Agent type: claude-code, cursor-cli, generic-mcp',
    'generic-mcp'
  )
  .option('-o, --output <file>', 'Output file (default: stdout)')
  .option('--cursor-rules', 'Generate Cursor rules file instead of guide')
  .action(async (specFile, options) => {
    try {
      console.log(chalk.blue(`\n🤖 Generating guide for ${specFile}...\n`));

      const fullPath = resolve(process.cwd(), specFile);
      if (!existsSync(fullPath)) {
        throw new Error(`Spec file not found: ${specFile}`);
      }

      // Load with static analysis
      const specs = await loadSpecFromSource(fullPath);
      if (specs.length === 0) {
        throw new Error('No spec definitions found');
      }

      const spec = specs[0];
      const agent = options.agent as AgentType;

      let output: string;

      // Generate cursor rules if requested
      if (options.cursorRules) {
        output = generateCursorRulesFromParsedSpec(spec);
        if (options.output && !options.output.endsWith('.mdc')) {
             console.warn(chalk.yellow('Warning: Cursor rules usually use .mdc extension'));
        }
      } else {
        // Generate the guide
        output = generateGuideFromParsedSpec(spec, agent);
      }

      // Output based on destination
      if (options.output) {
        const outputPath = resolve(process.cwd(), options.output);
        writeFileSync(outputPath, output, 'utf-8');
        console.log(chalk.green(`✓ Written to ${options.output}`));
        if (options.cursorRules) {
            console.log(chalk.gray('  Type: Cursor Rules'));
        } else {
            console.log(chalk.gray(`  Agent: ${agent}`));
        }
      } else {
        console.log(output);
      }

      console.log('');
    } catch (error) {
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });
