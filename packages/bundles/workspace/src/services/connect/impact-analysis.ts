import { detectImpact } from '../impact';
import { detectDrift } from '../drift';
import { listSpecs } from '../list';
import { inferSurfaces, type ConnectResolvedWorkspace } from './shared';
import type { WorkspaceAdapters } from '../../ports/logger';
import type { ConnectContractRef, ConnectSurface } from './types';

export interface ConnectPathImpact {
	path: string;
	contracts: ConnectContractRef[];
	policies: ConnectContractRef[];
	surfaces: ConnectSurface[];
	confidence: 'exact' | 'high' | 'medium' | 'none';
	reasons: string[];
}

export interface ConnectImpactAnalysis {
	impactedContracts: ConnectContractRef[];
	pathImpacts: ConnectPathImpact[];
	breakingChange: boolean;
	driftFiles: string[];
	impactResult?: Awaited<ReturnType<typeof detectImpact>>;
	unknownPaths: string[];
}

export async function analyzeConnectImpact(
	adapters: Pick<WorkspaceAdapters, 'fs' | 'git'> &
		Partial<Pick<WorkspaceAdapters, 'logger'>>,
	input: {
		workspace: ConnectResolvedWorkspace;
		touchedPaths: string[];
		baseline?: string;
	}
): Promise<ConnectImpactAnalysis> {
	const specs = await listSpecs({ fs: adapters.fs }, { config: input.workspace.config });
	const specByKey = new Map(
		specs
			.filter((spec) => typeof spec.key === 'string')
			.map((spec) => [spec.key as string, spec])
	);
	const pathImpacts = input.touchedPaths.map((path) =>
		resolvePathImpact(adapters.fs, input.workspace, path, specs, specByKey)
	);
	const impactResult =
		input.baseline != null
			? await detectImpact(
					{ ...adapters, logger: adapters.logger ?? noopLogger },
					{ baseline: input.baseline, workspaceRoot: input.workspace.workspaceRoot }
				)
			: undefined;
	const driftFiles = await resolveDriftFiles(adapters, input.workspace, input.touchedPaths);
	const impactedContracts = dedupeContracts([
		...pathImpacts.flatMap((impact) => impact.contracts),
		...(impactResult?.deltas ?? []).map((delta) => ({
			key: delta.specKey,
			version: delta.specVersion,
			kind: (delta.specType === 'event' ? 'event' : 'command') as
				| 'event'
				| 'command',
		})),
	]);

	return {
		breakingChange: impactResult?.hasBreaking === true,
		driftFiles,
		impactResult,
		impactedContracts,
		pathImpacts,
		unknownPaths: pathImpacts
			.filter((impact) => impact.contracts.length === 0)
			.map((impact) => impact.path),
	};
}

function resolvePathImpact(
	fs: WorkspaceAdapters['fs'],
	workspace: ConnectResolvedWorkspace,
	path: string,
	specs: Awaited<ReturnType<typeof listSpecs>>,
	specByKey: Map<string, Awaited<ReturnType<typeof listSpecs>>[number]>
): ConnectPathImpact {
	const absolute = fs.resolve(workspace.workspaceRoot, path);
	const pathTokens = tokenize(path);
	const candidates = specs
		.map((spec) => {
			const relative = normalize(fs.relative(workspace.workspaceRoot, spec.filePath));
			const score = scoreMatch(path, pathTokens, relative, spec.key);
			return { score, spec };
		})
		.filter((candidate) => candidate.score >= 45)
		.sort((left, right) => right.score - left.score)
		.slice(0, 3);
	const directMatch = specs.find((spec) => spec.filePath === absolute);
	const chosen = directMatch ? [{ score: 100, spec: directMatch }] : candidates;
	const directContracts = chosen
		.filter((candidate) => typeof candidate.spec.key === 'string')
		.map((candidate) => toContractRef(candidate.spec.key as string, candidate.spec.version, candidate.spec.kind));
	const expandedRefs = chosen.flatMap((candidate) =>
		[
			...(candidate.spec.emittedEvents ?? []),
			...(candidate.spec.policyRefs ?? []),
			...(candidate.spec.testRefs ?? []),
		]
			.map((ref) => specByKey.get(ref.key))
			.filter(Boolean)
			.map((spec) => toContractRef(spec!.key as string, spec!.version, spec!.kind))
	);
	const contracts = dedupeContracts([...directContracts, ...expandedRefs]);
	const policies = dedupeContracts([
		{ key: 'connect.policy', version: '1.0.0', kind: 'policy' },
		...chosen
			.flatMap((candidate) => candidate.spec.policyRefs ?? [])
			.map((ref) => toContractRef(ref.key, ref.version, 'policy')),
	]);

	return {
		confidence:
			chosen[0]?.score === 100
				? 'exact'
				: (chosen[0]?.score ?? 0) >= 70
					? 'high'
					: chosen.length > 0
						? 'medium'
						: 'none',
		contracts,
		path,
		policies,
		reasons: chosen.map(
			(candidate) =>
				`${candidate.spec.key ?? candidate.spec.filePath} matched with score ${candidate.score}`
		),
		surfaces: inferSurfaces([path]),
	};
}

