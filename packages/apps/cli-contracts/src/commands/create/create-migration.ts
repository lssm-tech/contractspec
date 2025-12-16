import chalk from 'chalk';
import { migrationWizard } from './wizards/migration';
import { generateMigrationSpec } from '../../templates/migration.template';
import type { Config } from '../../utils/config';
import type { MigrationSpecData } from '../../types';
import type { CreateOptions } from './types';
import { writeSpecFile } from './write-spec-file';

export async function createMigrationSpec(
  options: CreateOptions,
  config: Config
): Promise<void> {
  if (options.ai) {
    console.log(
      chalk.yellow(
        '⚠️  AI-assisted migration generation is not available yet. Switching to interactive wizard.'
      )
    );
  }

  const specData: MigrationSpecData = await migrationWizard();
  const code = generateMigrationSpec(specData);

  const filePath = await writeSpecFile({
    specName: specData.name,
    specType: 'migration',
    extension: '.migration.ts',
    code,
    spinnerText: 'Writing migration spec...',
    options,
    config,
  });

  console.log(chalk.cyan('\n✨ Next steps:'));

  console.log(chalk.gray(`  1. Review the migration steps in ${filePath}.`));

  console.log(
    chalk.gray(
      '  2. Integrate with your migration runner or build tooling (coming soon).'
    )
  );
}

