import chalk from 'chalk';
import { telemetryWizard } from './wizards/telemetry';
import { generateTelemetrySpec } from '../../templates/telemetry.template';
import type { Config } from '../../utils/config';
import type { TelemetrySpecData } from '../../types';
import type { CreateOptions } from './types';
import { writeSpecFile } from './write-spec-file';

export async function createTelemetrySpec(
  options: CreateOptions,
  config: Config
): Promise<void> {
  if (options.ai) {
    console.log(
      chalk.yellow(
        '⚠️  AI-assisted telemetry generation is not available yet. Switching to interactive wizard.'
      )
    );
  }

  const specData: TelemetrySpecData = await telemetryWizard();
  const code = generateTelemetrySpec(specData);

  await writeSpecFile({
    specName: specData.name,
    specType: 'telemetry',
    extension: '.telemetry.ts',
    code,
    spinnerText: 'Writing telemetry spec...',
    options,
    config,
  });

  console.log(chalk.cyan('\n✨ Next steps:'));

  console.log(
    chalk.gray(
      '  1. Register the telemetry spec and connect providers in your runtime.'
    )
  );

  console.log(
    chalk.gray(
      '  2. Link ContractSpec and WorkflowSpec telemetry settings to these events.'
    )
  );
}




