import chalk from 'chalk';
import type { Config } from '../../utils/config';
import { writeFileSafe } from '../../utils/fs';
import { ensureTrailingNewline } from './agent-generation';
import { toKebabCase, toPascalCase } from './naming';
import { computeRelativeImport, resolveDataViewRendererPath } from './paths';
import {
  deriveNameFromFile,
  extractDataViewExportName,
  extractDataViewKind,
  extractMetaValue,
} from './spec-detect';
import type { BuildOptions } from './types';
import { generateDataViewRendererTemplate } from './data-view-renderer-template';

export async function buildDataView(
  specFile: string,
  specCode: string,
  options: BuildOptions,
  config: Config
) {
  const specName =
    extractMetaValue(specCode, 'name') || deriveNameFromFile(specFile);
  const sanitizedName = toKebabCase(specName);
  const exportName =
    extractDataViewExportName(specCode) || `${toPascalCase(specName)}DataView`;
  const rendererName = `${toPascalCase(specName)}Renderer`;
  const rendererPath = resolveDataViewRendererPath(
    specFile,
    sanitizedName,
    options,
    config
  );
  const importPath = computeRelativeImport(specFile, rendererPath);
  const viewKind = extractDataViewKind(specCode) ?? 'table';

  const rendererCode = generateDataViewRendererTemplate({
    exportName,
    specImportPath: importPath,
    rendererName,
    viewKind,
  });

  await writeFileSafe(rendererPath, ensureTrailingNewline(rendererCode));

  console.log(chalk.green(`✅ Data view renderer written to ${rendererPath}`));

  console.log(chalk.cyan('\n✨ Build complete!'));
}



