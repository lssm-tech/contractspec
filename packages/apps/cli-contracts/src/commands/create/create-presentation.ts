import inquirer from 'inquirer';
import chalk from 'chalk';
import { presentationWizard } from './wizards/presentation';
import { aiGeneratePresentation } from './ai-assist';
import { generatePresentationSpec } from '../../templates/presentation.template';
import type { Config } from '../../utils/config';
import type { PresentationSpecData } from '../../types';
import type { CreateOptions } from './types';
import { writeSpecFile } from './write-spec-file';

export async function createPresentationSpec(
  options: CreateOptions,
  config: Config
): Promise<void> {
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

    specData = await presentationWizard(aiData);
  } else {
    specData = await presentationWizard();
  }

  const code = generatePresentationSpec(specData);

  const filePath = await writeSpecFile({
    specName: specData.name,
    specType: 'presentation',
    extension: '.presentation.ts',
    code,
    spinnerText: 'Writing spec file...',
    options,
    config,
  });

  console.log(chalk.cyan('\n✨ Next steps:'));

  console.log(chalk.gray(`  1. Complete the TODO items in ${filePath}`));

  console.log(
    chalk.gray(`  2. Run: contractspec build ${filePath} to generate component`)
  );
}
