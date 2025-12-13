import inquirer from 'inquirer';
import chalk from 'chalk';
import { eventWizard } from './wizards/event';
import { aiGenerateEvent } from './ai-assist';
import { generateEventSpec } from '../../templates/event.template';
import type { Config } from '../../utils/config';
import type { EventSpecData } from '../../types';
import type { CreateOptions } from './types';
import { writeSpecFile } from './write-spec-file';

export async function createEventSpec(
  options: CreateOptions,
  config: Config
): Promise<void> {
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

    await inquirer.prompt([
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

    specData = await eventWizard(aiData);
  } else {
    specData = await eventWizard();
  }

  const code = generateEventSpec(specData);

  const filePath = await writeSpecFile({
    specName: specData.name,
    specType: 'event',
    extension: '.event.ts',
    code,
    spinnerText: 'Writing spec file...',
    options,
    config,
  });

  console.log(chalk.cyan('\n✨ Next steps:'));

  console.log(
    chalk.gray(`  1. Review and define the payload schema in ${filePath}`)
  );

  console.log(chalk.gray(`  2. Verify PII fields are correctly marked`));
}
