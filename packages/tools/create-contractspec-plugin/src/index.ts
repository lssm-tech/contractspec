#!/usr/bin/env node

/**
 * ContractSpec Plugin Creator CLI
 *
 * A CLI tool for scaffolding ContractSpec plugins from templates.
 * Supports various plugin types with proper structure and configuration.
 */

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
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

async function collectPluginConfig(options: any) {
  const questions = [];

  if (!options.name) {
    questions.push({
      type: 'input',
      name: 'name',
      message: 'Plugin name (kebab-case):',
      validate: (input: string) => {
        if (!input.trim()) return 'Plugin name is required';
        if (!/^[a-z][a-z0-9-]*$/.test(input)) {
          return 'Plugin name must be kebab-case and start with a letter';
        }
        return true;
      },
    });
  }

  if (!options.description) {
    questions.push({
      type: 'input',
      name: 'description',
      message: 'Plugin description:',
      validate: (input: string) => input.trim().length > 0,
    });
  }

  if (!options.author) {
    questions.push({
      type: 'input',
      name: 'author',
      message: 'Author name:',
      default: () => {
        try {
          // Try to get git user name
          const { execSync } = require('child_process');
          return execSync('git config user.name', { encoding: 'utf8' }).trim();
        } catch {
          return '';
        }
      },
    });
  }

  questions.push({
    type: 'list',
    name: 'type',
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

  const answers = await inquirer.prompt(questions);

  const name = options.name || answers.name;
  const description = options.description || answers.description;
  const author = options.author || answers.author;
  const type = options.type || answers.type;
  const template = options.template;

  const packageName = `@contractspec/plugin.${name}`;
  const className =
    name
      .split('-')
      .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Plugin';

  const packageDir = join(process.cwd(), name);

  return {
    name,
    packageName,
    className,
    description,
    author,
    type,
    template,
    packageDir,
    version: '1.0.0',
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

async function createPlugin(config: any, template: any) {
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
    const renderedContent = renderTemplate(content, config);

    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(filePath, renderedContent, 'utf8');
    console.log(chalk.gray(`Created file: ${filePath}`));
  }
}

program.parse();
