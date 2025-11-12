import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { operationWizard } from './wizards/operation';
import { eventWizard } from './wizards/event';
import { presentationWizard } from './wizards/presentation';
import {
  aiGenerateEvent,
  aiGenerateOperation,
  aiGeneratePresentation,
} from './ai-assist';
import { generateOperationSpec } from '../../templates/operation.template';
import { generateEventSpec } from '../../templates/event.template';
import { generatePresentationSpec } from '../../templates/presentation.template';
import {
  generateFileName,
  resolveOutputPath,
  writeFileSafe,
} from '../../utils/fs';
import { validateProvider } from '../../ai/providers';
import type { Config } from '../../utils/config';
import type {
  EventSpecData,
  OperationSpecData,
  PresentationSpecData,
  SpecType,
} from '../../types';

interface CreateOptions {
  type?: SpecType;
  ai?: boolean;
  provider?: string;
  model?: string;
  outputDir?: string;
}

/**
 * Main create command implementation
 */
export async function createCommand(options: CreateOptions, config: Config) {
  console.log(chalk.bold.blue('\n📝 Contract Spec Creator\n'));

  // Determine spec type
  let specType = options.type;

  if (!specType) {
    const { selectedType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedType',
        message: 'What type of spec would you like to create?',
        choices: [
          { name: 'Operation (Command/Query)', value: 'operation' },
          { name: 'Event', value: 'event' },
          { name: 'Presentation', value: 'presentation' },
          { name: 'Form', value: 'form' },
          { name: 'Feature', value: 'feature' },
        ],
      },
    ]);
    specType = selectedType;
  }

  // Handle AI-assisted creation
  if (options.ai) {
    const validation = await validateProvider(config);
    if (!validation.success) {
      console.error(chalk.red(`\n❌ AI provider error: ${validation.error}`));
      console.log(chalk.yellow('\nFalling back to interactive wizard...\n'));
      options.ai = false;
    }
  }

  // Create spec based on type
  switch (specType) {
    case 'operation':
      await createOperationSpec(options, config);
      break;
    case 'event':
      await createEventSpec(options, config);
      break;
    case 'presentation':
      await createPresentationSpec(options, config);
      break;
    case 'form':
      console.log(chalk.yellow('Form spec creation coming soon!'));
      break;
    case 'feature':
      console.log(chalk.yellow('Feature spec creation coming soon!'));
      break;
    default:
      console.error(chalk.red(`Unknown spec type: ${specType}`));
      process.exit(1);
  }
}

/**
 * Create operation spec
 */
async function createOperationSpec(options: CreateOptions, config: Config) {
  let specData: OperationSpecData;

  if (options.ai) {
    // AI-assisted creation
    const { description, kind } = await inquirer.prompt([
      {
        type: 'list',
        name: 'kind',
        message: 'Operation kind:',
        choices: [
          { name: 'Command (changes state)', value: 'command' },
          { name: 'Query (read-only)', value: 'query' },
        ],
      },
      {
        type: 'input',
        name: 'description',
        message: 'Describe what this operation should do:',
        validate: (input: string) =>
          input.trim().length > 0 || 'Description required',
      },
    ]);

    const aiData = await aiGenerateOperation(description, kind, config);

    // Allow user to review and modify AI-generated data
    const { confirmOrEdit } = await inquirer.prompt([
      {
        type: 'list',
        name: 'confirmOrEdit',
        message: `Generated spec for "${aiData.name}". What would you like to do?`,
        choices: [
          { name: 'Use as-is', value: 'confirm' },
          { name: 'Review and edit', value: 'edit' },
        ],
      },
    ]);

    // Always run through wizard to ensure we have a complete OperationSpecData
    specData = await operationWizard(aiData);
  } else {
    // Interactive wizard
    specData = await operationWizard();
  }

  // Generate code
  const code = generateOperationSpec(specData);

  // Write file
  const basePath = options.outputDir || config.outputDir;
  const fileName = generateFileName(specData.name, '.contracts.ts');
  const filePath = resolveOutputPath(
    basePath,
    'operation',
    config.conventions,
    fileName
  );

  const spinner = ora('Writing spec file...').start();
  await writeFileSafe(filePath, code);
  spinner.succeed(chalk.green(`Spec created: ${filePath}`));

  console.log(chalk.cyan('\n✨ Next steps:'));
  console.log(
    chalk.gray(`  1. Review and complete the TODO items in ${filePath}`)
  );
  console.log(chalk.gray(`  2. Define input/output schemas`));
  console.log(chalk.gray(`  3. Run: contractspec build ${filePath}`));
}

