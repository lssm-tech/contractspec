import {
	type ReleaseCapsule,
	type ReleaseImpactAudience,
	type VersionBumpType,
} from '@contractspec/lib.contracts-spec';
import { z } from 'zod';
import { findWorkspaceRoot } from '../../adapters/workspace';
import type { AiAdapter } from '../../ports/ai';
import type { FsAdapter } from '../../ports/fs';
import type { GitAdapter } from '../../ports/git';
import type { LoggerAdapter } from '../../ports/logger';
import { detectImpact } from '../impact';
import {
	discoverWorkspacePackages,
	formatReleaseCapsuleReadIssues,
	matchChangedFilesToPackages,
	readChangesets,
	readReleaseCapsulesDetailed,
	renderChangesetMarkdown,
	renderReleaseCapsuleYaml,
} from './release-files';
import type {
	ReleaseAuthoringDraft,
	ReleaseAuthoringOptions,
	ReleaseAuthoringResult,
	SaveReleaseDraftOptions,
	SaveReleaseDraftResult,
} from './release-service.types';
import { analyzeVersionsFromCommits } from './versioning-service';

interface ReleaseAuthoringAdapters {
	fs: FsAdapter;
	git: GitAdapter;
	logger: LoggerAdapter;
	ai?: AiAdapter;
}

const ReleaseSuggestionsSchema = z.object({
	summary: z.string(),
	maintainerSummary: z.string(),
	customerSummary: z.string(),
	integratorSummary: z.string(),
	deprecations: z.array(z.string()).default([]),
	migrationInstructions: z
		.array(
			z.object({
				id: z.string(),
				title: z.string(),
				summary: z.string(),
				required: z.boolean().default(false),
				when: z.string().optional(),
				steps: z.array(z.string()).default([]),
			})
		)
		.default([]),
	upgradeSteps: z
		.array(
			z.object({
				id: z.string(),
				title: z.string(),
				summary: z.string(),
				level: z.enum(['auto', 'assisted', 'manual']).default('manual'),
				instructions: z.array(z.string()).default([]),
			})
		)
		.default([]),
	validationCommands: z.array(z.string()).default([]),
	validationEvidence: z.array(z.string()).default([]),
});

export async function prepareReleaseAuthoring(
	adapters: ReleaseAuthoringAdapters,
	options: ReleaseAuthoringOptions = {}
): Promise<ReleaseAuthoringResult> {
	const { fs, git, logger, ai } = adapters;
	const workspaceRoot = findWorkspaceRoot(options.workspaceRoot);
	const workspacePackages = await discoverWorkspacePackages(fs, workspaceRoot);
	const changedFiles = options.baseline
		? await git.diffFiles(options.baseline)
		: [];
	const changesets = await readChangesets(fs, workspaceRoot);
	const capsuleResult = await readReleaseCapsulesDetailed(
		fs,
		workspaceRoot,
		changesets
	);
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
	const selectedSlug =
		options.slug ??
		selectExistingSlug(changesets, capsuleResult.capsules, packageNames);
	const selectedChangesetPath = selectedSlug
		? fs.join(workspaceRoot, '.changeset', `${selectedSlug}.md`)
		: undefined;
	const selectedCapsulePath = selectedSlug
		? fs.join(workspaceRoot, '.changeset', `${selectedSlug}.release.yaml`)
		: undefined;
	const existingChangeset = selectedSlug
		? changesets.find((changeset) => changeset.slug === selectedSlug)
		: undefined;
	const existingCapsule = selectedSlug
		? capsuleResult.capsules.get(selectedSlug)
		: undefined;
	const releaseType =
		options.releaseType ??
		existingCapsule?.packages[0]?.releaseType ??
		existingChangeset?.packages[0]?.releaseType ??
		((impact?.summary.breaking ?? 0) > 0
			? 'major'
			: (commitAnalysis?.suggestedBumpType ?? inferReleaseType(packageNames)));
	const hasExistingArtifacts =
		(selectedChangesetPath ? await fs.exists(selectedChangesetPath) : false) ||
		(selectedCapsulePath ? await fs.exists(selectedCapsulePath) : false);
	const draft = await suggestReleaseDraft(
		ai,
		buildDraft({
			existingCapsule,
			existingChangeset,
			packageNames,
			releaseType,
			summary: options.summary,
			workspacePackages,
			isBreaking:
				releaseType === 'major' || (impact?.summary.breaking ?? 0) > 0,
			selectedSlug,
		}),
		{
			changedFiles,
			commitMessages: options.baseline
				? (await git.log(options.baseline)).map((entry) => entry.message)
				: [],
			parseIssues: capsuleResult.issues.map((issue) => issue.message),
		},
		logger
	);

	return {
		workspaceRoot,
		source: hasExistingArtifacts ? 'existing' : 'created',
		changesetPath:
			selectedChangesetPath ??
			fs.join(workspaceRoot, '.changeset', `${draft.slug}.md`),
		capsulePath:
			selectedCapsulePath ??
			fs.join(workspaceRoot, '.changeset', `${draft.slug}.release.yaml`),
		draft,
		warnings: capsuleResult.issues.length
			? [
					`Some release capsules could not be parsed. ${formatReleaseCapsuleReadIssues(capsuleResult.issues)}`,
				]
			: [],
		parseIssues: capsuleResult.issues,
		aiAssisted: ai !== undefined,
	};
}

