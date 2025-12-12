import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

interface ContractSpec {
  meta?: {
    name?: string;
    stability?: string;
    owners?: string[];
    tags?: string[];
  };
  kind?: string;
  [key: string]: any;
}

export const diffCommand = new Command('diff')
  .description('Compare contract specs and show differences')
  .arguments('<spec1> <spec2>')
  .option('--breaking', 'Only show breaking changes')
  .option('--semantic', 'Show semantic differences (not just text)')
  .option('--json', 'Output as JSON for scripting')
  .option('--baseline <ref>', 'Compare with git reference (branch/commit)')
  .action(async (spec1, spec2, options) => {
    const { breaking, semantic, json, baseline } = options;

  try {
    let spec1Content: string;
    let spec2Content: string;
    let spec1Path: string;
    let spec2Path: string;

    if (baseline) {
      // Compare with git reference
      spec1Path = spec1 || '';
      spec2Path = spec1 || '';

        if (!existsSync(spec1)) {
          console.error(chalk.red(`File not found: ${spec1}`));
          process.exit(1);
        }

        try {
          spec1Content = readFileSync(spec1, 'utf-8');
          spec2Content = execSync(`git show ${baseline}:${spec1}`, { encoding: 'utf-8' });
        } catch (error: any) {
          console.error(chalk.red(`Could not get baseline version: ${error.message}`));
          process.exit(1);
        }
      } else {
        // Compare two files
        spec1Path = spec1;
        spec2Path = spec2;

        if (!existsSync(spec1)) {
          console.error(chalk.red(`File not found: ${spec1}`));
          process.exit(1);
        }
        if (!existsSync(spec2)) {
          console.error(chalk.red(`File not found: ${spec2}`));
          process.exit(1);
        }

        spec1Content = readFileSync(spec1, 'utf-8');
        spec2Content = readFileSync(spec2, 'utf-8');
      }

      if (semantic) {
        await compareSemantic(spec1Content, spec2Content, spec1Path, spec2Path, options);
      } else {
        await compareText(spec1Content, spec2Content, spec1Path, spec2Path, options);
      }

    } catch (error: any) {
      console.error(chalk.red(`Error comparing specs: ${error.message}`));
      process.exit(1);
    }
  });

async function compareText(content1: string, content2: string, path1: string | undefined, path2: string | undefined, options: any) {
  const { json } = options;

  try {
    const lines1 = content1.split('\n');
    const lines2 = content2.split('\n');

    // Simple diff implementation (for basic text comparison)
    const diff: Array<{type: 'add' | 'remove' | 'same', line: string, lineNumber?: number}> = [];

    const maxLines = Math.max(lines1.length, lines2.length);
    let i = 0, j = 0;

    while (i < lines1.length || j < lines2.length) {
      if (i < lines1.length && j < lines2.length) {
        if ((lines1[i] || '') === (lines2[j] || '')) {
          diff.push({ type: 'same', line: lines1[i] || '' });
          i++; j++;
        } else {
          // Check if it's an addition or removal
          if (i < lines1.length && j < lines2.length && lines1[i] === lines2[j + 1]) {
            diff.push({ type: 'add', line: lines2[j] || '', lineNumber: j + 1 });
            j++;
          } else if (i < lines1.length && j < lines2.length && lines2[j] === lines1[i + 1]) {
            diff.push({ type: 'remove', line: lines1[i] || '', lineNumber: i + 1 });
            i++;
          } else {
            diff.push({ type: 'remove', line: lines1[i] || '', lineNumber: i + 1 });
            diff.push({ type: 'add', line: lines2[j] || '', lineNumber: j + 1 });
            i++; j++;
          }
        }
      } else if (i < lines1.length) {
        diff.push({ type: 'remove', line: lines1[i] || '', lineNumber: i + 1 });
        i++;
      } else {
        diff.push({ type: 'add', line: lines2[j] || '', lineNumber: j + 1 });
        j++;
      }
    }

    const changes = diff.filter(d => d.type !== 'same');

    if (json) {
      console.log(JSON.stringify({
        spec1: path1 || 'unknown',
        spec2: path2 || 'unknown',
        changes: changes.length,
        diff: changes
      }, null, 2));
    } else {
      console.log(chalk.bold(`\n📋 Comparing: ${path1 || 'unknown'} ↔ ${path2 || 'unknown'}`));
      console.log(chalk.gray(`Changes: ${changes.length}`));
      console.log('');

      changes.forEach(change => {
        const prefix = change.type === 'add' ? chalk.green('+') :
                      change.type === 'remove' ? chalk.red('-') : ' ';
        const lineNum = change.lineNumber ? chalk.gray(`${change.lineNumber}:`) : '';
        console.log(`${prefix} ${lineNum} ${change.line}`);
      });

      if (changes.length === 0) {
        console.log(chalk.green('✅ Files are identical'));
      }
    }

    } catch (error: any) {
      console.error(chalk.red(`Text comparison failed: ${error.message}`));
    }
}

