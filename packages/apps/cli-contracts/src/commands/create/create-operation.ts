import inquirer from 'inquirer';
import chalk from 'chalk';
import { operationWizard } from './wizards/operation';
import { aiGenerateOperation } from './ai-assist';
import { generateOperationSpec } from '../../templates/operation.template';
import type { Config } from '../../utils/config';
import type { OperationSpecData } from '../../types';
import type { CreateOptions } from './types';
import { writeSpecFile } from './write-spec-file';

export async function createOperationSpec(
  options: CreateOptions,
  config: Config
): Promise<void> {
  let specData: OperationSpecData;

  if (options.ai) {
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

    specData = await operationWizard(aiData);
  } else {
    specData = await operationWizard();
  }

  const code = generateOperationSpec(specData);

  const filePath = await writeSpecFile({
    specName: specData.name,
    specType: 'operation',
    extension: '.contracts.ts',
    code,
    spinnerText: 'Writing spec file...',
    options,
    config,
  });

  console.log(chalk.cyan('\n✨ Next steps:'));

  console.log(
    chalk.gray(`  1. Review and complete the TODO items in ${filePath}`)
  );

  console.log(chalk.gray(`  2. Define input/output schemas`));

  console.log(chalk.gray(`  3. Run: contractspec build ${filePath}`));
}
