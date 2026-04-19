import { templates } from '@contractspec/bundle.workspace';
import chalk from 'chalk';
import type { FeatureSpecData } from '../../types';
import type { Config } from '../../utils/config';
import type { CreateOptions } from './types';
import { featureWizard } from './wizards/feature';
import { writeSpecFile } from './write-spec-file';

const { generateFeatureSpec } = templates;

export async function createFeatureSpec(
	options: CreateOptions,
	config: Config
): Promise<void> {
	if (options.ai) {
		console.log(
			chalk.yellow(
				'⚠️  AI-assisted feature generation is not available yet. Switching to interactive wizard.'
			)
		);
	}

	const specData: FeatureSpecData = await featureWizard();
	const code = generateFeatureSpec(specData);

	const filePath = await writeSpecFile({
		specName: specData.key,
		specType: 'feature',
		code,
		spinnerText: 'Writing feature spec...',
		options,
		config,
	});

	console.log(chalk.cyan('\n✨ Next steps:'));
	console.log(chalk.gray(`  1. Review linked refs in ${filePath}`));
	console.log(
		chalk.gray(
			'  2. Add operations, presentations, forms, and experiments as needed'
		)
	);
}
