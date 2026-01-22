#!/usr/bin/env node

/**
 * ContractSpec Plugin Creator CLI
 *
 * A CLI tool for scaffolding ContractSpec plugins from templates.
 * Supports various plugin types with proper structure and configuration.
 */

import { Command } from 'commander';
import { input, select } from '@inquirer/prompts';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import type { TemplateData } from './utils.js';
import { renderTemplate } from './utils.js';
import { createExampleGeneratorTemplate } from './templates/example-generator.js';

const program = new Command();

program
  .name('create-contractspec-plugin')
  .description('Create a new ContractSpec plugin from templates')
  .version('1.48.0');

program
  .command('create')
  .description('Create a new plugin')
  .option('-n, --name <name>', 'Plugin name')
  .option(
    '-t, --type <type>',
    'Plugin type (generator, transformer, validator)',
    'generator'
  )
  .option('-d, --description <description>', 'Plugin description')
  .option('-a, --author <author>', 'Plugin author')
  .option('--template <template>', 'Template to use', 'example-generator')
  .option('--dry-run', 'Show what would be created without creating files')
  .action(async (options) => {
    try {
      const config = await collectPluginConfig(options);
      const template = selectTemplate(config.template);

      if (options.dryRun) {
        console.log(chalk.blue('🔍 Dry run - showing what would be created:'));
        console.log(JSON.stringify(config, null, 2));
        return;
      }

      await createPlugin(config, template);
      console.log(chalk.green('✅ Plugin created successfully!'));
      console.log(chalk.cyan('\nNext steps:'));
      console.log(`  cd ${config.packageDir}`);
      console.log('  npm install');
      console.log('  npm test');
    } catch (error) {
      console.error(chalk.red('❌ Error creating plugin:'), error);
      process.exit(1);
    }
  });

program
  .command('list-templates')
  .description('List available templates')
  .action(() => {
    console.log(chalk.blue('Available templates:'));
    console.log('  example-generator  - Markdown documentation generator');
    console.log('  api-transformer    - API response transformer');
    console.log('  schema-validator   - JSON schema validator');
    console.log('  custom-event       - Custom event handler');
  });

interface PluginConfig {
  name: string;
  packageName: string;
  integrationPackageName: string;
  className: string;
  description: string;
  author: string;
  type: string;
  template: string;
  packageDir: string;
  version: string;
  currentYear: number;
}

interface CreateOptions {
  name?: string;
  type?: string;
  description?: string;
  author?: string;
  template: string;
  dryRun?: boolean;
}

async function collectPluginConfig(
  options: CreateOptions
): Promise<PluginConfig> {
  const name =
    options.name ??
    (await input({
      message: 'Plugin name (kebab-case):',
      validate: (input: string) => {
        if (!input.trim()) return 'Plugin name is required';
        if (!/^[a-z][a-z0-9-]*$/.test(input)) {
          return 'Plugin name must be kebab-case and start with a letter';
        }
        return true;
      },
    }));

  const description =
    options.description ??
    (await input({
      message: 'Plugin description:',
      validate: (input: string) =>
        input.trim().length > 0 || 'Description is required',
    }));

  const defaultAuthor = (() => {
    try {
      return execSync('git config user.name', {
        encoding: 'utf8',
      }).trim();
    } catch (_err) {
      return '';
    }
  })();
  const author =
    options.author ??
    (await input({
      message: 'Author name:',
      default: defaultAuthor,
    }));

  const type = await select({
    message: 'Plugin type:',
    choices: [
      { name: 'Generator - Creates artifacts from specs', value: 'generator' },
      {
        name: 'Transformer - Transforms data between formats',
        value: 'transformer',
      },
      { name: 'Validator - Validates specs and data', value: 'validator' },
      { name: 'Event Handler - Processes events', value: 'event' },
    ],
    default: options.type,
  });

  const template = options.template;

  const packageName = `@contractspec/plugin.${name}`;
  const integrationPackageName = `@contractspec/integration.${name}`;
  const className =
    name
      .split('-')
      .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Plugin';

  const packageDir = join(process.cwd(), name);

  return {
    name,
    packageName,
    integrationPackageName,
    className,
    description,
    author,
    type,
    template,
    packageDir,
    version: '1.0.0',
    currentYear: new Date().getFullYear(),
  };
}

function selectTemplate(templateName: string) {
  const templates = {
    'example-generator': createExampleGeneratorTemplate,
  };

  const templateFactory = templates[templateName as keyof typeof templates];
  if (!templateFactory) {
    throw new Error(`Unknown template: ${templateName}`);
  }

  return templateFactory();
}

interface PluginTemplate {
  files: Record<string, string>;
}

async function createPlugin(
  config: PluginConfig,
  template: PluginTemplate
): Promise<void> {
  console.log(chalk.blue(`📦 Creating plugin: ${config.packageName}`));

  // Create directory structure
  const directories = [
    '',
    'src',
    'src/types',
    'src/utils',
    'src/templates',
    'tests',
    'docs',
    '.github/workflows',
  ];

  for (const dir of directories) {
    const fullPath = join(config.packageDir, dir);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
      console.log(chalk.gray(`Created directory: ${fullPath}`));
    }
  }

  // Generate files from template
  for (const [file, content] of Object.entries(template.files)) {
    const filePath = join(config.packageDir, file);
    const renderedContent = renderTemplate(
      content,
      config as unknown as TemplateData
    );

    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(filePath, renderedContent, 'utf8');
    console.log(chalk.gray(`Created file: ${filePath}`));
  }
}

program.parse();
