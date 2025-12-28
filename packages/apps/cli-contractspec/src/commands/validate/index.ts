import { existsSync } from 'fs';
import chalk from 'chalk';
import { resolve } from 'path';
import { select } from '@inquirer/prompts';
import {
  createNodeAdapters,
  loadWorkspaceConfig,
  validateImplementationFiles,
  validateSpec,
  validateBlueprint,
  validateTenantConfig,
  validateImplementationWithAgent,
  type AppBlueprintSpec,
} from '@contractspec/bundle.workspace';
import type { Config } from '../../utils/config';

interface ValidateOptions {
  blueprint?: string;
  tenantConfig?: string;
  connections?: string[] | string;
  integrationRegistrars?: string[] | string;
  translationCatalog?: string;
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

  // Create adapters once
  const adapters = createNodeAdapters({
    cwd: process.cwd(),
    silent: true,
  });

  // 0. Blueprint & Tenant Validation (Independent of spec file if arguments provided)
  // Logic from original: Blueprint validation happens if options.blueprint is set.
  // Tenant validation happens if options.tenantConfig AND blueprintResult exists.
  
  let blueprintSpec: AppBlueprintSpec | undefined;
  let blueprintValid = true;
  let tenantValid = true;

  if (options.blueprint) {
    const result = await validateBlueprint(options.blueprint, adapters);
    if (result.spec) {
        blueprintSpec = result.spec;
        console.log(chalk.cyan(`\nCompass Validating blueprint ${result.spec.meta.key}.v${result.spec.meta.version}`));
    }
    
    if (result.valid) {
        console.log(chalk.green('  ✅ Blueprint validation passed'));
    } else {
        console.log(chalk.red('  ❌ Blueprint validation failed'));
        // Errors printed by original implementation were quite detailed.
        // My service returns strings.
        result.errors.forEach(e => console.log(chalk.red(`   • ${e}`)));
        blueprintValid = false;
    }
  }

  if (options.tenantConfig && blueprintSpec) {
     const result = await validateTenantConfig(
         blueprintSpec, 
         options.tenantConfig, 
         options, 
         adapters
     );
     
     console.log(chalk.cyan(`\n🏗️  Validating tenant config against blueprint`));
     
     if (result.valid) {
         console.log(chalk.green('  ✅ Tenant config validation passed'));
     } else {
         console.log(chalk.red('  ❌ Tenant config validation failed'));
         result.errors.forEach(e => console.log(chalk.red(`   • ${e}`)));
         tenantValid = false;
     }
  }

  // Validate spec file exists
  if (!existsSync(specFile)) {
    console.error(chalk.red(`❌ Spec file not found: ${specFile}`));
    process.exit(1);
  }

  // Interactive Prompt for Implementation check
  const shouldPrompt = typeof options.checkImplementation !== 'boolean';
  let validateImplementation = Boolean(options.checkImplementation);

  if (shouldPrompt && process.stdout.isTTY) {
      const choice = await select({
        message: 'Validate only the spec or also the implementation?',
        default: 'spec',
        choices: [
          { name: 'Spec file only', value: 'spec' },
          { name: 'Spec + implementation (AI-assisted)', value: 'both' },
        ],
      });
      validateImplementation = choice === 'both';
  } else if (shouldPrompt) {
      validateImplementation = false;
  }

  let hasErrors = !blueprintValid || !tenantValid;

  console.log(chalk.gray(`Validating: ${specFile}\n`));
  
  // 1. Spec validation (Structure)
  console.log(chalk.cyan('📋 Checking spec structure...'));
  
  const skipSpecStructure =
    options.blueprint &&
    resolve(process.cwd(), options.blueprint) === resolve(process.cwd(), specFile);

  const specResult = await validateSpec(specFile, adapters, {
      skipStructure: !!skipSpecStructure
  });
  
