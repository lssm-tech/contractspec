import inquirer from 'inquirer';
import chalk from 'chalk';
import { validateProvider } from '../../ai/providers';
import type { Config } from '../../utils/config';
import type { SpecType } from '../../types';
import type { CreateOptions } from './types';
import { createOperationSpec } from './create-operation';
import { createEventSpec } from './create-event';
import { createPresentationSpec } from './create-presentation';
import { createWorkflowSpec } from './create-workflow';
import { createMigrationSpec } from './create-migration';
import { createTelemetrySpec } from './create-telemetry';
import { createExperimentSpec } from './create-experiment';
import { createAppConfigSpec } from './create-app-config';
import { createDataViewSpec } from './create-data-view';
import { createIntegrationSpec } from './create-integration';
import { createKnowledgeSpec } from './create-knowledge';

export async function createCommand(options: CreateOptions, config: Config) {
  console.log(chalk.bold.blue('\n📝 Contract Spec Creator\n'));

  let specType: SpecType | undefined = options.type;

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
    specType = selectedType as SpecType;
  }

  if (options.ai) {
    const validation = await validateProvider(config);
    if (!validation.success) {
      console.error(chalk.red(`\n❌ AI provider error: ${validation.error}`));

      console.log(chalk.yellow('\nFalling back to interactive wizard...\n'));
      options.ai = false;
    }
  }

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
      await createAppConfigSpec(options, config);
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
