/**
 * LLM Copy Command
 *
 * Copy spec markdown to clipboard for easy pasting into AI tools.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { type LLMExportFormat } from '@contractspec/lib.contracts/llm';
import {
  loadSpecFromSource,
  specToMarkdown,
} from '@contractspec/module.workspace';
import { generateFeatureContextMarkdown } from '@contractspec/bundle.workspace';

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
  .action(async (specFile, options) => {
    try {
      console.log(chalk.blue(`\n📋 Copying ${specFile} to clipboard...\n`));

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
      if (!spec) {
        throw new Error('No spec definitions found');
      }
      const format = options.format as LLMExportFormat;

      let markdown: string;
      if (spec.specType === 'feature' && format === 'full') {
        const { createNodeAdapters } =
          await import('@contractspec/bundle.workspace');
        const nodeAdapters = createNodeAdapters({ cwd: process.cwd() });
        markdown = await generateFeatureContextMarkdown(spec, nodeAdapters);
      } else {
        markdown = specToMarkdown(spec, format);
      }

      const copied = await copyToClipboard(markdown);

      if (copied) {
        console.log(chalk.green(`✓ Copied to clipboard!`));
        console.log(chalk.gray(`  Format: ${format}`));
        console.log(chalk.gray(`  Spec: ${spec.meta.key}`));
        console.log(chalk.gray(`  Words: ${markdown.split(/\s+/).length}`));
      } else {
        console.log(chalk.yellow('⚠ Could not copy to clipboard'));
        console.log(chalk.gray('  Clipboard access not available'));
        console.log(
          chalk.gray('  Use export --output to write to a file instead')
        );
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
