import { resolve } from 'path';
import chalk from 'chalk';
import { loadWorkspaceConfig } from '../core/config.js';
import { PackLoader } from '../core/pack-loader.js';
import { exportCursorPlugin } from '../exporters/cursor-plugin.js';

interface ExportCliOptions {
  format: string;
  output?: string;
  pack?: string;
  verbose?: boolean;
}

/**
 * Run the export command.
 * Exports packs to a target-native format (e.g. Cursor plugin).
 */
export function runExport(
  projectRoot: string,
  options: ExportCliOptions
): void {
  const config = loadWorkspaceConfig(projectRoot);
  const verbose = options.verbose ?? config.verbose;
  const loader = new PackLoader(projectRoot, config);
  const { packs, warnings: loadWarnings } = loader.loadAll();

  for (const w of loadWarnings) {
    console.log(chalk.yellow(`  warn: ${w}`));
  }

  if (packs.length === 0) {
    console.log(chalk.red('No packs loaded. Nothing to export.'));
    return;
  }

  // Filter to specific pack if requested
  const packsToExport = options.pack
    ? packs.filter((p) => p.manifest.name === options.pack)
    : packs;

  if (packsToExport.length === 0) {
    console.log(chalk.red(`Pack "${options.pack}" not found.`));
    return;
  }

  const outputDir = resolve(
    projectRoot,
    options.output ?? 'dist/cursor-plugins'
  );

  switch (options.format) {
    case 'cursor-plugin': {
      let totalFiles = 0;
      for (const pack of packsToExport) {
        if (verbose) {
          console.log(chalk.dim(`  Exporting ${pack.manifest.name}...`));
        }
        const result = exportCursorPlugin(pack, outputDir);
        totalFiles += result.filesWritten.length;

        if (verbose) {
          console.log(
            chalk.dim(`    ${result.filesWritten.length} file(s) written`)
          );
        }
      }
      console.log(
        chalk.green(
          `Exported ${packsToExport.length} pack(s) as Cursor plugins (${totalFiles} files) to ${outputDir}`
        )
      );
      break;
    }
    default:
      console.log(
        chalk.red(
          `Unknown export format: "${options.format}". Supported: cursor-plugin`
        )
      );
  }
}
