import chalk from 'chalk';
import { importFromRulesync } from '../importers/rulesync.js';
import { importFromCursor } from '../importers/cursor.js';
import { importFromClaudeCode } from '../importers/claude-code.js';
import { importFromOpenCode } from '../importers/opencode.js';

interface ImportOptions {
  from: string;
  output?: string;
}

/**
 * Run the import command.
 */
export function runImport(projectRoot: string, options: ImportOptions): void {
  const { from, output } = options;

  switch (from) {
    case 'rulesync': {
      console.log(chalk.dim('Importing from .rulesync/ ...'));
      const result = importFromRulesync(projectRoot, output);

      if (result.warnings.length > 0) {
        for (const w of result.warnings) {
          console.log(chalk.yellow(`  warn: ${w}`));
        }
        return;
      }

      console.log(
        chalk.green(
          `Imported ${result.filesImported.length} file(s) to ${result.packDir}`
        )
      );

      if (result.configGenerated) {
        console.log(
          chalk.green('Generated agentpacks.jsonc from rulesync.jsonc')
        );
      }

      console.log(
        chalk.cyan('\nNext steps:'),
        '\n  1. Review the imported pack at',
        chalk.bold(result.packDir),
        '\n  2. Run',
        chalk.bold('agentpacks generate'),
        'to generate tool configs'
      );
      break;
    }

    case 'cursor': {
      console.log(chalk.dim('Importing from .cursor/ ...'));
      const cursorResult = importFromCursor(projectRoot, output);
      printImportResult(cursorResult, 'Cursor');
      break;
    }

    case 'claude':
    case 'claudecode':
    case 'claude-code': {
      console.log(chalk.dim('Importing from Claude Code...'));
      const claudeResult = importFromClaudeCode(projectRoot, output);
      printImportResult(claudeResult, 'Claude Code');
      break;
    }

    case 'opencode': {
      console.log(chalk.dim('Importing from .opencode/ ...'));
      const ocResult = importFromOpenCode(projectRoot, output);
      printImportResult(ocResult, 'OpenCode');
      break;
    }

    default:
      console.log(chalk.red(`Unknown import source: "${from}"`));
      console.log(
        chalk.dim('Supported sources: rulesync, cursor, claude-code, opencode')
      );
      break;
  }
}

/**
 * Print import result with standard formatting.
 */
function printImportResult(
  result: { packDir: string; filesImported: string[]; warnings: string[] },
  sourceName: string
): void {
  if (result.warnings.length > 0 && result.filesImported.length === 0) {
    for (const w of result.warnings) {
      console.log(chalk.yellow(`  warn: ${w}`));
    }
    return;
  }

  for (const w of result.warnings) {
    console.log(chalk.yellow(`  warn: ${w}`));
  }

  console.log(
    chalk.green(
      `Imported ${result.filesImported.length} file(s) from ${sourceName} to ${result.packDir}`
    )
  );
  console.log(
    chalk.cyan('\nNext steps:'),
    '\n  1. Review the imported pack at',
    chalk.bold(result.packDir),
    '\n  2. Run',
    chalk.bold('agentpacks generate'),
    'to generate tool configs'
  );
}
