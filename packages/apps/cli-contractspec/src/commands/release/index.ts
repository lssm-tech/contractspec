import {
	createConsoleLoggerAdapter,
	createNodeFsAdapter,
	createNodeGitAdapter,
	versioning,
} from '@contractspec/bundle.workspace';
import type {
	AgentTarget,
	VersionBumpType,
} from '@contractspec/lib.contracts-spec';
import chalk from 'chalk';
import { Command } from 'commander';

interface ReleaseInitCliOptions {
	baseline?: string;
	slug?: string;
	summary?: string;
	packages?: string;
	patch?: boolean;
	minor?: boolean;
	major?: boolean;
	dryRun?: boolean;
	force?: boolean;
}

interface ReleaseBuildCliOptions {
	output?: string;
	dryRun?: boolean;
}

interface ReleaseCheckCliOptions {
	baseline?: string;
	output?: string;
	strict?: boolean;
}

interface ReleaseBriefCliOptions {
	slug?: string;
	agent?: AgentTarget;
}

export function createReleaseCommand(): Command {
	const command = new Command('release').description(
		'Scaffold, validate, and build release communication artifacts'
	);

	command
		.command('init')
		.description('Create a changeset and companion release capsule')
		.option('-b, --baseline <ref>', 'Git ref to compare against', 'main')
		.option('-s, --slug <slug>', 'Explicit changeset slug')
		.option('--summary <summary>', 'Release summary for the changeset')
		.option('--packages <names>', 'Comma-separated package names')
		.option('--patch', 'Force a patch release')
		.option('--minor', 'Force a minor release')
		.option('--major', 'Force a major release')
		.option('--dry-run', 'Preview files without writing them')
		.option('--force', 'Overwrite an existing slug')
		.action(runReleaseInit);

	command
		.command('build')
		.description('Build generated release artifacts in generated/releases')
		.option('-o, --output <dir>', 'Output directory', 'generated/releases')
		.option('--dry-run', 'Preview output without writing files')
		.action(runReleaseBuild);

	command
		.command('check')
		.description('Validate release communication completeness')
		.option('-b, --baseline <ref>', 'Git ref to compare against', 'main')
		.option(
			'-o, --output <dir>',
			'Artifact output directory',
			'generated/releases'
		)
		.option('--strict', 'Fail on missing generated artifacts')
		.action(runReleaseCheck);

	command
		.command('brief')
		.description(
			'Emit maintainer, customer, migration, and agent upgrade views'
		)
		.option('-s, --slug <slug>', 'Specific release slug to render')
		.option('--agent <target>', 'Agent target for the upgrade prompt', 'codex')
		.action(runReleaseBrief);

	return command;
}

async function runReleaseInit(options: ReleaseInitCliOptions): Promise<void> {
	const result = await versioning.initReleaseArtifacts(
		{
			fs: createNodeFsAdapter(),
			git: createNodeGitAdapter(),
			logger: createConsoleLoggerAdapter(),
		},
		{
			baseline: options.baseline,
			slug: options.slug,
			summary: options.summary,
			packages: splitCsv(options.packages),
			releaseType: resolveReleaseType(options),
			dryRun: options.dryRun,
			force: options.force,
		}
	);

	console.log(chalk.blue.bold('Release init'));
	console.log(`  slug: ${result.slug}`);
	console.log(`  changeset: ${result.changesetPath}`);
	console.log(`  capsule: ${result.capsulePath}`);
	console.log(`  type: ${result.releaseType}`);
	console.log(
		`  packages: ${result.packages.map((pkg) => pkg.name).join(', ') || 'none'}`
	);
}

async function runReleaseBuild(options: ReleaseBuildCliOptions): Promise<void> {
	const result = await versioning.buildReleaseArtifacts(
		{
			fs: createNodeFsAdapter(),
			git: createNodeGitAdapter(),
			logger: createConsoleLoggerAdapter(),
		},
		{
			outputDir: options.output,
			dryRun: options.dryRun,
		}
	);

	console.log(chalk.blue.bold('Release build'));
	console.log(`  releases: ${result.releasesBuilt}`);
	console.log(`  manifest: ${result.manifestPath}`);
	console.log(`  upgrade manifest: ${result.upgradeManifestPath}`);
	console.log(`  patch notes: ${result.patchNotesPath}`);
	console.log(`  customer guide: ${result.customerGuidePath}`);
}

async function runReleaseCheck(options: ReleaseCheckCliOptions): Promise<void> {
	const result = await versioning.checkReleaseArtifacts(
		{
			fs: createNodeFsAdapter(),
			git: createNodeGitAdapter(),
			logger: createConsoleLoggerAdapter(),
		},
		{
			baseline: options.baseline,
			outputDir: options.output,
			strict: options.strict,
		}
	);

	for (const check of result.checks) {
		console.log(
			`- ${check.name}: ${check.ok ? 'pass' : 'fail'} (${check.message})`
		);
	}

	for (const warning of result.warnings) {
		console.log(chalk.yellow(`warning: ${warning}`));
	}

	if (!result.success) {
		for (const error of result.errors) {
			console.log(chalk.red(`error: ${error}`));
		}
		process.exit(1);
	}
}

async function runReleaseBrief(options: ReleaseBriefCliOptions): Promise<void> {
	const result = await versioning.buildReleaseArtifacts(
		{
			fs: createNodeFsAdapter(),
			git: createNodeGitAdapter(),
			logger: createConsoleLoggerAdapter(),
		},
		{ dryRun: true }
	);
	const entry = options.slug
		? result.manifest.releases.find((release) => release.slug === options.slug)
		: result.manifest.releases[0];

	if (!entry) {
		console.log(chalk.yellow('No release capsule was found to summarize.'));
		return;
	}

	const prompt =
		result.upgradePlan.agentPrompts.find(
			(bundle) => bundle.agent === options.agent
		)?.prompt ??
		versioning.renderUpgradePrompt(
			options.agent ?? 'codex',
			result.upgradePlan
		);

	console.log('## Maintainer Summary');
	console.log(versioning.renderMaintainerSummary(entry));
	console.log('');
	console.log('## Customer Patch Note');
	console.log(versioning.renderCustomerPatchNote(entry));
	console.log('');
	console.log('## Migration Guide');
	console.log(versioning.renderMigrationGuide(entry));
	console.log('');
	console.log('## Agent Upgrade Prompt');
	console.log(prompt);
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

function resolveReleaseType(
	options: ReleaseInitCliOptions
): VersionBumpType | undefined {
	if (options.major) {
		return 'major';
	}
	if (options.minor) {
		return 'minor';
	}
	if (options.patch) {
		return 'patch';
	}
	return undefined;
}
