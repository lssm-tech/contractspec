/**
 * LLM Guide Command
 *
 * Generate implementation guides for AI coding agents.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import type { AgentType } from '@lssm/lib.contracts/llm';
import { createAgentGuideService } from '@lssm/bundle.contractspec-workspace';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadSpec(specPath: string): Promise<any> {
  const fullPath = resolve(process.cwd(), specPath);

  if (!existsSync(fullPath)) {
    throw new Error(`Spec file not found: ${specPath}`);
  }

  // Dynamic import the spec
  try {
    const module = await import(fullPath);
    // Find the first exported spec-like object
    for (const [, value] of Object.entries(module)) {
      if (
        value &&
        typeof value === 'object' &&
        'meta' in value &&
        'io' in value
      ) {
        return value;
      }
    }
    throw new Error('No spec found in module');
  } catch (error) {
    throw new Error(
      `Failed to load spec: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export const guideLLMCommand = new Command('guide')
  .description('Generate an implementation guide for AI coding agents')
  .argument('<spec-file>', 'Path to the spec file')
  .option(
    '-a, --agent <type>',
    'Agent type: claude-code, cursor-cli, generic-mcp',
    'generic-mcp'
  )
  .option('-o, --output <file>', 'Output file (default: stdout)')
  .option('--target-path <path>', 'Target implementation file path')
  .option('--existing-code <path>', 'Path to existing code to consider')
  .option('--cursor-rules', 'Generate Cursor rules file instead of guide')
  .option('--json', 'Output as JSON')
  .action(async (specFile, options) => {
    try {
      console.log(chalk.blue(`\n🤖 Generating guide for ${specFile}...\n`));

      const spec = await loadSpec(specFile);
      const agent = options.agent as AgentType;

      const guideService = createAgentGuideService({
        defaultAgent: agent,
        projectRoot: process.cwd(),
      });

      // Load existing code if specified
      let existingCode: string | undefined;
      if (options.existingCode) {
        const codePath = resolve(process.cwd(), options.existingCode);
        if (existsSync(codePath)) {
          existingCode = readFileSync(codePath, 'utf-8');
        }
      }

      // Generate cursor rules if requested
      if (options.cursorRules) {
        const rules = guideService.generateAgentConfig(spec, 'cursor-cli');
        if (rules) {
          if (options.output) {
            const outputPath = resolve(process.cwd(), options.output);
            writeFileSync(outputPath, rules, 'utf-8');
            console.log(
              chalk.green(`✓ Cursor rules written to ${options.output}`)
            );
          } else {
            console.log(rules);
          }
        } else {
          console.log(chalk.yellow('No cursor rules generated'));
        }
        return;
      }

      // Generate the guide
      const result = guideService.generateGuide(spec, {
        agent,
        existingCode,
        targetPath: options.targetPath,
      });

      // Output
      if (options.json) {
        const output = JSON.stringify(
          {
            plan: result.plan,
            agent,
            systemPrompt: result.prompt.systemPrompt,
            taskPrompt: result.prompt.taskPrompt,
          },
          null,
          2
        );

        if (options.output) {
          const outputPath = resolve(process.cwd(), options.output);
          writeFileSync(outputPath, output, 'utf-8');
          console.log(chalk.green(`✓ Guide written to ${options.output}`));
        } else {
          console.log(output);
        }
      } else {
        const output = result.prompt.taskPrompt;

        if (options.output) {
          const outputPath = resolve(process.cwd(), options.output);
          writeFileSync(outputPath, output, 'utf-8');
          console.log(chalk.green(`✓ Guide written to ${options.output}`));
          console.log(chalk.gray(`  Agent: ${agent}`));
          console.log(chalk.gray(`  Steps: ${result.plan.steps.length}`));
          console.log(
            chalk.gray(`  Files: ${result.plan.fileStructure.length}`)
          );
        } else {
          // Print system prompt if available
          if (result.prompt.systemPrompt) {
            console.log(chalk.cyan('=== System Prompt ===\n'));
            console.log(result.prompt.systemPrompt);
            console.log('\n' + chalk.cyan('=== Task Prompt ===\n'));
          }
          console.log(output);
        }
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
