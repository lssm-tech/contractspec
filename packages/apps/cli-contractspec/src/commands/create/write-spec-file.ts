import {
	type AuthoringContractSpecType,
	type AuthoringTargetPathOptions,
	formatFiles,
	getAuthoringTargetDefaultFileName,
} from '@contractspec/module.workspace';
import chalk from 'chalk';
import ora from 'ora';
import type { Config } from '../../utils/config';
import { resolveOutputPath, writeFileSafe } from '../../utils/fs';
import type { CreateOptions } from './types';

export async function writeSpecFile(args: {
	specName: string;
	specType: AuthoringContractSpecType;
	code: string;
	spinnerText: string;
	options: CreateOptions;
	config: Config;
	fileName?: string;
	pathOptions?: AuthoringTargetPathOptions;
}): Promise<string> {
	const basePath = args.options.outputDir || args.config.outputDir;
	const fileName =
		args.fileName ??
		getAuthoringTargetDefaultFileName(
			args.specType,
			args.specName,
			args.pathOptions
		);
	const filePath = resolveOutputPath(
		basePath,
		args.specType,
		args.config.conventions,
		fileName,
		args.pathOptions
	);

	const spinner = ora(args.spinnerText).start();
	await writeFileSafe(filePath, args.code);
	spinner.succeed(chalk.green(`Spec created: ${filePath}`));

	// Format the file if not skipped
	if (!args.options.noFormat) {
		await formatFiles(filePath, args.config.formatter, {
			type: args.options.formatter,
			silent: false,
		});
	}

	return filePath;
}
