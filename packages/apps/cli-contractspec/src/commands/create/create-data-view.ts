import chalk from 'chalk';
import { dataViewWizard } from './wizards/data-view';
import { generateDataViewSpec } from '../../templates/data-view.template';
import type { Config } from '../../utils/config';
import type { DataViewSpecData } from '../../types';
import type { CreateOptions } from './types';
import { writeSpecFile } from './write-spec-file';

export async function createDataViewSpec(
  options: CreateOptions,
  config: Config
): Promise<void> {
  if (options.ai) {
    console.log(
      chalk.yellow(
        '⚠️  AI-assisted data view generation is not available yet. Switching to interactive wizard.'
      )
    );
  }

  const specData: DataViewSpecData = await dataViewWizard();
  const code = generateDataViewSpec(specData);

  const filePath = await writeSpecFile({
    specName: specData.name,
    specType: 'data-view',
    extension: '.data-view.ts',
    code,
    spinnerText: 'Writing data view spec...',
    options,
    config,
  });

  console.log(chalk.cyan('\n✨ Next steps:'));

  console.log(
    chalk.gray(`  1. Wire the data view spec into your registry (${filePath}).`)
  );

  console.log(
    chalk.gray(
      `  2. Render it with DataViewRenderer or tailor a component to your UI.`
    )
  );
}
