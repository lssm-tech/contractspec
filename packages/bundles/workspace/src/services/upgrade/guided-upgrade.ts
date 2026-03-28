import {
	GeneratedReleaseManifestSchema,
	type AgentTarget,
	type GeneratedReleaseManifest,
	type UpgradeAutofix,
	type UpgradePlanStep,
} from '@contractspec/lib.contracts-spec';
import {
	ContractsrcSchema,
	DEFAULT_CONTRACTSRC,
} from '@contractspec/lib.contracts-spec/workspace-config/contractsrc-schema';
import { createUpgradePlan } from '../versioning/release-plan';
import { renderUpgradePrompt } from '../versioning/release-formatters';
import { analyzeUpgrades } from './upgrade-service';
import type {
	GuidedUpgradeAnalysisResult,
	GuidedUpgradeApplyResult,
	UpgradeOptions,
} from './types';
import {
	findPackageRoot,
	findWorkspaceRoot,
} from '../../adapters/workspace';
import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';

interface ServiceAdapters {
	fs: FsAdapter;
	logger: LoggerAdapter;
}

const IMPORT_REWRITE_GLOB = '**/*.{ts,tsx,js,jsx,mjs,cjs}';
const DEFAULT_UPGRADE_CONFIG = DEFAULT_CONTRACTSRC.upgrade ?? {
	manifestPaths: ['generated/releases/upgrade-manifest.json'],
	defaultAgentTarget: 'codex',
	enableInteractiveGuidance: true,
	applyCodemods: true,
};

export async function analyzeGuidedUpgrade(
	adapters: ServiceAdapters,
	options: UpgradeOptions
): Promise<GuidedUpgradeAnalysisResult> {
	const { fs } = adapters;
	const packageRoot = findPackageRoot(options.workspaceRoot);
	const workspaceRoot = findWorkspaceRoot(options.workspaceRoot);
	const config = await readWorkspaceUpgradeConfig(fs, packageRoot, workspaceRoot);
	const manifestResolution = await resolveUpgradeManifest(
		fs,
		packageRoot,
		workspaceRoot,
		options.manifestPaths ?? config.manifestPaths
	);
	const analysis = await analyzeUpgrades(adapters, {
		workspaceRoot: packageRoot,
		dryRun: options.dryRun,
	});
	const agentTargets = [
		options.agentTarget ?? config.defaultAgentTarget ?? 'codex',
	];
	const plan = createUpgradePlan(
		manifestResolution.manifest,
		analysis.packages.map((pkg) => ({
			name: pkg.name,
			currentVersion: pkg.currentVersion,
		})),
		agentTargets,
		renderUpgradePrompt
	);
	const augmentedPlan = augmentUpgradePlan(plan, analysis.packages, analysis.configUpgrades);

	return {
		packageManager: analysis.packageManager,
		manifestPath: manifestResolution.path,
		plan: augmentedPlan,
		humanChecklist: buildChecklist(augmentedPlan),
	};
}

export async function applyGuidedUpgrade(
	adapters: ServiceAdapters,
	options: UpgradeOptions
): Promise<GuidedUpgradeApplyResult> {
	const { fs, logger } = adapters;
	const packageRoot = findPackageRoot(options.workspaceRoot);
	const analysis = await analyzeGuidedUpgrade(adapters, options);
	const appliedAutofixes: string[] = [];

	if (!options.dryRun) {
		for (const step of analysis.plan.steps) {
			if (step.level !== 'auto') {
				continue;
			}
			for (const fix of step.autofixes ?? []) {
				const applied = await applyAutofix(fs, packageRoot, fix);
				if (applied) {
					appliedAutofixes.push(fix.id);
				}
			}
		}
		logger.info('Applied guided upgrade autofixes', {
			count: appliedAutofixes.length,
			workspaceRoot: packageRoot,
		});
	}

	const remainingSteps = analysis.plan.steps.filter((step) => step.level !== 'auto');

	return {
		success: true,
		packagesUpgraded: appliedAutofixes.filter((id) => id.startsWith('pkg:')).length,
		configSectionsUpgraded: appliedAutofixes.filter((id) => id.startsWith('config:')).length,
		summary: options.dryRun
			? `Would apply ${analysis.plan.autofixCount} deterministic upgrade step(s)`
			: `Applied ${appliedAutofixes.length} deterministic upgrade autofix(es)`,
		appliedAutofixes,
		remainingSteps,
		humanChecklist: analysis.humanChecklist,
		promptBundle: analysis.plan.agentPrompts[0],
		plan: analysis.plan,
		manifestPath: analysis.manifestPath,
	};
}

