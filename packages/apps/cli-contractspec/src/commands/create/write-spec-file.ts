import chalk from 'chalk';
import ora from 'ora';
import {
  generateFileName,
  resolveOutputPath,
  writeFileSafe,
} from '../../utils/fs';
import { formatFiles } from '@lssm/module.contractspec-workspace';
import type { Config } from '../../utils/config';
import type { SpecType } from '../../types';
import type { CreateOptions } from './types';

export async function writeSpecFile(args: {
  specName: string;
  specType: SpecType;
  extension: string;
  code: string;
  spinnerText: string;
  options: CreateOptions;
  config: Config;
}): Promise<string> {
  const basePath = args.options.outputDir || args.config.outputDir;
  const fileName = generateFileName(args.specName, args.extension);
  const filePath = resolveOutputPath(
    basePath,
    args.specType,
    args.config.conventions,
    fileName
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