async function compareSemantic(content1: string, content2: string, path1: string | undefined, path2: string | undefined, options: any) {
  const { json, breaking } = options;

  try {
    // Parse contract specs (simplified - would need more robust parsing in real implementation)
    const spec1 = parseContractSpec(content1);
    const spec2 = parseContractSpec(content2);

    const differences: Array<{
      type: 'added' | 'removed' | 'changed' | 'breaking';
      path: string;
      oldValue?: any;
      newValue?: any;
      description: string;
    }> = [];

    // Compare meta information
    compareMeta(spec1, spec2, differences);

    // Compare structure
    compareStructure(spec1, spec2, differences);

    // Filter breaking changes if requested
    const filteredDiffs = breaking ? differences.filter(d => d.type === 'breaking') : differences;

    if (json) {
      console.log(JSON.stringify({
        spec1: path1 || 'unknown',
        spec2: path2 || 'unknown',
        differences: filteredDiffs
      }, null, 2));
    } else {
      console.log(chalk.bold(`\n📋 Semantic Comparison: ${path1 || 'unknown'} ↔ ${path2 || 'unknown'}`));
      console.log(chalk.gray(`Differences: ${filteredDiffs.length}`));
      console.log('');

      if (filteredDiffs.length === 0) {
        console.log(chalk.green('✅ No semantic differences found'));
        return;
      }

      filteredDiffs.forEach(diff => {
        const icon = diff.type === 'breaking' ? '💥' :
                    diff.type === 'added' ? '➕' :
                    diff.type === 'removed' ? '➖' : '✏️';

        const color = diff.type === 'breaking' ? chalk.red :
                     diff.type === 'added' ? chalk.green :
                     diff.type === 'removed' ? chalk.red : chalk.yellow;

        console.log(`${icon} ${color(diff.path)}: ${diff.description}`);

        if (diff.oldValue !== undefined) {
          console.log(`  ${chalk.red('-')} ${JSON.stringify(diff.oldValue)}`);
        }
        if (diff.newValue !== undefined) {
          console.log(`  ${chalk.green('+')} ${JSON.stringify(diff.newValue)}`);
        }
      });
    }

  } catch (error: any) {
    console.error(chalk.red(`Semantic comparison failed: ${error.message}`));
    console.log(chalk.gray('Falling back to text comparison...'));
    await compareText(content1, content2, path1, path2, options);
  }
}

function parseContractSpec(content: string): ContractSpec {
  // Simplified parsing - would need more robust implementation
  try {
    // Try to extract the contract object
    const match = content.match(/export\s+(?:const|default)\s+\w+\s*=\s*({[\s\S]*});/);
    if (match && match[1]) {
      // Very basic parsing - in real implementation would use AST parsing
      const contractStr = match[1];
      return JSON.parse(contractStr.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*):/g, '$1"$2":'));
    }
  } catch (error: any) {
    console.warn(`Warning: Could not parse contract: ${error.message}`);
    // Fall back to empty object
  }
  return {};
}

function compareMeta(spec1: ContractSpec, spec2: ContractSpec, differences: any[]) {
  const meta1 = spec1.meta || {};
  const meta2 = spec2.meta || {};

  // Compare stability (downgrades are breaking)
  if ((meta1.stability || '') !== (meta2.stability || '')) {
    const stabilityOrder: Record<string, number> = { experimental: 0, beta: 1, stable: 2, deprecated: 3 };
    const breaking = (stabilityOrder[meta2.stability || ''] || 0) > (stabilityOrder[meta1.stability || ''] || 0);

    differences.push({
      type: breaking ? 'breaking' : 'changed',
      path: 'meta.stability',
      oldValue: meta1.stability,
      newValue: meta2.stability,
      description: `Stability changed from ${meta1.stability || 'unknown'} to ${meta2.stability || 'unknown'}`
    });
  }

  // Compare owners
  const owners1 = meta1.owners || [];
  const owners2 = meta2.owners || [];
  if (JSON.stringify(owners1.sort()) !== JSON.stringify(owners2.sort())) {
    differences.push({
      type: 'changed',
      path: 'meta.owners',
      oldValue: owners1,
      newValue: owners2,
      description: 'Owners list changed'
    });
  }
}

function compareStructure(spec1: ContractSpec, spec2: ContractSpec, differences: any[]) {
  // Compare top-level keys
  const keys1 = Object.keys(spec1);
  const keys2 = Object.keys(spec2);

  const added = keys2.filter(k => !keys1.includes(k));
  const removed = keys1.filter(k => !keys2.includes(k));

  added.forEach(key => {
    differences.push({
      type: 'added',
      path: key,
      newValue: spec2[key],
      description: `Added ${key} section`
    });
  });

  removed.forEach(key => {
    const isBreaking = ['io', 'policy', 'events'].includes(key);
    differences.push({
      type: isBreaking ? 'breaking' : 'removed',
      path: key,
      oldValue: spec1[key],
      description: `Removed ${key} section`
    });
  });
}
