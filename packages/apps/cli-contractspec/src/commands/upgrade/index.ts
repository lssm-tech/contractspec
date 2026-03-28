/**
 * Upgrade command.
 *
 * Supports both the legacy package/config upgrader and the new guided
 * release-manifest based workflow.
 */

import { execSync } from 'node:child_process';
import {
	createConsoleLoggerAdapter,
	createNodeFsAdapter,
	upgrade,
} from '@contractspec/bundle.workspace';
import type { AgentTarget } from '@contractspec/lib.contracts-spec';
import { confirm, select } from '@inquirer/prompts';
import chalk from 'chalk';
import { Command } from 'commander';
import ora from 'ora';

interface LegacyUpgradeOptions {
	all?: boolean;
	packages?: boolean;
	config?: boolean;
	dryRun?: boolean;
	latest?: boolean;
}

interface GuidedUpgradeOptions {
	dryRun?: boolean;
	manifest?: string;
	agent?: AgentTarget;
}

type RootUpgradeOptions = LegacyUpgradeOptions & GuidedUpgradeOptions;

export const upgradeCommand = new Command('upgrade')
	.description('Analyze and apply ContractSpec upgrades')
	.option('-a, --all', 'Legacy mode: upgrade everything (packages + config)')
	.option('-p, --packages', 'Legacy mode: upgrade SDK packages only')
	.option('-c, --config', 'Legacy mode: upgrade configuration only')
	.option('--dry-run', 'Preview changes without applying them')
	.option('--latest', 'Legacy mode: use @latest tag instead of caret range')
	.option('--manifest <paths>', 'Comma-separated upgrade manifest paths')
	.option('--agent <target>', 'Agent target for upgrade prompts', 'codex')
	.action(async (options: RootUpgradeOptions) => {
		if (options.all || options.packages || options.config || options.latest) {
			await runLegacyUpgrade(options);
			return;
		}

		await runGuidedUpgradeApply(options);
	});

upgradeCommand
	.command('analyze')
	.description('Analyze applicable release capsules and build an upgrade plan')
	.option('--dry-run', 'Preview the plan without applying anything')
	.option('--manifest <paths>', 'Comma-separated upgrade manifest paths')
	.option('--agent <target>', 'Agent target for prompt generation', 'codex')
	.action(runGuidedUpgradeAnalyze);

upgradeCommand
	.command('apply')
	.description('Apply deterministic upgrade autofixes from the upgrade plan')
	.option('--dry-run', 'Preview the guided upgrade without writing files')
	.option('--manifest <paths>', 'Comma-separated upgrade manifest paths')
	.option('--agent <target>', 'Agent target for prompt generation', 'codex')
	.action(runGuidedUpgradeApply);

upgradeCommand
	.command('prompt')
	.description('Print the agent upgrade prompt for unresolved upgrade work')
	.option('--manifest <paths>', 'Comma-separated upgrade manifest paths')
	.option('--agent <target>', 'Agent target for prompt generation', 'codex')
	.action(runGuidedUpgradePrompt);

async function runGuidedUpgradeAnalyze(
	options: GuidedUpgradeOptions
): Promise<void> {
	const result = await upgrade.analyzeGuidedUpgrade(
		{
			fs: createNodeFsAdapter(),
			logger: createConsoleLoggerAdapter(),
		},
		{
			workspaceRoot: process.cwd(),
			dryRun: options.dryRun,
			manifestPaths: splitCsv(options.manifest),
			agentTarget: options.agent,
		}
	);

	console.log(chalk.blue.bold('Upgrade analysis'));
	console.log(`  manifest: ${result.manifestPath ?? 'not found'}`);
	console.log(`  package manager: ${result.packageManager}`);
	console.log(
		`  targets: ${result.plan.targetPackages.map((pkg) => `${pkg.name}@${pkg.targetVersion ?? 'latest'}`).join(', ') || 'none'}`
	);
	console.log(`  auto steps: ${result.plan.autofixCount}`);
	console.log(`  assisted steps: ${result.plan.assistedCount}`);
	console.log(`  manual steps: ${result.plan.manualCount}`);

	if (result.humanChecklist.length > 0) {
		console.log('');
		console.log('Checklist:');
		for (const item of result.humanChecklist) {
			console.log(`- ${item}`);
		}
	}
}

async function runGuidedUpgradeApply(
	options: GuidedUpgradeOptions
): Promise<void> {
	const result = await upgrade.applyGuidedUpgrade(
		{
			fs: createNodeFsAdapter(),
			logger: createConsoleLoggerAdapter(),
		},
		{
			workspaceRoot: process.cwd(),
			dryRun: options.dryRun,
			manifestPaths: splitCsv(options.manifest),
			agentTarget: options.agent,
		}
	);

	console.log(chalk.green.bold(result.summary));

	if ((result.appliedAutofixes?.length ?? 0) > 0) {
		console.log('');
		console.log('Applied autofixes:');
		for (const fix of result.appliedAutofixes ?? []) {
			console.log(`- ${fix}`);
		}
	}

	if ((result.humanChecklist?.length ?? 0) > 0) {
		console.log('');
		console.log('Remaining checklist:');
		for (const item of result.humanChecklist ?? []) {
			console.log(`- ${item}`);
		}
	}
}

