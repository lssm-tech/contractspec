import {
	type GeneratedReleaseManifest,
	GeneratedReleaseManifestSchema,
	type ReleaseCapsule,
	type ReleaseCapsulePackage,
	type VersionBumpType,
} from '@contractspec/lib.contracts-spec';
import {
	ContractsrcSchema,
	DEFAULT_CONTRACTSRC,
} from '@contractspec/lib.contracts-spec/workspace-config/contractsrc-schema';
import { findWorkspaceRoot } from '../../adapters/workspace';
import type { FsAdapter } from '../../ports/fs';
import type { GitAdapter } from '../../ports/git';
import type { LoggerAdapter } from '../../ports/logger';
import { detectImpact } from '../impact';
import {
	discoverWorkspacePackages,
	matchChangedFilesToPackages,
	readChangesets,
	readReleaseCapsules,
	renderChangesetMarkdown,
	renderReleaseCapsuleYaml,
} from './release-files';
import {
	renderCustomerGuide,
	renderPatchNotes,
	renderUpgradePrompt,
} from './release-formatters';
import { createUpgradePlan } from './release-plan';
import type {
	ReleaseBuildOptions,
	ReleaseBuildResult,
	ReleaseCheckOptions,
	ReleaseCheckResult,
	ReleaseCheckStatus,
	ReleaseInitOptions,
	ReleaseInitResult,
} from './release-service.types';
import {
	analyzeVersions,
	analyzeVersionsFromCommits,
} from './versioning-service';

interface ServiceAdapters {
	fs: FsAdapter;
	git: GitAdapter;
	logger: LoggerAdapter;
}

const DEFAULT_OUTPUT_DIR = 'generated/releases';
const DEFAULT_RELEASE_CONFIG = DEFAULT_CONTRACTSRC.release ?? {
	enforceOn: 'release-branch',
	requireChangesetForPublished: true,
	requireReleaseCapsule: true,
	publishArtifacts: [],
	agentTargets: ['codex'],
};

export async function initReleaseArtifacts(
	adapters: ServiceAdapters,
	options: ReleaseInitOptions = {}
): Promise<ReleaseInitResult> {
	const { fs, git, logger } = adapters;
	const workspaceRoot = findWorkspaceRoot(options.workspaceRoot);
	const workspacePackages = await discoverWorkspacePackages(fs, workspaceRoot);
	const changedFiles = options.baseline
		? await git.diffFiles(options.baseline)
		: [];
	const packageNames =
		options.packages && options.packages.length > 0
			? options.packages
			: matchChangedFilesToPackages(changedFiles, workspacePackages);
	const commitAnalysis = options.baseline
		? await analyzeVersionsFromCommits(adapters, {
				baseline: options.baseline,
				workspaceRoot,
			})
		: null;
	const impact = options.baseline
		? await detectImpact(adapters, {
				baseline: options.baseline,
				workspaceRoot,
			})
		: null;

	const inferredReleaseType =
		(impact?.summary.breaking ?? 0) > 0
			? 'major'
			: (commitAnalysis?.suggestedBumpType ?? inferReleaseType(packageNames));
	const releaseType = options.releaseType ?? inferredReleaseType;
	const summary =
		options.summary ??
		`Describe the ${releaseType} release for ${packageNames[0] ?? 'the workspace'}`;
	const slug = options.slug ?? slugify(summary);
	const packages: ReleaseCapsulePackage[] = packageNames.map((name) => ({
		name,
		releaseType,
		version: workspacePackages.find((pkg) => pkg.name === name)?.version,
	}));
	const capsule: ReleaseCapsule = {
		schemaVersion: '1',
		slug,
		summary,
		isBreaking: releaseType === 'major' || (impact?.summary.breaking ?? 0) > 0,
		packages,
		affectedRuntimes: [],
		affectedFrameworks: [],
		audiences: [
			{ kind: 'maintainer', summary },
			{ kind: 'customer', summary },
		],
		deprecations: [],
		migrationInstructions: [],
		upgradeSteps: [],
		validation: {
			commands: [
				'contractspec impact --baseline main --format markdown',
				'contractspec version analyze --baseline main',
			],
			evidence: [],
		},
	};

	const changesetPath = fs.join(workspaceRoot, '.changeset', `${slug}.md`);
	const capsulePath = fs.join(
		workspaceRoot,
		'.changeset',
		`${slug}.release.yaml`
	);

	if (!options.force) {
		if (await fs.exists(changesetPath)) {
			throw new Error(`Changeset already exists: ${changesetPath}`);
		}
		if (await fs.exists(capsulePath)) {
			throw new Error(`Release capsule already exists: ${capsulePath}`);
		}
	}

	const changesetContent = renderChangesetMarkdown(summary, packages);
	const capsuleContent = renderReleaseCapsuleYaml(capsule);

	if (!options.dryRun) {
		await fs.writeFile(changesetPath, changesetContent);
		await fs.writeFile(capsulePath, capsuleContent);
	}

	logger.info('Initialized release artifacts', { slug, workspaceRoot });

	return {
		slug,
		changesetPath,
		capsulePath,
		changesetContent,
		capsuleContent,
		packages,
		releaseType,
		isBreaking: capsule.isBreaking,
	};
}

