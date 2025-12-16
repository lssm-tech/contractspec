import chalk from 'chalk';
import { experimentWizard } from './wizards/experiment';
import { generateExperimentSpec } from '../../templates/experiment.template';
import type { Config } from '../../utils/config';
import type { ExperimentSpecData } from '../../types';
import type { CreateOptions } from './types';
import { writeSpecFile } from './write-spec-file';

export async function createExperimentSpec(
  options: CreateOptions,
  config: Config
): Promise<void> {
  if (options.ai) {
    console.log(
      chalk.yellow(
        '⚠️  AI-assisted experiment generation is not available yet. Switching to interactive wizard.'
      )
    );
  }

  const specData: ExperimentSpecData = await experimentWizard();
  const code = generateExperimentSpec(specData);

  await writeSpecFile({
    specName: specData.name,
    specType: 'experiment',
    extension: '.experiment.ts',
    code,
    spinnerText: 'Writing experiment spec...',
    options,
    config,
  });

  console.log(chalk.cyan('\n✨ Next steps:'));

  console.log(
    chalk.gray(
      '  1. Register the experiment in your ExperimentRegistry and wire overrides.'
    )
  );

  console.log(
    chalk.gray(
      '  2. Use ExperimentEvaluator to assign variants in your runtime.'
    )
  );
}