async function resolveUpgradeManifest(
	fs: FsAdapter,
	packageRoot: string,
	workspaceRoot: string,
	manifestPaths: string[] | undefined
): Promise<{ path?: string; manifest: GeneratedReleaseManifest }> {
	const candidatePaths = manifestPaths ?? ['generated/releases/upgrade-manifest.json'];
	const searchRoots = Array.from(new Set([packageRoot, workspaceRoot]));

	for (const candidatePath of candidatePaths) {
		const resolvedPaths = candidatePath.startsWith('/')
			? [candidatePath]
			: searchRoots.map((root) => fs.join(root, candidatePath));

		for (const resolvedPath of resolvedPaths) {
			if (!(await fs.exists(resolvedPath))) {
				continue;
			}

			const manifest = GeneratedReleaseManifestSchema.parse(
				JSON.parse(await fs.readFile(resolvedPath))
			);
			return { path: resolvedPath, manifest };
		}
	}

	return {
		manifest: GeneratedReleaseManifestSchema.parse({
			generatedAt: new Date().toISOString(),
			releases: [],
		}),
	};
}

async function readWorkspaceUpgradeConfig(
	fs: FsAdapter,
	packageRoot: string,
	workspaceRoot: string
): Promise<typeof DEFAULT_UPGRADE_CONFIG> {
	for (const configPath of Array.from(
		new Set([
			fs.join(packageRoot, '.contractsrc.json'),
			fs.join(workspaceRoot, '.contractsrc.json'),
		])
	)) {
		if (!(await fs.exists(configPath))) {
			continue;
		}

		try {
			const parsed = JSON.parse(await fs.readFile(configPath));
			const validated = ContractsrcSchema.safeParse(parsed);
			if (validated.success) {
				return {
					...DEFAULT_UPGRADE_CONFIG,
					...validated.data.upgrade,
				};
			}
		} catch {
			continue;
		}
	}

	return DEFAULT_UPGRADE_CONFIG;
}

function augmentUpgradePlan(
	plan: GuidedUpgradeAnalysisResult['plan'],
	packages: Array<{ name: string; currentVersion: string; isDevDependency: boolean }>,
	configUpgrades: Array<{ key: string; suggestedValue: unknown }>
) {
	const packageFixes: UpgradeAutofix[] = [];

	for (const pkg of packages) {
		const target = plan.targetPackages.find((entry) => entry.name === pkg.name);
		if (!target?.targetVersion || target.targetVersion === pkg.currentVersion) {
			continue;
		}

		packageFixes.push({
			id: `pkg:${pkg.name}`,
			kind: 'package-json',
			title: `Update ${pkg.name}`,
			summary: `Update ${pkg.name} to ${target.targetVersion}`,
			packageName: pkg.name,
			dependencyType: pkg.isDevDependency ? 'devDependencies' : 'dependencies',
			from: pkg.currentVersion,
			to: target.targetVersion,
		});
	}
	const configFixes = configUpgrades.map((upgrade) => ({
		id: `config:${upgrade.key}`,
		kind: 'contractsrc' as const,
		title: `Update ${upgrade.key}`,
		summary: `Update .contractsrc.json at ${upgrade.key}`,
		configPath: upgrade.key,
		value: upgrade.suggestedValue,
	}));
	const implicitSteps: UpgradePlanStep[] = [];

	if (packageFixes.length > 0) {
		implicitSteps.push({
			id: 'upgrade-contractspec-packages',
			title: 'Update ContractSpec packages',
			summary: 'Apply package version upgrades from the release manifest.',
			level: 'auto',
			instructions: packageFixes.map(
				(fix) => `${fix.packageName}: ${fix.from ?? 'current'} -> ${fix.to ?? 'latest'}`
			),
			packages: packageFixes.map((fix) => fix.packageName ?? ''),
			autofixes: packageFixes,
		});
	}

	if (configFixes.length > 0) {
		implicitSteps.push({
			id: 'upgrade-contractsrc-config',
			title: 'Refresh .contractsrc.json defaults',
			summary: 'Bring workspace release and upgrade config in line with current defaults.',
			level: 'auto',
			instructions: configFixes.map((fix) => `${fix.configPath} -> updated`),
			autofixes: configFixes,
		});
	}

	const steps = [...implicitSteps, ...plan.steps];
	const autoCount = steps.filter((step) => step.level === 'auto').length;
	const assistedCount = steps.filter((step) => step.level === 'assisted').length;
	const manualCount = steps.filter((step) => step.level === 'manual').length;

	return {
		...plan,
		steps,
		autofixCount: autoCount,
		assistedCount,
		manualCount,
		agentPrompts: createUpgradePlan(
			{
				generatedAt: plan.generatedAt,
				releases: plan.releases,
			},
			plan.targetPackages.map((pkg) => ({
				name: pkg.name,
				currentVersion: pkg.currentVersion,
			})),
			plan.agentPrompts.map((prompt) => prompt.agent as AgentTarget),
			renderUpgradePrompt
		).agentPrompts,
	};
}

