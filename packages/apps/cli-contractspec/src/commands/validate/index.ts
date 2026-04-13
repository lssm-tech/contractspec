import type { FsAdapter, LoggerAdapter } from '@contractspec/bundle.workspace';
import {
	createNodeAdapters,
	discoverSpecs,
	validateBlueprint,
	validateDiscoveredSpecs,
	validateImplementationFiles,
	validateImplementationWithAgent,
	validatePackageScaffold,
	validateTenantConfig,
} from '@contractspec/bundle.workspace';
import type { AppBlueprintSpec } from '@contractspec/lib.contracts-spec/app-config';
import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts-spec/workspace-config/contractsrc-types';
import type { SpecScanResult } from '@contractspec/module.workspace';
import { findAuthoringTargetDefinition } from '@contractspec/module.workspace';
import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import { resolve } from 'path';
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

export function resolveValidateImplementationMode(
	options: Pick<ValidateOptions, 'checkImplementation' | 'interactive'>,
	streams: { stdinTty: boolean; stdoutTty: boolean } = {
		stdinTty: Boolean(process.stdin.isTTY),
		stdoutTty: Boolean(process.stdout.isTTY),
	}
) {
	if (options.interactive && (!streams.stdinTty || !streams.stdoutTty)) {
		throw new Error('--interactive requires an interactive TTY.');
	}

	return {
		shouldPrompt:
			options.interactive === true &&
			typeof options.checkImplementation !== 'boolean',
		validateImplementation: Boolean(options.checkImplementation),
	};
}

/**
 * Main validate command implementation
 */
export async function validateCommand(
	specFilePath: string | undefined,
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
	let blueprintSpec: AppBlueprintSpec | undefined;
	let blueprintValid = true;
	let tenantValid = true;

	if (options.blueprint) {
		const result = await validateBlueprint(options.blueprint, adapters);
		if (result.spec) {
			blueprintSpec = result.spec;
			console.log(
				chalk.cyan(
					`\nCompass Validating blueprint ${result.spec.meta.key}.v${result.spec.meta.version}`
				)
			);
		}

		if (result.valid) {
			console.log(chalk.green('  ✅ Blueprint validation passed'));
		} else {
			console.log(chalk.red('  ❌ Blueprint validation failed'));
			result.errors.forEach((e) => console.log(chalk.red(`   • ${e}`)));
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
			result.errors.forEach((e) => console.log(chalk.red(`   • ${e}`)));
			tenantValid = false;
		}
	}

	console.log(chalk.cyan('Scanning workspace for contracts...'));
	const scannedSpecs = await discoverSpecs(adapters, {
		config,
		pattern: specFilePath,
	});

	if (scannedSpecs.length === 0) {
		console.log(chalk.yellow('No specs found to validate.'));
		return;
	}

	console.log(chalk.gray(`Found ${scannedSpecs.length} specs to validate.`));

	// Interactive Prompt for Implementation check
	const mode = resolveValidateImplementationMode(options);
	let validateImplementation = mode.validateImplementation;

	if (mode.shouldPrompt) {
		const choice = await select({
			message: 'Validate only the spec(s) or also the implementation?',
			default: 'spec',
			choices: [
				{ name: 'Spec file only', value: 'spec' },
				{ name: 'Spec + implementation (AI-assisted)', value: 'both' },
			],
		});
		validateImplementation = choice === 'both';
	}

	let hasErrors = !blueprintValid || !tenantValid;

	for (const specFile of scannedSpecs) {
		const result = await validateSingleSpec(
			specFile,
			validateImplementation,
			options,
			config,
			adapters,
			scannedSpecs.length > 1
		);
		if (!result) hasErrors = true;
	}

	// Summary
	console.log();
	if (hasErrors) {
		console.log(chalk.red('❌ Validation failed'));
		process.exit(1);
	}

	console.log(chalk.green('✅ Validation passed'));
}

