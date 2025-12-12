import { Command } from 'commander';
import chalk from 'chalk';
import { glob } from 'glob';
import { readFileSync } from 'fs';
import path from 'path';

interface ContractDependency {
  name: string;
  file: string;
  dependencies: string[];
  dependents: string[];
}

export const depsCommand = new Command('deps')
  .description('Analyze contract dependencies and relationships')
  .option('--spec <file>', 'Analyze dependencies for specific spec')
  .option('--graph', 'Generate dependency graph (requires graphviz)')
  .option('--circular', 'Find circular dependencies')
  .option('--missing', 'Find missing dependencies')
  .option('--json', 'Output as JSON for scripting')
  .action(async (options) => {
    const { spec: targetSpec, graph, circular, missing, json } = options;

    try {
      console.log(chalk.bold('🔗 Analyzing contract dependencies...'));

      // Find all contract specs
      const contractFiles = await glob('**/*.contracts.ts', {
        ignore: ['node_modules/**', 'dist/**', '.turbo/**']
      });

      if (contractFiles.length === 0) {
        console.log(chalk.yellow('No contract specs found.'));
        return;
      }

      // Build dependency graph
      const contracts: Map<string, ContractDependency> = new Map();

      for (const file of contractFiles) {
        try {
          const content = readFileSync(file, 'utf-8');
          const relativePath = path.relative(process.cwd(), file);

          // Extract contract name from file content or filename
          const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);
          const contractName = nameMatch ? nameMatch[1] : path.basename(file, '.contracts.ts').replace(/\.contracts$/, '');

          // Extract imports to find dependencies
          const imports: string[] = [];
          const importRegex = /import\s+.*?\s+from\s+['"]([^'"]*\.contracts(?:\.[jt]s)?)['"]/g;
          let match;
          while ((match = importRegex.exec(content)) !== null) {
            const importPath = match[1];
            if (importPath) {
              // Convert relative import to contract name
              const resolvedPath = path.resolve(path.dirname(file), importPath);
              const resolvedRelative = path.relative(process.cwd(), resolvedPath);
              const depName = path.basename(resolvedRelative, path.extname(resolvedRelative))
                .replace('.contracts', '');
              imports.push(depName);
            }
          }

          const finalName = contractName || 'unknown';
          contracts.set(finalName, {
            name: finalName,
            file: relativePath,
            dependencies: imports,
            dependents: []
          });

        } catch (error: any) {
          console.warn(chalk.yellow(`Warning: Could not analyze ${file}: ${error.message}`));
        }
      }

      // Build reverse dependencies (who depends on whom)
      for (const [name, contract] of contracts) {
        for (const dep of contract.dependencies) {
          const depContract = contracts.get(dep);
          if (depContract) {
            depContract.dependents.push(name);
          }
        }
      }

      if (targetSpec) {
        // Analyze specific contract
        const contract = contracts.get(targetSpec);
        if (!contract) {
          console.error(chalk.red(`Contract '${targetSpec}' not found.`));
          return;
        }

        if (json) {
          console.log(JSON.stringify(contract, null, 2));
        } else {
          console.log(chalk.bold(`\n📋 Contract: ${contract.name}`));
          console.log(chalk.gray(`File: ${contract.file}`));
          console.log('');

          if (contract.dependencies.length > 0) {
            console.log(chalk.cyan('📥 Depends on:'));
            contract.dependencies.forEach(dep => {
              const depContract = contracts.get(dep);
              console.log(`  ${chalk.green('→')} ${dep}${depContract ? ` (${depContract.file})` : ' (missing)'}`);
            });
          } else {
            console.log(chalk.gray('📥 No dependencies'));
          }

          console.log('');

          if (contract.dependents.length > 0) {
            console.log(chalk.cyan('📤 Used by:'));
            contract.dependents.forEach(dep => {
              const depContract = contracts.get(dep);
              console.log(`  ${chalk.blue('←')} ${dep}${depContract ? ` (${depContract.file})` : ''}`);
            });
          } else {
            console.log(chalk.gray('📤 Not used by other contracts'));
          }
        }
      } else if (circular) {
        // Find circular dependencies
        const visited = new Set<string>();
        const recursionStack = new Set<string>();
        const cycles: string[][] = [];

        function detectCycle(contractName: string, path: string[] = []): void {
          if (recursionStack.has(contractName)) {
            const cycleStart = path.indexOf(contractName);
            if (cycleStart !== -1) {
              cycles.push([...path.slice(cycleStart), contractName]);
            }
            return;
          }

          if (visited.has(contractName)) return;

          visited.add(contractName);
          recursionStack.add(contractName);

          const contract = contracts.get(contractName);
          if (contract) {
            for (const dep of contract.dependencies) {
              detectCycle(dep, [...path, contractName]);
            }
          }

          recursionStack.delete(contractName);
        }

        for (const contractName of contracts.keys()) {
          if (!visited.has(contractName)) {
            detectCycle(contractName);
          }
        }

        if (cycles.length === 0) {
          console.log(chalk.green('✅ No circular dependencies found'));
        } else {
          console.log(chalk.red(`❌ Found ${cycles.length} circular dependencies:`));
          cycles.forEach((cycle, index) => {
            console.log(`  ${index + 1}. ${cycle.join(' → ')}`);
          });
        }
      } else if (missing) {
        // Find missing dependencies
        const missingDeps: Array<{contract: string, missing: string[]}> = [];

        for (const [name, contract] of contracts) {
          const missing: string[] = [];
          for (const dep of contract.dependencies) {
            if (!contracts.has(dep)) {
              missing.push(dep);
            }
          }
          if (missing.length > 0) {
            missingDeps.push({ contract: name, missing });
          }
        }

        if (missingDeps.length === 0) {
          console.log(chalk.green('✅ All dependencies resolved'));
        } else {
          console.log(chalk.red(`❌ Found missing dependencies:`));
          missingDeps.forEach(({ contract, missing }) => {
            console.log(`  ${chalk.cyan(contract)} is missing:`);
            missing.forEach(dep => {
              console.log(`    ${chalk.red('→')} ${dep}`);
            });
          });
        }
      } else if (graph) {
        // Generate graphviz dot file
        console.log('digraph ContractDependencies {');
        console.log('  rankdir=LR;');
        console.log('  node [shape=box];');

        for (const [name, contract] of contracts) {
          for (const dep of contract.dependencies) {
            console.log(`  "${name}" -> "${dep}";`);
          }
        }

        console.log('}');
        console.log('');
        console.log(chalk.gray('💡 Pipe to graphviz: cat deps.dot | dot -Tpng > deps.png'));
      } else {
        // Show overview
        if (json) {
          const overview = {
            total: contracts.size,
            contracts: Array.from(contracts.values()).map(c => ({
              name: c.name,
              file: c.file,
              dependencies: c.dependencies,
              dependents: c.dependents
            }))
          };
          console.log(JSON.stringify(overview, null, 2));
        } else {
          console.log(chalk.bold(`\n📊 Dependency Overview`));
          console.log(chalk.gray(`Total contracts: ${contracts.size}`));

          const withDeps = Array.from(contracts.values()).filter(c => c.dependencies.length > 0);
          const withoutDeps = Array.from(contracts.values()).filter(c => c.dependencies.length === 0);
          const used = Array.from(contracts.values()).filter(c => c.dependents.length > 0);
          const unused = Array.from(contracts.values()).filter(c => c.dependents.length === 0);

          console.log(chalk.gray(`Contracts with dependencies: ${withDeps.length}`));
          console.log(chalk.gray(`Contracts without dependencies: ${withoutDeps.length}`));
          console.log(chalk.gray(`Used contracts: ${used.length}`));
          console.log(chalk.gray(`Unused contracts: ${unused.length}`));

          if (unused.length > 0) {
            console.log(chalk.yellow('\n⚠️  Potentially unused contracts:'));
            unused.forEach(c => {
              console.log(`  ${chalk.gray(c.name)} (${c.file})`);
            });
          }
        }
      }

    } catch (error: any) {
      console.error(chalk.red(`Error analyzing dependencies: ${error.message}`));
      process.exit(1);
    }
  });