async function runGuidedUpgradePrompt(
	options: GuidedUpgradeOptions
): Promise<void> {
	const result = await upgrade.analyzeGuidedUpgrade(
		{
			fs: createNodeFsAdapter(),
			logger: createConsoleLoggerAdapter(),
		},
		{
			workspaceRoot: process.cwd(),
			manifestPaths: splitCsv(options.manifest),
			agentTarget: options.agent,
		}
	);
	const prompt =
		result.plan.agentPrompts.find((bundle) => bundle.agent === options.agent)
			?.prompt ?? result.plan.agentPrompts[0]?.prompt;

	if (!prompt) {
		console.log(chalk.yellow('No agent prompt could be generated.'));
		return;
	}

	console.log(prompt);
}

async function runLegacyUpgrade(options: LegacyUpgradeOptions): Promise<void> {
	const spinner = ora('Analyzing workspace...').start();
	const fs = createNodeFsAdapter();
	const logger = createConsoleLoggerAdapter();
	const workspaceRoot = process.cwd();

	try {
		const analysis = await upgrade.analyzeUpgrades(
			{ fs, logger },
			{ workspaceRoot }
		);

		spinner.succeed(`Detected ${analysis.packageManager} workspace`);

		let upgradePackages = options.packages ?? false;
		let upgradeConfig = options.config ?? false;

		if (options.all) {
			upgradePackages = true;
			upgradeConfig = true;
		}

		if (!upgradePackages && !upgradeConfig) {
			const choice = await select({
				message: 'What would you like to upgrade?',
				choices: [
					{ value: 'all', name: 'Everything (packages + config)' },
					{ value: 'packages', name: 'SDK packages only' },
					{ value: 'config', name: 'Configuration only' },
				],
			});

			upgradePackages = choice === 'all' || choice === 'packages';
			upgradeConfig = choice === 'all' || choice === 'config';
		}

		if (upgradePackages && analysis.packages.length > 0) {
			await runLegacyPackageUpgrade(analysis, options);
		} else if (upgradePackages) {
			console.log(chalk.yellow('\n  No ContractSpec packages found'));
		}

		if (upgradeConfig) {
			const configResult = await upgrade.applyConfigUpgrades(
				{ fs, logger },
				{ workspaceRoot, dryRun: options.dryRun }
			);

			console.log('');
			console.log(chalk.blue.bold('⚙️  Configuration upgrade:'));
			console.log(`  ${configResult.summary}`);
		}

		console.log('');
		console.log(chalk.green.bold('✓ Upgrade complete!'));

		if (options.dryRun) {
			console.log(chalk.yellow('  (dry run - no changes were made)'));
		}
	} catch (error) {
		spinner.fail('Upgrade failed');
		console.error(
			chalk.red('\n❌ Error:'),
			error instanceof Error ? error.message : String(error)
		);
		process.exit(1);
	}
}

async function runLegacyPackageUpgrade(
	analysis: upgrade.UpgradeAnalysisResult,
	options: LegacyUpgradeOptions
): Promise<void> {
	console.log('');
	console.log(chalk.blue.bold('📦 SDK packages:'));

	console.log(`  Found ${analysis.packages.length} ContractSpec package(s):`);
	for (const pkg of analysis.packages) {
		console.log(chalk.gray(`    - ${pkg.name}@${pkg.currentVersion}`));
	}

	if (options.dryRun) {
		console.log(chalk.yellow('  Would upgrade to latest versions'));
		return;
	}

	const shouldProceed = await confirm({
		message: 'Upgrade these packages to latest versions?',
		default: true,
	});

	if (!shouldProceed) {
		console.log(chalk.gray('  Skipped package upgrade'));
		return;
	}

	const updateCmd = upgrade.getPackageUpgradeCommand(
		analysis.packageManager,
		analysis.packages,
		options.latest ?? false
	);

	console.log(chalk.gray(`  Running: ${updateCmd}`));

	try {
		execSync(updateCmd, {
			cwd: process.cwd(),
			stdio: 'inherit',
		});
		console.log(chalk.green('  ✓ Packages upgraded'));
	} catch {
		console.log(chalk.red('  ✗ Failed to upgrade packages'));
	}
}

function splitCsv(value: string | undefined): string[] | undefined {
	if (!value) {
		return undefined;
	}

	return value
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}
