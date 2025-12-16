import chalk from 'chalk';
import { workflowWizard } from './wizards/workflow';
import { generateWorkflowSpec } from '../../templates/workflow.template';
import type { Config } from '../../utils/config';
import type { CreateOptions } from './types';
import { writeSpecFile } from './write-spec-file';

export async function createWorkflowSpec(
  options: CreateOptions,
  config: Config
): Promise<void> {
  if (options.ai) {
    console.log(
      chalk.yellow(
        '⚠️  AI-assisted workflow generation is not available yet. Switching to interactive wizard.'
      )
    );
  }

  const specData = await workflowWizard();
  const code = generateWorkflowSpec(specData);

  const filePath = await writeSpecFile({
    specName: specData.name,
    specType: 'workflow',
    extension: '.workflow.ts',
    code,
    spinnerText: 'Writing workflow spec...',
    options,
    config,
  });

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