function buildChecklist(plan: GuidedUpgradeAnalysisResult['plan']): string[] {
	return plan.steps.map((step) => `${step.title}: ${step.summary}`);
}

async function applyAutofix(
	fs: FsAdapter,
	workspaceRoot: string,
	fix: UpgradeAutofix
): Promise<boolean> {
	switch (fix.kind) {
		case 'package-json':
			return applyPackageJsonAutofix(fs, workspaceRoot, fix);
		case 'contractsrc':
			return applyContractsrcAutofix(fs, workspaceRoot, fix);
		case 'import-rewrite':
			return applyImportRewriteAutofix(fs, workspaceRoot, fix);
		case 'codemod':
			return false;
	}
}

async function applyPackageJsonAutofix(
	fs: FsAdapter,
	workspaceRoot: string,
	fix: UpgradeAutofix
): Promise<boolean> {
	const packageJsonPath = fs.join(workspaceRoot, 'package.json');
	if (!(await fs.exists(packageJsonPath))) {
		return false;
	}

	const packageJson = JSON.parse(await fs.readFile(packageJsonPath)) as Record<string, unknown>;
	const dependencyType = fix.dependencyType ?? 'dependencies';
	const dependencies = (packageJson[dependencyType] ?? {}) as Record<string, string>;
	if (!fix.packageName || !fix.to || !dependencies[fix.packageName]) {
		return false;
	}

	dependencies[fix.packageName] = fix.to;
	packageJson[dependencyType] = dependencies;
	await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
	return true;
}

async function applyContractsrcAutofix(
	fs: FsAdapter,
	workspaceRoot: string,
	fix: UpgradeAutofix
): Promise<boolean> {
	const configPath = fs.join(workspaceRoot, '.contractsrc.json');
	const config = (await fs.exists(configPath))
		? (JSON.parse(await fs.readFile(configPath)) as Record<string, unknown>)
		: {};

	if (!fix.configPath) {
		return false;
	}

	setNestedValue(config, fix.configPath, fix.value);
	await fs.writeFile(configPath, JSON.stringify(config, null, 2) + '\n');
	return true;
}

async function applyImportRewriteAutofix(
	fs: FsAdapter,
	workspaceRoot: string,
	fix: UpgradeAutofix
): Promise<boolean> {
	if (!fix.from || !fix.to) {
		return false;
	}

	const files = await fs.glob({
		pattern: fix.path ?? IMPORT_REWRITE_GLOB,
		cwd: workspaceRoot,
		absolute: true,
	});
	let changed = false;

	for (const filePath of files) {
		const content = await fs.readFile(filePath);
		if (!content.includes(fix.from)) {
			continue;
		}

		await fs.writeFile(filePath, content.split(fix.from).join(fix.to));
		changed = true;
	}

	return changed;
}

function setNestedValue(
	target: Record<string, unknown>,
	path: string,
	value: unknown
): void {
	const segments = path.split('.');
	let current: Record<string, unknown> = target;

	for (const segment of segments.slice(0, -1)) {
		const next = current[segment];
		if (!next || typeof next !== 'object' || Array.isArray(next)) {
			current[segment] = {};
		}
		current = current[segment] as Record<string, unknown>;
	}

	const lastSegment = segments.at(-1);
	if (lastSegment) {
		current[lastSegment] = value;
	}
}
