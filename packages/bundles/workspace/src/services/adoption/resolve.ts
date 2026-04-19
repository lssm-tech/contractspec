import {
	type ConnectVerdict,
	DEFAULT_CONTRACTSRC,
} from '@contractspec/lib.contracts-spec/workspace-config';
import {
	createAdoptionCatalogDocument,
	getContractSpecAdoptionCatalog,
} from './catalog';
import { candidateTokens, overlap, tokenize, uniqueTokens } from './tokens';
import type {
	AdoptionCandidate,
	AdoptionCatalogEntry,
	AdoptionResolution,
	AdoptionResolutionCandidate,
	AdoptionResolvedWorkspace,
	AdoptionResolveInput,
	AdoptionResolverRuntime,
	AdoptionSyncInput,
} from './types';
import { resolveAdoptionWorkspace } from './workspace';
import {
	hasLocalShadcnRegistry,
	scanWorkspaceAdoptionCandidates,
} from './workspace-scan';

export async function resolveAdoption(
	runtime: AdoptionResolverRuntime,
	input: AdoptionResolveInput
): Promise<AdoptionResolution> {
	const workspace = await resolveAdoptionWorkspace(runtime.fs, input);
	const query = buildQuery(input);
	const queryTokens = uniqueTokens([
		query,
		input.symbol ?? '',
		...(input.paths ?? []),
	]);
	const workspaceIndex = await scanWorkspaceAdoptionCandidates(
		runtime.fs,
		workspace
	);
	const catalog = await readCatalogOverrides(runtime, workspace);
	const hasShadcn = await hasLocalShadcnRegistry(runtime.fs, workspace);
	const candidates = buildResolutionCandidates(workspace, queryTokens, input, [
		...workspaceIndex.packageCandidates,
		...workspaceIndex.fileCandidates,
		...catalog,
		...buildEcosystemFallbacks(input.family, input.platform, hasShadcn),
	]);
	const selected = candidates[0] ?? null;
	const ambiguous =
		candidates.length > 1 &&
		selected != null &&
		selected.candidate.source === candidates[1]!.candidate.source &&
		Math.abs(selected.score - candidates[1]!.score) <= 40;
	const verdict = decideVerdict(
		workspace,
		selected,
		ambiguous,
		input.currentTarget
	);

	return {
		ambiguous,
		candidates,
		currentTarget: input.currentTarget,
		exhausted: selected?.candidate.source === 'ecosystem',
		family: input.family,
		query,
		reason: describeResolution(selected, ambiguous),
		selected,
		verdict,
	};
}

function buildResolutionCandidates(
	workspace: AdoptionResolvedWorkspace,
	queryTokens: string[],
	input: AdoptionResolveInput,
	candidates: AdoptionCandidate[]
): AdoptionResolutionCandidate[] {
	return candidates
		.filter(
			(candidate) =>
				candidate.family === input.family &&
				familyEnabled(workspace, candidate.family)
		)
		.filter((candidate) => platformAllowed(candidate, input.platform))
		.map((candidate) => scoreCandidate(candidate, queryTokens, input.paths))
		.filter((candidate) => candidate.score > 40)
		.sort((left, right) => right.score - left.score)
		.slice(0, 8);
}

function scoreCandidate(
	candidate: AdoptionCandidate,
	queryTokens: string[],
	paths: string[] | undefined
): AdoptionResolutionCandidate {
	const tokens = candidateTokens(candidate);
	const pathTokens = uniqueTokens(paths ?? []);
	const reasons = [];
	const tokenScore = overlap(queryTokens, tokens) * 25;
	const pathScore = overlap(pathTokens, tokens) * 10;
	if (tokenScore > 0) reasons.push('query overlap');
	if (pathScore > 0) reasons.push('path overlap');
	return {
		candidate,
		matchReasons: reasons,
		score:
			sourceScore(candidate.source) +
			(candidate.resolutionPriority ?? 0) +
			tokenScore +
			pathScore,
	};
}

function sourceScore(source: AdoptionCandidate['source']): number {
	if (source === 'workspace') return 300;
	if (source === 'contractspec') return 200;
	return 100;
}

function familyEnabled(
	workspace: AdoptionResolvedWorkspace,
	family: AdoptionCandidate['family']
) {
	return workspace.adoption.families?.[family] ?? true;
}

function platformAllowed(
	candidate: AdoptionCandidate,
	platform: string | undefined
) {
	return (
		!platform ||
		!('platforms' in candidate) ||
		!candidate.platforms ||
		candidate.platforms.includes(platform)
	);
}