export async function saveReleaseDraft(
	adapters: ReleaseAuthoringAdapters,
	options: SaveReleaseDraftOptions
): Promise<SaveReleaseDraftResult> {
	const { fs } = adapters;
	const workspaceRoot = findWorkspaceRoot(options.workspaceRoot);
	const draft = normalizeDraft(options.draft);
	const changesetPath = fs.join(
		workspaceRoot,
		'.changeset',
		`${draft.slug}.md`
	);
	const capsulePath = fs.join(
		workspaceRoot,
		'.changeset',
		`${draft.slug}.release.yaml`
	);
	const source =
		(await fs.exists(changesetPath)) || (await fs.exists(capsulePath))
			? 'updated'
			: 'created';
	const changesetContent = renderChangesetMarkdown(
		draft.summary,
		draft.packages
	);
	const capsuleContent = renderReleaseCapsuleYaml(draftToCapsule(draft));

	await fs.writeFile(changesetPath, changesetContent);
	await fs.writeFile(capsulePath, capsuleContent);

	return {
		source,
		changesetPath,
		capsulePath,
		changesetContent,
		capsuleContent,
	};
}

function buildDraft(input: {
	existingCapsule?: ReleaseCapsule;
	existingChangeset?: Awaited<ReturnType<typeof readChangesets>>[number];
	packageNames: string[];
	releaseType: VersionBumpType;
	summary?: string;
	workspacePackages: Array<{ name: string; version: string }>;
	isBreaking: boolean;
	selectedSlug?: string;
}): ReleaseAuthoringDraft {
	if (input.existingCapsule) {
		return normalizeDraft({
			...input.existingCapsule,
			releaseType: input.releaseType,
		});
	}

	const packages = input.existingChangeset?.packages.length
		? input.existingChangeset.packages.map((pkg) => ({
				...pkg,
				version:
					input.workspacePackages.find((entry) => entry.name === pkg.name)
						?.version ?? pkg.version,
			}))
		: input.packageNames.map((name) => ({
				name,
				releaseType: input.releaseType,
				version: input.workspacePackages.find((entry) => entry.name === name)
					?.version,
			}));
	const summary =
		input.summary ??
		input.existingChangeset?.summary ??
		`Describe the ${input.releaseType} release for ${packages[0]?.name ?? 'the workspace'}`;

	return normalizeDraft({
		slug: input.selectedSlug ?? slugify(summary),
		summary,
		releaseType: input.releaseType,
		isBreaking: input.isBreaking,
		packages,
		affectedRuntimes: [],
		affectedFrameworks: [],
		audiences: buildDefaultAudiences(summary),
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
	});
}

async function suggestReleaseDraft(
	ai: AiAdapter | undefined,
	draft: ReleaseAuthoringDraft,
	context: {
		changedFiles: string[];
		commitMessages: string[];
		parseIssues: string[];
	},
	logger: LoggerAdapter
): Promise<ReleaseAuthoringDraft> {
	if (!ai) {
		return draft;
	}

	try {
		const result = await ai.generateStructured<
			z.infer<typeof ReleaseSuggestionsSchema>
		>({
			schema: ReleaseSuggestionsSchema,
			systemPrompt:
				'You write structured release metadata for a TypeScript monorepo. Be concise, concrete, and safe for public release notes.',
			prompt: JSON.stringify({
				draft,
				changedFiles: context.changedFiles.slice(0, 40),
				commitMessages: context.commitMessages.slice(0, 20),
				parseIssues: context.parseIssues,
			}),
		});
		return mergeSuggestions(draft, result.object);
	} catch (error) {
		logger.warn(
			'Release AI suggestions unavailable, falling back to heuristics.',
			{
				error: error instanceof Error ? error.message : String(error),
			}
		);
		return draft;
	}
}

