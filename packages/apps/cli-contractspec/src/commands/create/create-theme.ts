import { templates } from '@contractspec/bundle.workspace';
import chalk from 'chalk';
import type { ThemeSpecData } from '../../types';
import type { Config } from '../../utils/config';
import type { CreateOptions } from './types';
import { themeWizard } from './wizards/theme';
import { writeSpecFile } from './write-spec-file';

const { generateThemeSpec } = templates;

export async function createThemeSpec(
	options: CreateOptions,
	config: Config
): Promise<void> {
	if (options.ai) {
		console.log(
			chalk.yellow(
				'⚠️  AI-assisted theme generation is not available yet. Switching to interactive wizard.'
			)
		);
	}

	const specData: ThemeSpecData = await themeWizard();
	const code = generateThemeSpec(specData);

	const filePath = await writeSpecFile({
		specName: specData.key,
		specType: 'theme',
		code,
		spinnerText: 'Writing theme spec...',
		options,
		config,
	});

	console.log(chalk.cyan('\n✨ Next steps:'));
	console.log(chalk.gray(`  1. Review the generated theme in ${filePath}`));
	console.log(
		chalk.gray(
			'  2. Add component variants or scoped overrides for tenant or user use cases'
		)
	);
}