async function validateSingleSpec(
	specFile: SpecScanResult,
	validateImplementation: boolean,
	options: ValidateOptions,
	workspaceConfig: ResolvedContractsrcConfig,
	adapters: { fs: FsAdapter; logger: LoggerAdapter },
	isBatch: boolean
): Promise<boolean> {
	const label = formatDiscoveredSpecLabel(specFile);
	if (isBatch) {
		console.log(chalk.bold(`\n📄 ${label}`));
	} else {
		console.log(chalk.gray(`Validating: ${label}\n`));
	}

	let isValid = true;

	// 1. Spec validation (Structure)
	if (!isBatch) console.log(chalk.cyan('📋 Checking spec structure...'));

	const skipSpecStructure =
		options.blueprint &&
		resolve(process.cwd(), options.blueprint) ===
			resolve(process.cwd(), specFile.filePath);

	const [specResult] = await validateDiscoveredSpecs([specFile], {
		skipStructure: !!skipSpecStructure,
	});
	if (!specResult) {
		console.log(chalk.red('  ❌ Spec structure could not be evaluated.'));
		return false;
	}

	if (!specResult.valid) {
		console.log(chalk.red('  ❌ Spec structure has errors:'));
		specResult.errors.forEach((error) =>
			console.log(chalk.red(`     • ${error}`))
		);
		isValid = false;
	} else if (!skipSpecStructure) {
		if (!isBatch) console.log(chalk.green('  ✅ Spec structure is valid'));
	} else {
		console.log(
			chalk.yellow('⚠️  Skipping spec-structure checks (blueprint file).')
		);
	}

	if (specResult.warnings.length > 0) {
		console.log(chalk.yellow('\n  ⚠️  Warnings:'));
		specResult.warnings.forEach((warning) =>
			console.log(chalk.yellow(`     • ${warning}`))
		);
	}

	const targetDefinition =
		specResult.spec.specType !== 'unknown'
			? findAuthoringTargetDefinition(specResult.spec.specType)
			: undefined;
	if (targetDefinition?.validation === 'package-scaffold') {
		console.log(chalk.cyan('\n📦 Validating package scaffold...'));
		const packageResult = await validatePackageScaffold(
			specResult.spec,
			adapters.fs
		);
		if (!packageResult.valid) {
			isValid = false;
			packageResult.errors.forEach((error) =>
				console.log(chalk.red(`  ❌ ${error}`))
			);
		} else {
			console.log(chalk.green('  ✅ Package scaffold validation passed'));
		}
		packageResult.warnings.forEach((warning) =>
			console.log(chalk.yellow(`  ⚠️  ${warning}`))
		);
	}

	// 2. Implementation validation (if requested)
	if (
		validateImplementation &&
		specResult.code &&
		targetDefinition?.validation !== 'package-scaffold'
	) {
		console.log(chalk.cyan('\n🤖 Validating implementation with AI...'));

		const implResult = await validateImplementationWithAgent(
			specFile.filePath,
			specResult.code,
			workspaceConfig,
			options,
			adapters
		);

		if (implResult.success) {
			console.log(chalk.green('  ✅ Implementation matches specification'));
			if (implResult.suggestions.length) {
				console.log(chalk.cyan('\n  💡 Suggestions:'));
				implResult.suggestions.forEach((s) =>
					console.log(chalk.gray(`     • ${s}`))
				);
			}
		} else {
			isValid = false;
			console.log(chalk.red('  ❌ Implementation has issues:'));
			implResult.errors.forEach((e) => console.log(chalk.red(`     • ${e}`)));

			if (implResult.warnings.length)
				console.log(chalk.yellow('\n  Warnings:'));
			implResult.warnings.forEach((w) =>
				console.log(chalk.yellow(`     • ${w}`))
			);

			if (implResult.report) {
				console.log(chalk.gray('\n  Detailed Report:'));
				console.log(chalk.gray('  ' + '-'.repeat(60)));
				console.log(
					chalk.gray(
						implResult.report
							.split('\n')
							.map((l) => `  ${l}`)
							.join('\n')
					)
				);
				console.log(chalk.gray('  ' + '-'.repeat(60)));
			}
		}
	}

	// 3. Handler validation (if requested)
	if (
		options.checkHandlers &&
		targetDefinition?.validation !== 'package-scaffold'
	) {
		console.log(chalk.cyan('\n🔧 Checking handler implementation...'));
		const result = await validateImplementationFiles(
			specFile,
			{ fs: adapters.fs },
			workspaceConfig,
			{ checkHandlers: true, outputDir: workspaceConfig.outputDir }
		);

		if (!result.valid) {
			isValid = false;
			result.errors.forEach((err) => console.log(chalk.red(`  ❌ ${err}`)));
		} else {
			console.log(chalk.green('  ✅ Handler check passed'));
		}
		result.warnings.forEach((w) => console.log(chalk.yellow(`  ⚠️  ${w}`)));
	}

	// 4. Test validation (if requested)
	if (
		options.checkTests &&
		targetDefinition?.validation !== 'package-scaffold'
	) {
		console.log(chalk.cyan('\n🧪 Checking test coverage...'));
		const result = await validateImplementationFiles(
			specFile,
			{ fs: adapters.fs },
			workspaceConfig,
			{ checkTests: true, outputDir: workspaceConfig.outputDir }
		);

		if (!result.valid) {
			isValid = false;
			result.errors.forEach((err) => console.log(chalk.red(`  ❌ ${err}`)));
		} else {
			console.log(chalk.green('  ✅ Test check passed'));
		}
		result.warnings.forEach((w) => console.log(chalk.yellow(`  ⚠️  ${w}`)));
	}

	return isValid;
}

function formatDiscoveredSpecLabel(spec: SpecScanResult): string {
	const location = spec.declarationLine
		? `${spec.filePath}:${spec.declarationLine}`
		: spec.filePath;
	return spec.exportName ? `${location} (${spec.exportName})` : location;
}

export { type ValidateOptions };
