import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import chalk from 'chalk';
import { basename, dirname, join } from 'path';
import { select } from '@inquirer/prompts';
import { AgentOrchestrator } from '../../ai/agents/index';
import { validateProvider } from '../../ai/providers';
import { validateSpecStructure } from './spec-checker';
import type { Config } from '../../utils/config';

interface ValidateOptions {
  checkHandlers?: boolean;
  checkTests?: boolean;
  checkImplementation?: boolean;
  implementationPath?: string;
  agentMode?: string;
  interactive?: boolean;
}

/**
 * Main validate command implementation
 */
export async function validateCommand(
  specFile: string,
  options: ValidateOptions,
  config: Config
) {
  console.log(chalk.bold.blue('\n🔍 Contract Validator\n'));

  // Validate spec file exists
  if (!existsSync(specFile)) {
    console.error(chalk.red(`❌ Spec file not found: ${specFile}`));
    process.exit(1);
  }

  // Read spec file
  const specCode = await readFile(specFile, 'utf-8');
  const fileName = basename(specFile);

  console.log(chalk.gray(`Validating: ${specFile}\n`));

  // Interactive mode - ask what to validate
  let validateImplementation = options.checkImplementation || false;

  if (options.interactive) {
    const choice = await select({
      message: 'What would you like to validate?',
      choices: [
        { name: 'Spec file only', value: 'spec' },
        { name: 'Spec file + implementation', value: 'both' },
      ],
    });

    validateImplementation = choice === 'both';
  }

  // Run validations
  let hasErrors = false;

  // 1. Spec structure validation
  console.log(chalk.cyan('📋 Checking spec structure...'));
  const structureResult = validateSpecStructure(specCode, fileName);

  if (structureResult.valid) {
    console.log(chalk.green('  ✅ Spec structure is valid'));
  } else {
    console.log(chalk.red('  ❌ Spec structure has errors:'));
    structureResult.errors.forEach((error) => {
      console.log(chalk.red(`     • ${error}`));
    });
    hasErrors = true;
  }

  // Display warnings if any
  if (structureResult.warnings.length > 0) {
    console.log(chalk.yellow('\n  ⚠️  Warnings:'));
    structureResult.warnings.forEach((warning) => {
      console.log(chalk.yellow(`     • ${warning}`));
    });
  }

  // 2. Implementation validation (if requested)
  if (validateImplementation) {
    const implResult = await validateImplementation_AI(
      specFile,
      specCode,
      options,
      config
    );

    if (!implResult.success) {
      hasErrors = true;
    }
  }

  // 3. Handler validation (if requested)
  if (options.checkHandlers) {
    console.log(chalk.cyan('\n🔧 Checking handler implementation...'));
    console.log(chalk.yellow('  ⚠️  Handler validation not yet implemented'));
    // TODO: Implement handler checking
  }

  // 4. Test validation (if requested)
  if (options.checkTests) {
    console.log(chalk.cyan('\n🧪 Checking test coverage...'));
    console.log(chalk.yellow('  ⚠️  Test validation not yet implemented'));
    // TODO: Implement test checking
  }

  // Summary
  console.log();
  if (hasErrors) {
    console.log(chalk.red('❌ Validation failed'));
    process.exit(1);
  } else {
    console.log(chalk.green('✅ Validation passed'));
  }
}

/**
 * Validate implementation against spec using AI agents
 */
async function validateImplementation_AI(
  specFile: string,
  specCode: string,
  options: ValidateOptions,
  config: Config
): Promise<{ success: boolean }> {
  console.log(chalk.cyan('\n🤖 Validating implementation with AI...'));

  // Check if AI is available
  const validation = await validateProvider(config);
  if (!validation.success) {
    console.log(chalk.yellow(`  ⚠️  AI not available: ${validation.error}`));
    console.log(chalk.gray('  Skipping AI validation'));
    return { success: true };
  }

  // Find implementation file
  let implementationPath = options.implementationPath;

  if (!implementationPath) {
    // Try to infer from spec file path
    const specDir = dirname(specFile);
    const specBaseName = basename(specFile, '.ts');

    // Try common patterns
    const possiblePaths = [
      join(specDir, specBaseName.replace('.contracts', '.handler') + '.ts'),
      join(specDir, specBaseName.replace('.presentation', '') + '.tsx'),
      join(specDir, specBaseName.replace('.form', '.form') + '.tsx'),
      join(
        dirname(specDir),
        'handlers',
        specBaseName.replace('.contracts', '.handler') + '.ts'
      ),
      join(
        dirname(specDir),
        'components',
        specBaseName.replace('.presentation', '') + '.tsx'
      ),
    ];

    for (const path of possiblePaths) {
      if (existsSync(path)) {
        implementationPath = path;
        break;
      }
    }
  }

  if (!implementationPath || !existsSync(implementationPath)) {
    console.log(chalk.yellow('  ⚠️  Implementation file not found'));
    console.log(chalk.gray('  Please specify with --implementation-path'));
    return { success: true };
  }

  console.log(chalk.gray(`  Implementation: ${implementationPath}`));

  // Read implementation
  const implementationCode = await readFile(implementationPath, 'utf-8');

  // Use agent orchestrator to validate
  const orchestrator = new AgentOrchestrator(config);
  console.log(chalk.cyan(`  Using agent mode: ${config.agentMode}\n`));

  const result = await orchestrator.validate(specCode, implementationCode);

  if (result.success) {
    console.log(chalk.green('  ✅ Implementation matches specification'));

    if (result.suggestions && result.suggestions.length > 0) {
      console.log(chalk.cyan('\n  💡 Suggestions:'));
      result.suggestions.forEach((s) => console.log(chalk.gray(`     • ${s}`)));
    }

    return { success: true };
  } else {
    console.log(chalk.red('  ❌ Implementation has issues:\n'));

    if (result.errors && result.errors.length > 0) {
      console.log(chalk.red('  Errors:'));
      result.errors.forEach((e) => console.log(chalk.red(`     • ${e}`)));
    }

    if (result.warnings && result.warnings.length > 0) {
      console.log(chalk.yellow('\n  Warnings:'));
      result.warnings.forEach((w) => console.log(chalk.yellow(`     • ${w}`)));
    }

    if (result.suggestions && result.suggestions.length > 0) {
      console.log(chalk.cyan('\n  Suggestions:'));
      result.suggestions.forEach((s) => console.log(chalk.gray(`     • ${s}`)));
    }

    // Show validation report if available
    if (result.code) {
      console.log(chalk.gray('\n  Detailed Report:'));
      console.log(chalk.gray('  ' + '-'.repeat(60)));
      console.log(
        chalk.gray(
          result.code
            .split('\n')
            .map((l) => `  ${l}`)
            .join('\n')
        )
      );
      console.log(chalk.gray('  ' + '-'.repeat(60)));
    }

    return { success: false };
  }
}