  if (!specResult.valid) {
      console.log(chalk.red('  ❌ Spec structure has errors:'));
      specResult.errors.forEach((error) => console.log(chalk.red(`     • ${error}`)));
      hasErrors = true;
  } else if (!skipSpecStructure) {
      console.log(chalk.green('  ✅ Spec structure is valid'));
  } else {
      console.log(chalk.yellow('⚠️  Skipping spec-structure checks (blueprint file).'));
  }

  if (specResult.warnings.length > 0) {
      console.log(chalk.yellow('\n  ⚠️  Warnings:'));
      specResult.warnings.forEach((warning) => console.log(chalk.yellow(`     • ${warning}`)));
  }

  // 2. Implementation validation (if requested)
  // specResult.code should be available now from our previous optimization!
  if (validateImplementation && specResult.code) {
    console.log(chalk.cyan('\n🤖 Validating implementation with AI...'));
    
    // Config casting might be needed if types mismatch, but we assume structural compatibility
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bundleConfig = config as any; 
    
    const implResult = await validateImplementationWithAgent(
        specFile,
        specResult.code,
        bundleConfig,
        options,
        adapters
    );

    if (implResult.success) {
        console.log(chalk.green('  ✅ Implementation matches specification'));
        if (implResult.suggestions.length) {
             console.log(chalk.cyan('\n  💡 Suggestions:'));
             implResult.suggestions.forEach(s => console.log(chalk.gray(`     • ${s}`)));
        }
    } else {
        hasErrors = true;
        console.log(chalk.red('  ❌ Implementation has issues:'));
        implResult.errors.forEach(e => console.log(chalk.red(`     • ${e}`)));
        
        if (implResult.warnings.length) console.log(chalk.yellow('\n  Warnings:'));
        implResult.warnings.forEach(w => console.log(chalk.yellow(`     • ${w}`)));
        
        if (implResult.report) {
             console.log(chalk.gray('\n  Detailed Report:'));
             console.log(chalk.gray('  ' + '-'.repeat(60)));
             console.log(chalk.gray(implResult.report.split('\n').map(l => `  ${l}`).join('\n')));
             console.log(chalk.gray('  ' + '-'.repeat(60)));
        }
    }
  }

  // 3. Handler validation (if requested)
  if (options.checkHandlers) {
    console.log(chalk.cyan('\n🔧 Checking handler implementation...'));
    const workspaceConfig = await loadWorkspaceConfig(adapters.fs);
    const result = await validateImplementationFiles(
      specFile,
      { fs: adapters.fs },
      workspaceConfig,
      { checkHandlers: true, outputDir: workspaceConfig.outputDir }
    );

    if (!result.valid) {
      hasErrors = true;
      result.errors.forEach(err => console.log(chalk.red(`  ❌ ${err}`)));
    } else {
      console.log(chalk.green('  ✅ Handler check passed'));
    }
    result.warnings.forEach(w => console.log(chalk.yellow(`  ⚠️  ${w}`)));
  }

  // 4. Test validation (if requested)
  if (options.checkTests) {
    console.log(chalk.cyan('\n🧪 Checking test coverage...'));
    const workspaceConfig = await loadWorkspaceConfig(adapters.fs);
    const result = await validateImplementationFiles(
      specFile,
      { fs: adapters.fs },
      workspaceConfig,
      { checkTests: true, outputDir: workspaceConfig.outputDir }
    );

    if (!result.valid) {
      hasErrors = true;
      result.errors.forEach(err => console.log(chalk.red(`  ❌ ${err}`)));
    } else {
      console.log(chalk.green('  ✅ Test check passed'));
    }
    result.warnings.forEach(w => console.log(chalk.yellow(`  ⚠️  ${w}`)));
  }

  // Summary
  console.log();
  if (hasErrors) {
    console.log(chalk.red('❌ Validation failed'));
    process.exit(1);
  }

  console.log(chalk.green('✅ Validation passed'));
}

export { type ValidateOptions };