export async function buildReleaseArtifacts(
	adapters: ServiceAdapters,
	options: ReleaseBuildOptions = {}
): Promise<ReleaseBuildResult> {
	const { fs, logger } = adapters;
	const workspaceRoot = findWorkspaceRoot(options.workspaceRoot);
	const config = await readWorkspaceReleaseConfig(fs, workspaceRoot);
	const outputDir = fs.join(
		workspaceRoot,
		options.outputDir ?? DEFAULT_OUTPUT_DIR
	);
	const changesets = await readChangesets(fs, workspaceRoot);
	const capsules = await readReleaseCapsules(fs, workspaceRoot, changesets);
	const workspacePackages = await discoverWorkspacePackages(fs, workspaceRoot);

	const releases = await Promise.all(
		Array.from(capsules.entries()).map(async ([slug, capsule]) => {
			const filePath = fs.join(
				workspaceRoot,
				'.changeset',
				`${slug}.release.yaml`
			);
			const stats = await fs.stat(filePath);
			return {
				slug,
				version: resolveReleaseVersion(capsule, workspacePackages),
				summary: capsule.summary,
				date:
					stats.mtime.toISOString().split('T')[0] ?? new Date().toISOString(),
				isBreaking: capsule.isBreaking,
				packages: capsule.packages.map((pkg) => ({
					...pkg,
					version:
						workspacePackages.find((candidate) => candidate.name === pkg.name)
							?.version ?? pkg.version,
				})),
				affectedRuntimes: [...capsule.affectedRuntimes],
				affectedFrameworks: [...capsule.affectedFrameworks],
				audiences: [...capsule.audiences],
				deprecations: [...capsule.deprecations],
				migrationInstructions: [...capsule.migrationInstructions],
				upgradeSteps: [...capsule.upgradeSteps],
				validation: capsule.validation,
			};
		})
	);

	const manifest = GeneratedReleaseManifestSchema.parse({
		generatedAt: new Date().toISOString(),
		releases,
	}) as GeneratedReleaseManifest;
	const agentTargets = options.agentTargets ?? config.agentTargets ?? ['codex'];
	const upgradePlan = createUpgradePlan(
		manifest,
		[],
		agentTargets,
		renderUpgradePrompt
	);
	const manifestPath = fs.join(outputDir, 'manifest.json');
	const upgradeManifestPath = fs.join(outputDir, 'upgrade-manifest.json');
	const patchNotesPath = fs.join(outputDir, 'patch-notes.md');
	const customerGuidePath = fs.join(outputDir, 'customer-guide.md');
	const promptPaths = Object.fromEntries(
		upgradePlan.agentPrompts.map((prompt) => [
			prompt.agent,
			fs.join(outputDir, 'prompts', `${prompt.agent}.md`),
		])
	);

	if (!options.dryRun) {
		await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
		await fs.writeFile(upgradeManifestPath, JSON.stringify(manifest, null, 2));
		await fs.writeFile(patchNotesPath, renderPatchNotes(manifest));
		await fs.writeFile(customerGuidePath, renderCustomerGuide(manifest));

		for (const prompt of upgradePlan.agentPrompts) {
			await fs.writeFile(promptPaths[prompt.agent] ?? '', prompt.prompt);
		}
	}

	logger.info('Built release artifacts', {
		outputDir,
		releasesBuilt: manifest.releases.length,
	});

	return {
		outputDir,
		manifestPath,
		upgradeManifestPath,
		patchNotesPath,
		customerGuidePath,
		promptPaths,
		manifest,
		upgradePlan,
		releasesBuilt: manifest.releases.length,
	};
}

