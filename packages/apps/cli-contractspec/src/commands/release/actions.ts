import {
	createConsoleLoggerAdapter,
	createNodeAiAdapter,
	createNodeFsAdapter,
	createNodeGitAdapter,
	versioning,
} from '@contractspec/bundle.workspace';
import type {
	AgentTarget,
	VersionBumpType,
} from '@contractspec/lib.contracts-spec';
import chalk from 'chalk';
import { loadConfig, mergeConfig } from '../../utils/config';
import { promptForReleaseDraft } from './authoring';

type ReleaseBuildScope = 'current' | 'all';

export interface ReleaseAuthoringCliOptions {
	baseline?: string;
	slug?: string;
	summary?: string;
	packages?: string;
	patch?: boolean;
	minor?: boolean;
	major?: boolean;
	provider?: string;
	model?: string;
}

export interface ReleaseBuildCliOptions {
	output?: string;
	dryRun?: boolean;
	scope?: ReleaseBuildScope;
	baseline?: string;
}

export interface ReleaseCheckCliOptions {
	baseline?: string;
	output?: string;
	strict?: boolean;
	scope?: ReleaseBuildScope;
}

export interface ReleaseBriefCliOptions {
	slug?: string;
	agent?: AgentTarget;
}

export async function runReleasePrepare(
	options: ReleaseAuthoringCliOptions
): Promise<void> {
	await runReleaseAuthoring(options);
}

export async function runReleaseEdit(
	slug: string,
	options: ReleaseAuthoringCliOptions
): Promise<void> {
	await runReleaseAuthoring({ ...options, slug });
}

export async function runReleaseInit(
	options: ReleaseAuthoringCliOptions
): Promise<void> {
	const result = await versioning.initReleaseArtifacts(baseAdapters(), {
		baseline: options.baseline,
		slug: options.slug,
		summary: options.summary,
		packages: splitCsv(options.packages),
		releaseType: resolveReleaseType(options),
	});

	console.log(chalk.blue.bold('Release init'));
	console.log(`  slug: ${result.slug}`);
	console.log(`  changeset: ${result.changesetPath}`);
	console.log(`  capsule: ${result.capsulePath}`);
}

export async function runReleaseBuild(
	options: ReleaseBuildCliOptions
): Promise<void> {
	const result = await versioning.buildReleaseArtifacts(baseAdapters(), {
		baseline: options.baseline,
		outputDir: options.output,
		dryRun: options.dryRun,
		scope: options.scope,
	});

	console.log(chalk.blue.bold('Release build'));
	console.log(`  releases: ${result.releasesBuilt}`);
	console.log(`  manifest: ${result.manifestPath}`);
	console.log(`  upgrade manifest: ${result.upgradeManifestPath}`);
	console.log(`  patch notes: ${result.patchNotesPath}`);
	console.log(`  customer guide: ${result.customerGuidePath}`);
}

export async function runReleaseCheck(
	options: ReleaseCheckCliOptions
): Promise<void> {
	const result = await versioning.checkReleaseArtifacts(baseAdapters(), {
		baseline: options.baseline,
		outputDir: options.output,
		strict: options.strict,
		scope: options.scope,
	});

	printCheckResult(result);
	if (!result.success) {
		process.exit(1);
	}
}

export async function runReleaseBrief(
	options: ReleaseBriefCliOptions
): Promise<void> {
	const result = await versioning.buildReleaseArtifacts(baseAdapters(), {
		dryRun: true,
	});
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
	console.log('\n## Customer Patch Note');
	console.log(versioning.renderCustomerPatchNote(entry));
	console.log('\n## Migration Guide');
	console.log(versioning.renderMigrationGuide(entry));
	console.log('\n## Agent Upgrade Prompt');
	console.log(prompt);
}

export async function withReleaseErrorHandling(
	work: () => Promise<void>
): Promise<void> {
	try {
		await work();
	} catch (error) {
		console.error(
			chalk.red('\n❌ Release command failed:'),
			error instanceof Error ? error.message : String(error)
		);
		process.exit(1);
	}
}

async function runReleaseAuthoring(
	options: ReleaseAuthoringCliOptions
): Promise<void> {
	const ai = await resolveReleaseAiAdapter(options);
	const adapters = { ...baseAdapters(), ...(ai ? { ai } : {}) };
	const session = await versioning.prepareReleaseAuthoring(adapters, {
		baseline: options.baseline,
		slug: options.slug,
		summary: options.summary,
		packages: splitCsv(options.packages),
		releaseType: resolveReleaseType(options),
	});

	if (
		options.slug &&
		session.source === 'created' &&
		!(await createNodeFsAdapter().exists(session.changesetPath)) &&
		!(await createNodeFsAdapter().exists(session.capsulePath))
	) {
		throw new Error(`No release artifact exists for slug "${options.slug}".`);
	}

	for (const warning of session.warnings) {
		console.log(chalk.yellow(`warning: ${warning}`));
	}

	const draft = await promptForReleaseDraft(session.draft);
	const saved = await versioning.saveReleaseDraft(adapters, { draft });
	console.log(
		chalk.blue.bold(
			`Release ${saved.source === 'created' ? 'prepared' : 'updated'}`
		)
	);
	console.log(`  changeset: ${saved.changesetPath}`);
	console.log(`  capsule: ${saved.capsulePath}`);

	await versioning.buildReleaseArtifacts(adapters, {});
	const checkResult = await versioning.checkReleaseArtifacts(adapters, {
		baseline: options.baseline ?? 'main',
		strict: true,
	});
	printCheckResult(checkResult);
	if (!checkResult.success) {
		process.exit(1);
	}
}

function baseAdapters() {
	return {
		fs: createNodeFsAdapter(),
		git: createNodeGitAdapter(),
		logger: createConsoleLoggerAdapter(),
	};
}

async function resolveReleaseAiAdapter(options: ReleaseAuthoringCliOptions) {
	const config = mergeConfig(await loadConfig(process.cwd()), {
		provider: options.provider,
		model: options.model,
	});
	const adapter = createNodeAiAdapter(config);
	const validation = await adapter.validateProvider(config);
	if (!validation.success) {
		console.log(
			chalk.yellow(
				`warning: Release AI suggestions unavailable (${validation.error ?? 'provider validation failed'}).`
			)
		);
		return undefined;
	}
	return adapter;
}

function printCheckResult(
	result: Awaited<ReturnType<typeof versioning.checkReleaseArtifacts>>
) {
	for (const check of result.checks) {
		console.log(
			`- ${check.name}: ${check.ok ? 'pass' : 'fail'} (${check.message})`
		);
	}
	for (const warning of result.warnings) {
		console.log(chalk.yellow(`warning: ${warning}`));
	}
	for (const error of result.errors) {
		console.log(chalk.red(`error: ${error}`));
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

function resolveReleaseType(
	options: ReleaseAuthoringCliOptions
): VersionBumpType | undefined {
	if (options.major) return 'major';
	if (options.minor) return 'minor';
	if (options.patch) return 'patch';
	return undefined;
}
