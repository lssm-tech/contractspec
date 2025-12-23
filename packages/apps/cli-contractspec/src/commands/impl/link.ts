/**
 * impl link command
 *
 * Add explicit implementation mapping to a spec.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { readFileSync, writeFileSync } from 'fs';
import type { ImplementationType } from '@lssm/lib.contracts';
import type { ImplLinkOptions } from './types';

/**
 * Parse the implementations array from spec source code.
 */
function parseImplementationsFromSource(source: string): {
  hasField: boolean;
  startIndex: number;
  endIndex: number;
  implementations: { path: string; type: string; description?: string }[];
} {
  // Look for existing implementations field
  const implMatch = source.match(/implementations\s*:\s*\[([\s\S]*?)\]/);

  if (implMatch && implMatch.index !== undefined) {
    const block = implMatch[1] ?? '';
    const implementations: {
      path: string;
      type: string;
      description?: string;
    }[] = [];

    // Parse existing entries
    const entryRegex =
      /\{\s*path\s*:\s*['"`]([^'"`]+)['"`]\s*,\s*type\s*:\s*['"`]([^'"`]+)['"`](?:\s*,\s*description\s*:\s*['"`]([^'"`]+)['"`])?\s*\}/g;
    let entryMatch;
    while ((entryMatch = entryRegex.exec(block)) !== null) {
      implementations.push({
        path: entryMatch[1] ?? '',
        type: entryMatch[2] ?? '',
        description: entryMatch[3],
      });
    }

    return {
      hasField: true,
      startIndex: implMatch.index,
      endIndex: implMatch.index + implMatch[0].length,
      implementations,
    };
  }

  return {
    hasField: false,
    startIndex: -1,
    endIndex: -1,
    implementations: [],
  };
}

/**
 * Find the best insertion point for implementations field.
 */
function findInsertionPoint(source: string): { index: number; prefix: string } {
  // Look for common fields that come before implementations
  const fields = [
    'acceptance',
    'tests',
    'transport',
    'telemetry',
    'sideEffects',
    'policy',
    'io',
    'meta',
  ];

  for (const field of fields) {
    const fieldMatch = source.match(
      new RegExp(`(${field}\\s*:\\s*\\{[^}]*\\})`)
    );
    if (fieldMatch && fieldMatch.index !== undefined) {
      // Find the end of this field block
      let braceCount = 0;
      let inString = false;
      let stringChar = '';
      let endIndex = fieldMatch.index;

      for (let i = fieldMatch.index; i < source.length; i++) {
        const char = source[i];

        if (inString) {
          if (char === stringChar && source[i - 1] !== '\\') {
            inString = false;
          }
        } else {
          if (char === '"' || char === "'" || char === '`') {
            inString = true;
            stringChar = char;
          } else if (char === '{') {
            braceCount++;
          } else if (char === '}') {
            braceCount--;
            if (braceCount === 0) {
              endIndex = i + 1;
              break;
            }
          }
        }
      }

      return { index: endIndex, prefix: ',\n\n  ' };
    }
  }

  // Fallback: find the closing brace of the spec object
  const lastBrace = source.lastIndexOf('}');
  if (lastBrace > 0) {
    return { index: lastBrace, prefix: '\n  ' };
  }

  return { index: source.length, prefix: '\n  ' };
}

/**
 * Generate the implementations field source code.
 */
function generateImplementationsSource(
  implementations: { path: string; type: string; description?: string }[]
): string {
  const entries = implementations.map((impl) => {
    const parts = [`path: '${impl.path}'`, `type: '${impl.type}'`];
    if (impl.description) {
      parts.push(`description: '${impl.description}'`);
    }
    return `    { ${parts.join(', ')} }`;
  });

  return `implementations: [\n${entries.join(',\n')}\n  ]`;
}

/**
 * Run link command
 */
async function runLink(
  specPath: string,
  implPath: string,
  options: ImplLinkOptions
): Promise<void> {
  const spinner = ora('Adding implementation mapping...').start();

  try {
    // Read spec file
    const source = readFileSync(specPath, 'utf-8');

    // Parse existing implementations
    const parsed = parseImplementationsFromSource(source);

    // Check if this implementation is already linked
    if (parsed.implementations.some((i) => i.path === implPath)) {
      spinner.info('Implementation already linked');
      console.log(
        chalk.yellow(`'${implPath}' is already in the implementations array.`)
      );
      return;
    }

    // Determine implementation type
    const type: ImplementationType = options.type ?? inferType(implPath);

    // Add new implementation
    const newImpl = {
      path: implPath,
      type,
      description: options.description,
    };

    const updatedImpls = [...parsed.implementations, newImpl];

    // Generate new source
    let newSource: string;

    if (parsed.hasField) {
      // Replace existing implementations field
      const before = source.substring(0, parsed.startIndex);
      const after = source.substring(parsed.endIndex);
      newSource = before + generateImplementationsSource(updatedImpls) + after;
    } else {
      // Add new implementations field
      const insertion = findInsertionPoint(source);
      const before = source.substring(0, insertion.index);
      const after = source.substring(insertion.index);
      newSource =
        before +
        insertion.prefix +
        generateImplementationsSource(updatedImpls) +
        after;
    }

    // Write updated file
    writeFileSync(specPath, newSource, 'utf-8');

    spinner.succeed('Implementation linked');
    console.log(chalk.green(`Added ${implPath} (${type}) to ${specPath}`));
  } catch (error) {
    spinner.fail('Failed to link implementation');
    console.error(
      chalk.red(error instanceof Error ? error.message : String(error))
    );
    process.exitCode = 1;
  }
}

/**
 * Infer implementation type from file path.
 */
function inferType(path: string): ImplementationType {
  const lower = path.toLowerCase();

  if (lower.includes('.handler.')) return 'handler';
  if (lower.includes('.service.')) return 'service';
  if (lower.includes('.test.') || lower.includes('.spec.')) return 'test';
  if (lower.includes('.form.')) return 'form';
  if (lower.includes('.hook.')) return 'hook';
  if (lower.endsWith('.tsx')) return 'component';

  if (lower.includes('/handlers/')) return 'handler';
  if (lower.includes('/services/')) return 'service';
  if (lower.includes('/components/')) return 'component';
  if (lower.includes('/forms/')) return 'form';
  if (lower.includes('/hooks/')) return 'hook';
  if (lower.includes('/__tests__/')) return 'test';

  return 'other';
}

/**
 * Create the link command
 */
export function createLinkCommand(): Command {
  return new Command('link')
    .description('Add explicit implementation mapping to a spec')
    .argument('<spec>', 'Path to spec file')
    .argument('<impl>', 'Path to implementation file')
    .option(
      '-t, --type <type>',
      'Implementation type: handler, component, form, test, service, hook, other'
    )
    .option('-d, --description <desc>', 'Description of the implementation')
    .action(async (spec: string, impl: string, options: ImplLinkOptions) => {
      await runLink(spec, impl, options);
    });
}
