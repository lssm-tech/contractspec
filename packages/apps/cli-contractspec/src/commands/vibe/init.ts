import { Command } from 'commander';
import chalk from 'chalk';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { confirm } from '@inquirer/prompts';
import { findWorkspaceRoot } from '@contractspec/bundle.workspace';

export const vibeInitCommand = new Command('init')
  .description('Initialize ContractSpec Vibe in your project')
  .option('-f, --force', 'Overwrite existing Vibe configuration', false)
  .option('--non-interactive', 'Skip all prompts (use defaults)', false)
  .action(async (options) => {
    const cwd = process.cwd();
    const root = findWorkspaceRoot(cwd) || cwd;
    const dotContractSpecDir = join(root, '.contractspec');
    const vibeDir = join(dotContractSpecDir, 'vibe');
    const workDir = join(dotContractSpecDir, 'work');
    const contractsDir = join(root, 'contracts');

    console.log(chalk.bold('\n🌊 ContractSpec Vibe Initialization\n'));

    // Check if already initialized
    if (existsSync(vibeDir) && !options.force) {
      console.log(
        chalk.yellow('Vibe is already initialized. Use --force to overwrite.')
      );
      return;
    }

    // Interactive confirmation if overwriting
    if (existsSync(vibeDir) && options.force && !options.nonInteractive) {
      const shouldOverwrite = await confirm({
        message: 'This will overwrite existing Vibe configuration. Continue?',
        default: false,
      });
      if (!shouldOverwrite) {
        console.log('Aborted.');
        return;
      }
    }

    try {
      // 1. Create .contractspec/vibe
      await mkdir(vibeDir, { recursive: true });
      console.log(chalk.green(`✓ Created ${vibeDir}`));

      // 2. Create .contractspec/work
      await mkdir(workDir, { recursive: true });
      console.log(chalk.green(`✓ Created ${workDir}`));

      // 3. Create technical-preferences.md
      const techPrefsPath = join(vibeDir, 'technical-preferences.md');
      const techPrefsContent = `# Technical Preferences

This file guides AI agents on project-specific patterns and constraints.

## Code Style
- Use TypeScript strict mode
- Prefer functional patterns over class-based inheritance
- Use "type" over "interface" for data structures

## Architecture
- Hexagonal architecture (domain, application, infrastructure)
- No direct database access in controllers

## Testing
- Jest for unit tests
- write tests before code (TDD)
`;
      await writeFile(techPrefsPath, techPrefsContent);
      console.log(chalk.green(`✓ Created ${techPrefsPath}`));

      // 4. Create config.json
      const configPath = join(vibeDir, 'config.json');
      const configContent = JSON.stringify(
        {
          canonicalRoot: 'contracts',
          workRoot: '.contractspec/work',
          generatedRoot: 'src/generated',
          alwaysInjectFiles: ['.contractspec/vibe/technical-preferences.md'],
          contextExportAllowlist: [
            'README.md',
            'package.json',
            'contracts/**/*.ts',
          ],
        },
        null,
        2
      );
      await writeFile(configPath, configContent);
      console.log(chalk.green(`✓ Created ${configPath}`));

      // 5. Create contracts/ if missing (optional)
      if (!existsSync(contractsDir)) {
        // We verify if we should create it or if the user wants to config it differently
        // For now, per spec, "Optionally: contracts/ if missing"
        await mkdir(contractsDir, { recursive: true });
        console.log(chalk.green(`✓ Created ${contractsDir} (canonical root)`));
      } else {
        console.log(chalk.blue(`ℹ Canonical root exists at ${contractsDir}`));
      }

      console.log(chalk.bold('\n🚀 Vibe Initialized! Next steps:\n'));
      console.log(
        `  1. Review ${chalk.cyan('.contractspec/vibe/config.json')}`
      );
      console.log(
        `  2. Run a workflow: ${chalk.cyan('contractspec vibe run brownfield.openapi-import')}`
      );
    } catch (error) {
      console.error(chalk.red('Initialization failed:'), error);
      process.exit(1);
    }
  });
