import { templates } from '@contractspec/bundle.workspace';
import chalk from 'chalk';
import type { FormSpecData } from '../../types';
import type { Config } from '../../utils/config';
import type { CreateOptions } from './types';
import { formWizard } from './wizards/form';
import { writeSpecFile } from './write-spec-file';

const { generateFormSpec } = templates;

export async function createFormSpec(
	options: CreateOptions,
	config: Config
): Promise<void> {
	if (options.ai) {
		console.log(
			chalk.yellow(
				'⚠️  AI-assisted form generation is not available yet. Switching to interactive wizard.'
			)
		);
	}

	const specData: FormSpecData = await formWizard();
	const code = generateFormSpec(specData);

	const filePath = await writeSpecFile({
		specName: specData.key,
		specType: 'form',
		code,
		spinnerText: 'Writing form spec...',
		options,
		config,
	});

	console.log(chalk.cyan('\n✨ Next steps:'));
	console.log(chalk.gray(`  1. Review the scaffold in ${filePath}`));
	console.log(
		chalk.gray(
			'  2. Replace placeholder labels, fields, and submit action with real contract references'
		)
	);
}