/**
 * Create event spec
 */
async function createEventSpec(options: CreateOptions, config: Config) {
  let specData: EventSpecData;

  if (options.ai) {
    const { description } = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        message: 'Describe this event (what happened and when it is emitted):',
        validate: (input: string) =>
          input.trim().length > 0 || 'Description required',
      },
    ]);

    const aiData = await aiGenerateEvent(description, config);

    const { confirmOrEdit } = await inquirer.prompt([
      {
        type: 'list',
        name: 'confirmOrEdit',
        message: `Generated spec for "${aiData.name}". What would you like to do?`,
        choices: [
          { name: 'Use as-is', value: 'confirm' },
          { name: 'Review and edit', value: 'edit' },
        ],
      },
    ]);

    // Always run through wizard to ensure we have a complete EventSpecData
    specData = await eventWizard(aiData);
  } else {
    specData = await eventWizard();
  }

  // Generate code
  const code = generateEventSpec(specData);

  // Write file
  const basePath = options.outputDir || config.outputDir;
  const fileName = generateFileName(specData.name, '.event.ts');
  const filePath = resolveOutputPath(
    basePath,
    'event',
    config.conventions,
    fileName
  );

  const spinner = ora('Writing spec file...').start();
  await writeFileSafe(filePath, code);
  spinner.succeed(chalk.green(`Spec created: ${filePath}`));

  console.log(chalk.cyan('\n✨ Next steps:'));
  console.log(
    chalk.gray(`  1. Review and define the payload schema in ${filePath}`)
  );
  console.log(chalk.gray(`  2. Verify PII fields are correctly marked`));
}

/**
 * Create presentation spec
 */
async function createPresentationSpec(options: CreateOptions, config: Config) {
  let specData: PresentationSpecData;

  if (options.ai) {
    const { kind, description } = await inquirer.prompt([
      {
        type: 'list',
        name: 'kind',
        message: 'Presentation kind:',
        choices: [
          { name: 'Web Component (React)', value: 'web_component' },
          { name: 'Markdown/MDX', value: 'markdown' },
          { name: 'Data export', value: 'data' },
        ],
      },
      {
        type: 'input',
        name: 'description',
        message: 'Describe this presentation:',
        validate: (input: string) =>
          input.trim().length > 0 || 'Description required',
      },
    ]);

    const aiData = await aiGeneratePresentation(description, kind, config);

    const { confirmOrEdit } = await inquirer.prompt([
      {
        type: 'list',
        name: 'confirmOrEdit',
        message: `Generated spec for "${aiData.name}". What would you like to do?`,
        choices: [
          { name: 'Use as-is', value: 'confirm' },
          { name: 'Review and edit', value: 'edit' },
        ],
      },
    ]);

    // Always run through wizard to ensure we have a complete PresentationSpecData
    specData = await presentationWizard(aiData);
  } else {
    specData = await presentationWizard();
  }

  // Generate code
  const code = generatePresentationSpec(specData);

  // Write file
  const basePath = options.outputDir || config.outputDir;
  const fileName = generateFileName(specData.name, '.presentation.ts');
  const filePath = resolveOutputPath(
    basePath,
    'presentation',
    config.conventions,
    fileName
  );

  const spinner = ora('Writing spec file...').start();
  await writeFileSafe(filePath, code);
  spinner.succeed(chalk.green(`Spec created: ${filePath}`));

  console.log(chalk.cyan('\n✨ Next steps:'));
  console.log(chalk.gray(`  1. Complete the TODO items in ${filePath}`));
  console.log(
    chalk.gray(`  2. Run: contractspec build ${filePath} to generate component`)
  );
}
