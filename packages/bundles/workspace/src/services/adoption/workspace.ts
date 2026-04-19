import { resolve } from 'node:path';
import {
	ContractsrcSchema,
	DEFAULT_CONTRACTSRC,
	type ResolvedContractsrcConfig,
} from '@contractspec/lib.contracts-spec/workspace-config';
import { findPackageRoot, findWorkspaceRoot } from '../../adapters/workspace';
import type { FsAdapter } from '../../ports/fs';
import type { AdoptionResolvedWorkspace, AdoptionSyncInput } from './types';

export async function resolveAdoptionWorkspace(
	fs: FsAdapter,
	input: AdoptionSyncInput = {}
): Promise<AdoptionResolvedWorkspace> {
	const cwd = resolve(input.cwd ?? process.cwd());
	const workspaceRoot = input.workspaceRoot ?? findWorkspaceRoot(cwd);
	const packageRoot = input.packageRoot ?? findPackageRoot(cwd);
	const config = input.config
		? mergeResolvedConfig(DEFAULT_CONTRACTSRC, input.config)
		: await loadMergedConfig(fs, workspaceRoot, packageRoot);
	const adoption =
		config.connect?.adoption ?? DEFAULT_CONTRACTSRC.connect!.adoption!;

	return {
		adoption,
		config,
		cwd,
		packageRoot,
		workspaceRoot,
	};
}

async function loadMergedConfig(
	fs: FsAdapter,
	workspaceRoot: string,
	packageRoot: string
): Promise<ResolvedContractsrcConfig> {
	let config = DEFAULT_CONTRACTSRC;
	if (workspaceRoot !== packageRoot) {
		config = await mergeConfigFile(
			fs,
			config,
			fs.join(workspaceRoot, '.contractsrc.json')
		);
	}
	return mergeConfigFile(fs, config, fs.join(packageRoot, '.contractsrc.json'));
}

async function mergeConfigFile(
	fs: FsAdapter,
	base: ResolvedContractsrcConfig,
	configPath: string
): Promise<ResolvedContractsrcConfig> {
	if (!(await fs.exists(configPath))) {
		return base;
	}

	try {
		const parsed = JSON.parse(await fs.readFile(configPath));
		const validated = ContractsrcSchema.safeParse(parsed);
		if (!validated.success) {
			return base;
		}
		return mergeResolvedConfig(
			base,
			validated.data as ResolvedContractsrcConfig
		);
	} catch {
		return base;
	}
}

function mergeResolvedConfig(
	base: ResolvedContractsrcConfig,
	override: ResolvedContractsrcConfig
): ResolvedContractsrcConfig {
	return {
		...base,
		...override,
		connect: {
			...base.connect,
			...override.connect,
			adapters: {
				...base.connect?.adapters,
				...override.connect?.adapters,
			},
			adoption: {
				...base.connect?.adoption,
				...override.connect?.adoption,
				catalog: {
					...base.connect?.adoption?.catalog,
					...override.connect?.adoption?.catalog,
				},
				workspaceScan: {
					...base.connect?.adoption?.workspaceScan,
					...override.connect?.adoption?.workspaceScan,
				},
				families: {
					...base.connect?.adoption?.families,
					...override.connect?.adoption?.families,
				},
				thresholds: {
					...base.connect?.adoption?.thresholds,
					...override.connect?.adoption?.thresholds,
				},
			},
			policy: {
				...base.connect?.policy,
				...override.connect?.policy,
				reviewThresholds: {
					...base.connect?.policy?.reviewThresholds,
					...override.connect?.policy?.reviewThresholds,
				},
			},
			storage: {
				...base.connect?.storage,
				...override.connect?.storage,
			},
		},
	};
}