function decideVerdict(
	workspace: AdoptionResolvedWorkspace,
	selected: AdoptionResolutionCandidate | null,
	ambiguous: boolean,
	currentTarget?: string
): ConnectVerdict {
	const thresholds =
		workspace.adoption.thresholds ??
		DEFAULT_CONTRACTSRC.connect!.adoption!.thresholds!;
	if (ambiguous) return thresholds.ambiguous ?? 'require_review';
	if (!selected) return thresholds.newImplementation ?? 'require_review';
	if (selected.candidate.source === 'workspace') {
		return matchesCurrentTarget(selected.candidate, currentTarget)
			? 'permit'
			: (thresholds.workspaceReuse ?? 'rewrite');
	}
	if (selected.candidate.source === 'contractspec') {
		return thresholds.contractspecReuse ?? 'rewrite';
	}
	if (selected.candidate.id.startsWith('ecosystem.new')) {
		return thresholds.newImplementation ?? 'require_review';
	}
	return thresholds.newExternalDependency ?? 'require_review';
}

function matchesCurrentTarget(
	candidate: AdoptionCandidate,
	currentTarget?: string
) {
	return Boolean(
		currentTarget &&
			'filePath' in candidate &&
			candidate.filePath &&
			candidate.filePath === currentTarget
	);
}

function describeResolution(
	selected: AdoptionResolutionCandidate | null,
	ambiguous: boolean
) {
	if (ambiguous) {
		return 'Multiple similarly strong adoption candidates were found.';
	}
	if (!selected) {
		return 'No reusable workspace or ContractSpec candidate matched the request.';
	}
	return `Selected ${selected.candidate.source} candidate ${selected.candidate.title}.`;
}

function buildQuery(input: AdoptionResolveInput): string {
	if (input.query?.trim()) return input.query.trim();
	if (input.symbol?.trim()) return input.symbol.trim();
	if (input.paths?.length) return input.paths.join(' ');
	return input.family;
}

async function readCatalogOverrides(
	runtime: AdoptionResolverRuntime,
	workspace: AdoptionResolvedWorkspace
): Promise<AdoptionCatalogEntry[]> {
	const entries = getContractSpecAdoptionCatalog();
	const overridePath = workspace.adoption.catalog?.overrideManifestPath;
	if (
		!overridePath ||
		!(await runtime.fs.exists(
			runtime.fs.join(workspace.workspaceRoot, overridePath)
		))
	) {
		return entries;
	}
	try {
		const content = await runtime.fs.readFile(
			runtime.fs.join(workspace.workspaceRoot, overridePath)
		);
		const parsed = JSON.parse(content) as
			| { entries?: AdoptionCatalogEntry[] }
			| AdoptionCatalogEntry[];
		return [
			...entries,
			...(Array.isArray(parsed) ? parsed : (parsed.entries ?? [])),
		];
	} catch {
		return entries;
	}
}

function buildEcosystemFallbacks(
	family: AdoptionResolveInput['family'],
	platform: string | undefined,
	hasShadcn: boolean
): AdoptionCatalogEntry[] {
	if (family === 'ui' && platform === 'web' && hasShadcn) {
		return [
			ecosystem(
				'ecosystem.shadcn',
				family,
				'shadcn-local',
				'Existing local shadcn registry',
				60
			),
		];
	}
	if (family === 'contracts') {
		return [
			ecosystem(
				'ecosystem.new-contract',
				family,
				'contractspec:create-spec',
				'Create a ContractSpec spec before implementation',
				20
			),
		];
	}
	if (family === 'integrations') {
		return [
			ecosystem(
				'ecosystem.vendor-sdk',
				family,
				'ecosystem:vendor-sdk',
				'Raw vendor SDK fallback',
				40
			),
		];
	}
	if (family === 'runtime') {
		return [
			ecosystem(
				'ecosystem.framework-native',
				family,
				'ecosystem:framework-native',
				'Framework-native runtime fallback',
				35
			),
		];
	}
	if (family === 'sharedLibs') {
		return [
			ecosystem(
				'ecosystem.external-lib',
				family,
				'ecosystem:external-lib',
				'External library fallback',
				30
			),
		];
	}
	return [
		ecosystem(
			'ecosystem.new-implementation',
			family,
			'ecosystem:new-local',
			'Create a new local implementation',
			10
		),
	];
}

function ecosystem(
	id: string,
	family: AdoptionResolveInput['family'],
	packageRef: string,
	title: string,
	resolutionPriority: number
): AdoptionCatalogEntry {
	return {
		id,
		source: 'ecosystem',
		packageRef,
		family,
		packageKind: 'primitive',
		title,
		description: title,
		capabilityTags: tokenize(title),
		preferredUseCases: [title],
		resolutionPriority,
	};
}

export async function syncAdoptionCatalog(
	runtime: AdoptionResolverRuntime,
	input: AdoptionSyncInput = {}
) {
	const workspace = await resolveAdoptionWorkspace(runtime.fs, input);
	const document = createAdoptionCatalogDocument();
	const catalogPath = runtime.fs.join(
		workspace.workspaceRoot,
		workspace.adoption.catalog?.indexPath ??
			'.contractspec/adoption/catalog.json'
	);
	await runtime.fs.writeFile(
		catalogPath,
		`${JSON.stringify(document, null, 2)}\n`
	);
	return {
		catalog: document,
		catalogPath,
	};
}
