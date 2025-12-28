/**
 * LLM Copy Command
 *
 * Copy spec markdown to clipboard for easy pasting into AI tools.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'path';
import { existsSync } from 'fs';
import {
  type LLMExportFormat,
  operationSpecToAgentPrompt,
  operationSpecToContextMarkdown,
  operationSpecToFullMarkdown,
} from '@contractspec/lib.contracts/llm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadSpec(specPath: string): Promise<any> {
  const fullPath = resolve(process.cwd(), specPath);

  if (!existsSync(fullPath)) {
    throw new Error(`Spec file not found: ${specPath}`);
  }

  try {
    const module = await import(fullPath);
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

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Try to use native clipboard
    const { spawn } = await import('child_process');
    const platform = process.platform;

    let cmd: string;
    let args: string[];

    if (platform === 'darwin') {
      cmd = 'pbcopy';
      args = [];
    } else if (platform === 'win32') {
      cmd = 'clip';
      args = [];
    } else {
      // Linux - try xclip first, then xsel
      cmd = 'xclip';
      args = ['-selection', 'clipboard'];
    }

    return new Promise((resolve) => {
      const proc = spawn(cmd, args, { stdio: ['pipe', 'ignore', 'ignore'] });
      proc.stdin?.write(text);
      proc.stdin?.end();
      proc.on('close', (code) => resolve(code === 0));
      proc.on('error', () => resolve(false));
    });
  } catch {
    return false;
  }
}

export const copyLLMCommand = new Command('copy')
  .description('Copy spec markdown to clipboard')
  .argument('<spec-file>', 'Path to the spec file')
  .option(
    '-f, --format <format>',
    'Export format: context, full, prompt',
    'full'
  )
  .option(
    '--task <type>',
    'Task type for prompt format: implement, test, refactor, review',
    'implement'
  )
  .action(async (specFile, options) => {
    try {
      console.log(chalk.blue(`\n📋 Copying ${specFile} to clipboard...\n`));

      const spec = await loadSpec(specFile);
      const format = options.format as LLMExportFormat;

      let markdown: string;

      switch (format) {
        case 'context':
          markdown = operationSpecToContextMarkdown(spec);
          break;
        case 'prompt':
          markdown = operationSpecToAgentPrompt(spec, {
            taskType: options.task as
              | 'implement'
              | 'test'
              | 'refactor'
              | 'review',
          });
          break;
        case 'full':
        default:
          markdown = operationSpecToFullMarkdown(spec);
          break;
      }

      const copied = await copyToClipboard(markdown);

      if (copied) {
        console.log(chalk.green(`✓ Copied to clipboard!`));
        console.log(chalk.gray(`  Format: ${format}`));
        console.log(
          chalk.gray(`  Spec: ${spec.meta.key}.v${spec.meta.version}`)
        );
        console.log(chalk.gray(`  Words: ${markdown.split(/\s+/).length}`));
      } else {
        console.log(chalk.yellow('⚠ Could not copy to clipboard'));
        console.log(chalk.gray('  Clipboard access not available'));
        console.log(chalk.gray('  Use --output to write to a file instead'));
        console.log('');
        console.log(chalk.dim('--- Content ---'));
        console.log(markdown);
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
