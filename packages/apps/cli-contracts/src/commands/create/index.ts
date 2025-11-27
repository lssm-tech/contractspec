import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { operationWizard } from './wizards/operation';
import { eventWizard } from './wizards/event';
import { presentationWizard } from './wizards/presentation';
import { workflowWizard } from './wizards/workflow';
import { migrationWizard } from './wizards/migration';
import { telemetryWizard } from './wizards/telemetry';
import { experimentWizard } from './wizards/experiment';
import { appConfigWizard } from './wizards/app-config';
import { dataViewWizard } from './wizards/data-view';
import { integrationWizard } from './wizards/integration';
import { knowledgeWizard } from './wizards/knowledge';
import {
  aiGenerateEvent,
  aiGenerateOperation,
  aiGeneratePresentation,
} from './ai-assist';
import { generateOperationSpec } from '../../templates/operation.template';
import { generateEventSpec } from '../../templates/event.template';
import { generatePresentationSpec } from '../../templates/presentation.template';
import { generateWorkflowSpec } from '../../templates/workflow.template';
import { generateMigrationSpec } from '../../templates/migration.template';
import { generateTelemetrySpec } from '../../templates/telemetry.template';
import { generateExperimentSpec } from '../../templates/experiment.template';
import { generateAppBlueprintSpec } from '../../templates/app-config.template';
import { generateDataViewSpec } from '../../templates/data-view.template';
import { generateIntegrationSpec } from '../../templates/integration.template';
import { generateKnowledgeSpaceSpec } from '../../templates/knowledge.template';
import {
  generateFileName,
  resolveOutputPath,
  writeFileSafe,
} from '../../utils/fs';
import { validateProvider } from '../../ai/providers';
import type { Config } from '../../utils/config';
import type {
  AppBlueprintSpecData,
  DataViewSpecData,
  EventSpecData,
  ExperimentSpecData,
  IntegrationSpecData,
  KnowledgeSpaceSpecData,
  MigrationSpecData,
  OperationSpecData,
  PresentationSpecData,
  SpecType,
  TelemetrySpecData,
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
          { name: 'Data view', value: 'data-view' },
          { name: 'Workflow', value: 'workflow' },
          { name: 'Migration', value: 'migration' },
          { name: 'Telemetry', value: 'telemetry' },
          { name: 'Experiment', value: 'experiment' },
          { name: 'App Blueprint', value: 'app-config' },
          { name: 'Integration', value: 'integration' },
          { name: 'Knowledge Space', value: 'knowledge' },
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
    case 'workflow':
      await createWorkflowSpec(options, config);
      break;
    case 'migration':
      await createMigrationSpec(options, config);
      break;
    case 'telemetry':
      await createTelemetrySpec(options, config);
      break;
    case 'experiment':
      await createExperimentSpec(options, config);
      break;
    case 'app-config':
      await createAppConfig(options, config);
      break;
    case 'data-view':
      await createDataViewSpec(options, config);
      break;
    case 'integration':
      await createIntegrationSpec(options, config);
      break;
    case 'knowledge':
      await createKnowledgeSpec(options, config);
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

async function createWorkflowSpec(options: CreateOptions, config: Config) {
  if (options.ai) {
    console.log(
      chalk.yellow(
        '⚠️  AI-assisted workflow generation is not available yet. Switching to interactive wizard.'
      )
    );
  }

  const specData = await workflowWizard();
  const code = generateWorkflowSpec(specData);

  const basePath = options.outputDir || config.outputDir;
  const fileName = generateFileName(specData.name, '.workflow.ts');
  const filePath = resolveOutputPath(
    basePath,
    'workflow',
    config.conventions,
    fileName
  );

  const spinner = ora('Writing workflow spec...').start();
  await writeFileSafe(filePath, code);
  spinner.succeed(chalk.green(`Spec created: ${filePath}`));

  console.log(chalk.cyan('\n✨ Next steps:'));
  console.log(
    chalk.gray(
      `  1. Review step actions and adjust operations/forms in ${filePath}`
    )
  );
  console.log(
    chalk.gray(
      `  2. Generate a runner scaffold: contractspec build ${filePath}`
    )
  );
}

async function createDataViewSpec(options: CreateOptions, config: Config) {
  if (options.ai) {
    console.log(
      chalk.yellow(
        '⚠️  AI-assisted data view generation is not available yet. Switching to interactive wizard.'
      )
    );
  }

  const specData: DataViewSpecData = await dataViewWizard();
  const code = generateDataViewSpec(specData);

  const basePath = options.outputDir || config.outputDir;
  const fileName = generateFileName(specData.name, '.data-view.ts');
  const filePath = resolveOutputPath(
    basePath,
    'data-view',
    config.conventions,
    fileName
  );

  const spinner = ora('Writing data view spec...').start();
  await writeFileSafe(filePath, code);
  spinner.succeed(chalk.green(`Spec created: ${filePath}`));

  console.log(chalk.cyan('\n✨ Next steps:'));
  console.log(chalk.gray(`  1. Wire the data view spec into your registry.`));
  console.log(
    chalk.gray(
      `  2. Render it with DataViewRenderer or tailor a component to your UI.`
    )
  );
}

async function createIntegrationSpec(options: CreateOptions, config: Config) {
  const specData: IntegrationSpecData = await integrationWizard();
  const code = generateIntegrationSpec(specData);

  const basePath = options.outputDir || config.outputDir;
  const fileName = generateFileName(specData.name, '.integration.ts');
  const filePath = resolveOutputPath(
    basePath,
    'integration',
    config.conventions,
    fileName
  );

  const spinner = ora('Writing integration spec...').start();
  await writeFileSafe(filePath, code);
  spinner.succeed(chalk.green(`Spec created: ${filePath}`));

  console.log(chalk.cyan('\n✨ Next steps:'));
  console.log(
    chalk.gray(
      '  1. Register the integration spec in your integration registry.'
    )
  );
  console.log(
    chalk.gray(
      '  2. Create tenant IntegrationConnections and bindings referencing this spec.'
    )
  );
}

async function createKnowledgeSpec(options: CreateOptions, config: Config) {
  const specData: KnowledgeSpaceSpecData = await knowledgeWizard();
  const code = generateKnowledgeSpaceSpec(specData);

  const basePath = options.outputDir || config.outputDir;
  const fileName = generateFileName(specData.name, '.knowledge.ts');
  const filePath = resolveOutputPath(
    basePath,
    'knowledge',
    config.conventions,
    fileName
  );

  const spinner = ora('Writing knowledge space spec...').start();
  await writeFileSafe(filePath, code);
  spinner.succeed(chalk.green(`Spec created: ${filePath}`));

  console.log(chalk.cyan('\n✨ Next steps:'));
  console.log(
    chalk.gray(
      '  1. Register the knowledge space spec in your knowledge registry.'
    )
  );
  console.log(
    chalk.gray(
      '  2. Configure KnowledgeSourceConfig entries and TenantAppConfig bindings.'
    )
  );
}

async function createTelemetrySpec(options: CreateOptions, config: Config) {
  if (options.ai) {
    console.log(
      chalk.yellow(
        '⚠️  AI-assisted telemetry generation is not available yet. Switching to interactive wizard.'
      )
    );
  }

  const specData: TelemetrySpecData = await telemetryWizard();
  const code = generateTelemetrySpec(specData);

  const basePath = options.outputDir || config.outputDir;
  const fileName = generateFileName(specData.name, '.telemetry.ts');
  const filePath = resolveOutputPath(
    basePath,
    'telemetry',
    config.conventions,
    fileName
  );

  const spinner = ora('Writing telemetry spec...').start();
  await writeFileSafe(filePath, code);
  spinner.succeed(chalk.green(`Spec created: ${filePath}`));

  console.log(chalk.cyan('\n✨ Next steps:'));
  console.log(
    chalk.gray(
      `  1. Register the telemetry spec and connect providers in your runtime.`
    )
  );
  console.log(
    chalk.gray(
      `  2. Link ContractSpec and WorkflowSpec telemetry settings to these events.`
    )
  );
}

async function createExperimentSpec(options: CreateOptions, config: Config) {
  if (options.ai) {
    console.log(
      chalk.yellow(
        '⚠️  AI-assisted experiment generation is not available yet. Switching to interactive wizard.'
      )
    );
  }

  const specData: ExperimentSpecData = await experimentWizard();
  const code = generateExperimentSpec(specData);

  const basePath = options.outputDir || config.outputDir;
  const fileName = generateFileName(specData.name, '.experiment.ts');
  const filePath = resolveOutputPath(
    basePath,
    'experiment',
    config.conventions,
    fileName
  );

  const spinner = ora('Writing experiment spec...').start();
  await writeFileSafe(filePath, code);
  spinner.succeed(chalk.green(`Spec created: ${filePath}`));

  console.log(chalk.cyan('\n✨ Next steps:'));
  console.log(
    chalk.gray(
      `  1. Register the experiment in your ExperimentRegistry and wire overrides.`
    )
  );
  console.log(
    chalk.gray(
      `  2. Use ExperimentEvaluator to assign variants in your runtime.`
    )
  );
}

async function createAppConfig(options: CreateOptions, config: Config) {
  if (options.ai) {
    console.log(
      chalk.yellow(
        '⚠️  AI-assisted app configuration is not available yet. Switching to interactive wizard.'
      )
    );
  }

  const specData: AppBlueprintSpecData = await appConfigWizard();
  const code = generateAppBlueprintSpec(specData);

  const basePath = options.outputDir || config.outputDir;
  const fileName = generateFileName(specData.name, '.app-config.ts');
  const filePath = resolveOutputPath(
    basePath,
    'app-config',
    config.conventions,
    fileName
  );

  const spinner = ora('Writing app config spec...').start();
  await writeFileSafe(filePath, code);
  spinner.succeed(chalk.green(`Spec created: ${filePath}`));

  console.log(chalk.cyan('\n✨ Next steps:'));
  console.log(
    chalk.gray(
      `  1. Register this blueprint in an AppBlueprintRegistry for global distribution.`
    )
  );
  console.log(
    chalk.gray(
      `  2. Use resolveAppConfig/composeAppConfig with tenant overrides before deploying.`
    )
  );
}

async function createMigrationSpec(options: CreateOptions, config: Config) {
  if (options.ai) {
    console.log(
      chalk.yellow(
        '⚠️  AI-assisted migration generation is not available yet. Switching to interactive wizard.'
      )
    );
  }

  const specData: MigrationSpecData = await migrationWizard();
  const code = generateMigrationSpec(specData);

  const basePath = options.outputDir || config.outputDir;
  const fileName = generateFileName(specData.name, '.migration.ts');
  const filePath = resolveOutputPath(
    basePath,
    'migration',
    config.conventions,
    fileName
  );

  const spinner = ora('Writing migration spec...').start();
  await writeFileSafe(filePath, code);
  spinner.succeed(chalk.green(`Spec created: ${filePath}`));

  console.log(chalk.cyan('\n✨ Next steps:'));
  console.log(chalk.gray(`  1. Review the migration steps in ${filePath}.`));
  console.log(
    chalk.gray(
      `  2. Integrate with your migration runner or build tooling (coming soon).`
    )
  );
}