export async function checkReleaseArtifacts(
	adapters: ServiceAdapters,
	options: ReleaseCheckOptions = {}
): Promise<ReleaseCheckResult> {
	const { fs } = adapters;
	const workspaceRoot = findWorkspaceRoot(options.workspaceRoot);
	const config = await readWorkspaceReleaseConfig(fs, workspaceRoot);
	const outputDir = fs.join(
		workspaceRoot,
		options.outputDir ?? DEFAULT_OUTPUT_DIR
	);
	const checks: ReleaseCheckStatus[] = [];
	const warnings: string[] = [];
	const errors: string[] = [];
	const changesets = await readChangesets(fs, workspaceRoot);
	const capsules = await readReleaseCapsules(fs, workspaceRoot, changesets);

	recordCheck(
		checks,
		changesets.length > 0,
		'changesets',
		changesets.length > 0
			? `Found ${changesets.length} release changeset(s).`
			: 'No release changesets found.'
	);

	for (const changeset of changesets) {
		if (!capsules.has(changeset.slug) && config.requireReleaseCapsule) {
			errors.push(`Missing release capsule for changeset ${changeset.slug}.`);
		}
	}

	for (const [slug, capsule] of capsules) {
		if (capsule.isBreaking && capsule.migrationInstructions.length === 0) {
			errors.push(
				`Breaking release ${slug} is missing migration instructions.`
			);
		}
		if (capsule.validation.commands.length === 0) {
			errors.push(`Release capsule ${slug} is missing validation commands.`);
		}
		if (capsule.validation.evidence.length === 0) {
			errors.push(`Release capsule ${slug} is missing validation evidence.`);
		}
	}

	if (options.baseline) {
		try {
			const impact = await detectImpact(adapters, {
				baseline: options.baseline,
				workspaceRoot,
			});
			recordCheck(checks, true, 'impact', `Impact status: ${impact.status}`);
			if (
				impact.summary.breaking > 0 &&
				!Array.from(capsules.values()).some((capsule) => capsule.isBreaking)
			) {
				errors.push(
					'Breaking impact detected without a breaking release capsule.'
				);
			}
		} catch (error) {
			recordCheck(checks, false, 'impact', failureMessage(error));
			errors.push(`Impact detection failed: ${failureMessage(error)}`);
		}

		try {
			const analysis = await analyzeVersions(adapters, {
				baseline: options.baseline,
				workspaceRoot,
			});
			recordCheck(
				checks,
				true,
				'versioning',
				`${analysis.specsNeedingBump} spec(s) need version review.`
			);
		} catch (error) {
			recordCheck(checks, false, 'versioning', failureMessage(error));
			errors.push(`Version analysis failed: ${failureMessage(error)}`);
		}
	}

	if (options.strict) {
		for (const artifact of config.publishArtifacts ?? []) {
			const artifactPath = fs.join(outputDir, artifact);
			if (!(await fs.exists(artifactPath))) {
				errors.push(`Missing generated release artifact: ${artifactPath}`);
			}
		}
	}

	recordCheck(
		checks,
		errors.length === 0,
		'capsules',
		errors.length === 0
			? 'All release capsules are complete.'
			: (errors[0] ?? '')
	);

	if (changesets.length === 0) {
		warnings.push('No pending release changesets were found.');
	}

	return {
		success: errors.length === 0,
		errors,
		warnings,
		checks,
	};
}

async function readWorkspaceReleaseConfig(
	fs: FsAdapter,
	workspaceRoot: string
): Promise<typeof DEFAULT_RELEASE_CONFIG> {
	const configPath = fs.join(workspaceRoot, '.contractsrc.json');
	if (!(await fs.exists(configPath))) {
		return DEFAULT_RELEASE_CONFIG;
	}

	try {
		const parsed = JSON.parse(await fs.readFile(configPath));
		const validated = ContractsrcSchema.safeParse(parsed);
		return validated.success
			? {
					...DEFAULT_RELEASE_CONFIG,
					...validated.data.release,
				}
			: DEFAULT_RELEASE_CONFIG;
	} catch {
		return DEFAULT_RELEASE_CONFIG;
	}
}

function inferReleaseType(packageNames: string[]): VersionBumpType {
	return packageNames.length > 0 ? 'minor' : 'patch';
}

function resolveReleaseVersion(
	capsule: ReleaseCapsule,
	workspacePackages: Array<{ name: string; version: string }>
): string {
	const version = capsule.packages
		.map(
			(pkg) =>
				workspacePackages.find((candidate) => candidate.name === pkg.name)
					?.version ?? pkg.version
		)
		.find((value): value is string => typeof value === 'string');

	return version ?? '0.0.0';
}

function slugify(value: string): string {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 48);
}

function recordCheck(
	checks: ReleaseCheckStatus[],
	ok: boolean,
	name: string,
	message: string
): void {
	checks.push({ name, ok, message });
}

function failureMessage(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}
