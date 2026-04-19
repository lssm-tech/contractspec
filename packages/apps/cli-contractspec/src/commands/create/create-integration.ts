import chalk from 'chalk';
import { generateIntegrationSpec } from '../../templates/integration.template';
import type { IntegrationSpecData } from '../../types';
import type { Config } from '../../utils/config';
import type { CreateOptions } from './types';
import { integrationWizard } from './wizards/integration';
import { writeSpecFile } from './write-spec-file';

export async function createIntegrationSpec(
	options: CreateOptions,
	config: Config
): Promise<void> {
	const specData: IntegrationSpecData = await integrationWizard();
	const code = generateIntegrationSpec(specData);

	await writeSpecFile({
		specName: specData.name,
		specType: 'integration',
		code,
		spinnerText: 'Writing integration spec...',
		options,
		config,
	});

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