async function resolveDriftFiles(
	adapters: Pick<WorkspaceAdapters, 'fs'> &
		Partial<Pick<WorkspaceAdapters, 'logger'>>,
	workspace: ConnectResolvedWorkspace,
	touchedPaths: string[]
) {
	const roots = resolveGeneratedTargets(adapters.fs, workspace, touchedPaths);
	const results = await Promise.all(
		roots.map(async (target) => {
			const generatedDir = adapters.fs.resolve(
				workspace.packageRoot,
				target.comparisonRoot
			);
			const drift = await detectDrift(
				{ ...adapters, logger: adapters.logger ?? noopLogger } as Parameters<
					typeof detectDrift
				>[0],
				workspace.workspaceRoot,
				generatedDir,
				{
					generation: {
						scanAllSpecs: true,
						specSearchRoot: workspace.workspaceRoot,
					},
					rootPath: workspace.workspaceRoot,
				}
			);
			const relativePrefix =
				target.filterPrefix && target.filterPrefix !== target.comparisonRoot
					? normalize(
							adapters.fs.relative(target.comparisonRoot, target.filterPrefix)
						)
					: undefined;
			return drift.files
				.filter((file) =>
					relativePrefix
						? normalize(file) === relativePrefix ||
							normalize(file).startsWith(`${relativePrefix}/`)
						: true
				)
				.map((file) => normalize(adapters.fs.join(target.comparisonRoot, file)));
		})
	);

	return [...new Set(results.flat())].sort();
}

function resolveGeneratedTargets(
	fs: WorkspaceAdapters['fs'],
	workspace: ConnectResolvedWorkspace,
	touchedPaths: string[]
) {
	const configRoots = (workspace.config.connect?.policy?.generatedPaths ?? [])
		.map(globRoot)
		.filter(Boolean);
	const outputDir =
		workspace.config.outputDir && workspace.config.outputDir !== './src'
			? normalize(workspace.config.outputDir)
			: undefined;
	const targets = new Map<string, { comparisonRoot: string; filterPrefix?: string }>();

	for (const path of touchedPaths) {
		const normalized = normalize(path);
		if (outputDir && normalized.startsWith(outputDir)) {
			targets.set(outputDir, { comparisonRoot: outputDir });
		}
		for (const root of configRoots) {
			if (normalized.startsWith(root)) {
				const comparisonRoot = resolveComparisonRoot(fs, outputDir, root);
				targets.set(`${comparisonRoot}::${root}`, {
					comparisonRoot,
					filterPrefix: root,
				});
			}
		}
	}

	return [...targets.values()];
}

function resolveComparisonRoot(
	fs: WorkspaceAdapters['fs'],
	outputDir: string | undefined,
	root: string
) {
	if (outputDir && root.startsWith(outputDir)) {
		return outputDir;
	}
	return fs.basename(root) === 'docs' ? normalize(fs.dirname(root)) : root;
}

function scoreMatch(
	path: string,
	pathTokens: string[],
	specPath: string,
	specKey: string | undefined
) {
	if (normalize(path) === normalize(specPath)) {
		return 100;
	}

	const specTokens = tokenize(specPath);
	const keyTokens = tokenize(specKey ?? '');
	const basenameBoost =
		basenameWithoutExt(path) === basenameWithoutExt(specPath) ? 40 : 0;
	const directoryOverlap = overlapScore(path.split('/'), specPath.split('/'), 5);
	const tokenOverlap = overlapScore(pathTokens, specTokens, 5);
	const keyOverlap = overlapScore(pathTokens, keyTokens, 4);

	return basenameBoost + directoryOverlap + tokenOverlap + keyOverlap;
}

function overlapScore(left: string[], right: string[], weight: number) {
	const rightSet = new Set(right);
	return left.filter((token) => rightSet.has(token)).length * weight;
}

function tokenize(value: string) {
	return normalize(value)
		.split(/[\/._-]+/)
		.filter(Boolean);
}

function basenameWithoutExt(path: string) {
	return normalize(path).split('/').pop()?.replace(/\.[^.]+$/, '') ?? path;
}

function globRoot(pattern: string) {
	return normalize(pattern.split(/[\[*?{]/, 1)[0] ?? '').replace(/\/$/, '');
}

function normalize(path: string) {
	return path.replaceAll('\\', '/').replace(/^\.\//, '');
}

function toContractRef(
	key: string,
	version: string | undefined,
	kind: string | undefined
): ConnectContractRef {
	return {
		key,
		version: String(version ?? '1.0.0'),
		kind:
			kind === 'query' || kind === 'event' || kind === 'policy' || kind === 'capability'
				? kind
				: 'command',
	};
}

function dedupeContracts(contracts: ConnectContractRef[]) {
	return [...new Map(contracts.map((contract) => [`${contract.key}@${contract.version}`, contract])).values()];
}

const noopLogger: WorkspaceAdapters['logger'] = {
	createProgress: () => ({
		fail: () => {},
		start: () => {},
		stop: () => {},
		succeed: () => {},
		update: () => {},
		warn: () => {},
	}),
	debug: () => {},
	error: () => {},
	info: () => {},
	warn: () => {},
};
