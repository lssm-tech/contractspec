import {
	createNodeAdapters,
	packageDeclarations,
} from '@contractspec/bundle.workspace';
import { formatFiles } from '@contractspec/module.workspace';
import chalk from 'chalk';
import type { Config } from '../../utils/config';
import type { CreateOptions } from './types';

export async function createPackageDeclarations(
	options: CreateOptions,
	config: Config
): Promise<void> {
	const adapters = createNodeAdapters({
		cwd: process.cwd(),
		config,
		silent: true,
	});
	const result = await packageDeclarations.syncPackageDeclarations(
		adapters.fs,
		{
			config,
			dryRun: options.dryRun,
			workspaceRoot: process.cwd(),
		}
	);

	if (!options.noFormat && !options.dryRun) {
		const tsFiles = [...result.createdFiles, ...result.updatedFiles].filter(
			(filePath) => filePath.endsWith('.ts')
		);
		if (tsFiles.length > 0) {
			await formatFiles(tsFiles, config.formatter, {
				type: options.formatter,
				silent: true,
			});
		}
	}

	console.log(
		chalk.green(
			`${options.dryRun ? 'Planned' : 'Applied'} package declaration sync for ${result.packages.length} packages.`
		)
	);
	console.log(
		chalk.gray(
			`  created: ${result.createdFiles.length}, updated: ${result.updatedFiles.length}`
		)
	);
}
