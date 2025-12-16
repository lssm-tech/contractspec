import chalk from 'chalk';
import { appConfigWizard } from './wizards/app-config';
import { generateAppBlueprintSpec } from '../../templates/app-config.template';
import type { Config } from '../../utils/config';
import type { AppBlueprintSpecData } from '../../types';
import type { CreateOptions } from './types';
import { writeSpecFile } from './write-spec-file';

export async function createAppConfigSpec(
  options: CreateOptions,
  config: Config
): Promise<void> {
  if (options.ai) {
    console.log(
      chalk.yellow(
        '⚠️  AI-assisted app configuration is not available yet. Switching to interactive wizard.'
      )
    );
  }

  const specData: AppBlueprintSpecData = await appConfigWizard();
  const code = generateAppBlueprintSpec(specData);

  await writeSpecFile({
    specName: specData.name,
    specType: 'app-config',
    extension: '.app-config.ts',
    code,
    spinnerText: 'Writing app config spec...',
    options,
    config,
  });

  console.log(chalk.cyan('\n✨ Next steps:'));

  console.log(
    chalk.gray(
      '  1. Register this blueprint in an AppBlueprintRegistry for global distribution.'
    )
  );

  console.log(
    chalk.gray(
      '  2. Use resolveAppConfig/composeAppConfig with tenant overrides before deploying.'
    )
  );
}