function mergeSuggestions(
	draft: ReleaseAuthoringDraft,
	suggestions: z.infer<typeof ReleaseSuggestionsSchema>
): ReleaseAuthoringDraft {
	const audiences = [...draft.audiences];
	replaceAudience(audiences, 'maintainer', suggestions.maintainerSummary);
	replaceAudience(audiences, 'customer', suggestions.customerSummary);
	replaceAudience(audiences, 'integrator', suggestions.integratorSummary);

	return normalizeDraft({
		...draft,
		summary: isPlaceholderSummary(draft.summary)
			? suggestions.summary
			: draft.summary,
		audiences,
		deprecations: draft.deprecations.length
			? draft.deprecations
			: suggestions.deprecations,
		migrationInstructions: draft.migrationInstructions.length
			? draft.migrationInstructions
			: suggestions.migrationInstructions,
		upgradeSteps: draft.upgradeSteps.length
			? draft.upgradeSteps
			: suggestions.upgradeSteps,
		validation: {
			commands: draft.validation.commands.length
				? draft.validation.commands
				: suggestions.validationCommands,
			evidence: draft.validation.evidence.length
				? draft.validation.evidence
				: suggestions.validationEvidence,
		},
	});
}

function normalizeDraft(draft: ReleaseAuthoringDraft): ReleaseAuthoringDraft {
	return {
		...draft,
		packages: draft.packages.map((pkg) => ({
			...pkg,
			releaseType: draft.releaseType,
		})),
		isBreaking: draft.isBreaking || draft.releaseType === 'major',
		affectedRuntimes: [...draft.affectedRuntimes],
		affectedFrameworks: [...draft.affectedFrameworks],
		audiences: draft.audiences.length
			? draft.audiences
			: buildDefaultAudiences(draft.summary),
		validation: {
			commands: [...draft.validation.commands],
			evidence: [...draft.validation.evidence],
		},
	};
}

function draftToCapsule(draft: ReleaseAuthoringDraft): ReleaseCapsule {
	const { releaseType: _releaseType, ...capsule } = normalizeDraft(draft);
	return { schemaVersion: '1', ...capsule };
}

function buildDefaultAudiences(summary: string): ReleaseImpactAudience[] {
	return [
		{ kind: 'maintainer', summary },
		{ kind: 'customer', summary },
		{
			kind: 'integrator',
			summary: `Upgrade affected packages and review the release guidance for: ${summary}`,
		},
	];
}

function replaceAudience(
	audiences: ReleaseImpactAudience[],
	kind: ReleaseImpactAudience['kind'],
	summary: string
): void {
	const existing = audiences.find((audience) => audience.kind === kind);
	if (existing && !isPlaceholderSummary(existing.summary)) {
		return;
	}
	if (existing) {
		existing.summary = summary;
		return;
	}
	audiences.push({ kind, summary });
}

function selectExistingSlug(
	changesets: Awaited<ReturnType<typeof readChangesets>>,
	capsules: Map<string, ReleaseCapsule>,
	packageNames: string[]
): string | undefined {
	const candidates = new Set(
		[
			...changesets.map((changeset) => changeset.slug),
			...capsules.keys(),
		].filter((slug) => slug !== 'auto-dependent-bumps')
	);
	if (candidates.size === 1) {
		return Array.from(candidates)[0];
	}

	if (packageNames.length === 0) {
		return undefined;
	}

	const matching = Array.from(candidates).filter((slug) => {
		const capsule = capsules.get(slug);
		const changeset = changesets.find((entry) => entry.slug === slug);
		const candidatePackages =
			capsule?.packages.map((pkg) => pkg.name) ??
			changeset?.packages.map((pkg) => pkg.name) ??
			[];
		return candidatePackages.some((name) => packageNames.includes(name));
	});

	return matching.length === 1 ? matching[0] : undefined;
}

function inferReleaseType(packageNames: string[]): VersionBumpType {
	return packageNames.length > 0 ? 'minor' : 'patch';
}

function isPlaceholderSummary(summary: string): boolean {
	return summary.trim().startsWith('Describe the ');
}

function slugify(value: string): string {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);
}
