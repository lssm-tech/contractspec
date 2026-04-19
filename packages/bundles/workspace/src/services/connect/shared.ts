import { existsSync, readFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import {
	ContractsrcSchema,
	DEFAULT_CONTRACTSRC,
	type ResolvedContractsrcConfig,
} from '@contractspec/lib.contracts-spec/workspace-config';
import { findPackageRoot, findWorkspaceRoot } from '../../adapters/workspace';
import type {
	ConnectActorRef,
	ConnectSurface,
	ConnectWorkspaceInput,
} from './types';

export interface ConnectResolvedWorkspace {
	cwd: string;
	workspaceRoot: string;
	packageRoot: string;
	config: ResolvedContractsrcConfig;
	repoId: string;
	branch: string;
}

export function resolveWorkspace(
	input: ConnectWorkspaceInput = {}
): ConnectResolvedWorkspace {
	const cwd = resolve(input.cwd ?? process.cwd());
	const workspaceRoot = input.workspaceRoot ?? findWorkspaceRoot(cwd);
	const packageRoot = input.packageRoot ?? findPackageRoot(cwd);
	const config = input.config ?? loadMergedConfig(workspaceRoot, packageRoot);
	const repoId = resolveRepoId(packageRoot, workspaceRoot);

	return {
		cwd,
		workspaceRoot,
		packageRoot,
		config,
		repoId,
		branch: 'unknown',
	};
}

export function withBranch<T extends ConnectResolvedWorkspace>(
	workspace: T,
	branch: string | undefined
): T {
	return {
		...workspace,
		branch: branch && branch.length > 0 ? branch : 'unknown',
	};
}

export function defaultActor(
	taskId: string,
	actor?: ConnectActorRef
): ConnectActorRef {
	return (
		actor ?? {
			id: `cli:${taskId}`,
			type: 'human',
		}
	);
}

export function inferSurfaces(paths: string[]): ConnectSurface[] {
	const surfaces = new Set<ConnectSurface>();

	for (const path of paths) {
		if (path.includes('/cli-') || path.includes('/apps/cli-'))
			surfaces.add('cli');
		if (path.includes('/contracts-spec/') || path.includes('/specs/')) {
			surfaces.add('contract');
		}
		if (
			path.includes('/components/') ||
			path.includes('/ui/') ||
			path.endsWith('.tsx') ||
			path.endsWith('.jsx')
		) {
			surfaces.add('ui');
		}
		if (path.includes('/integrations/') || path.includes('/provider')) {
			surfaces.add('integration');
		}
		if (
			path.includes('/libs/') ||
			path.includes('/shared/') ||
			path.includes('/utils/')
		) {
			surfaces.add('library');
		}
		if (
			path.includes('/modules/') ||
			path.includes('/bundles/') ||
			path.includes('/examples/')
		) {
			surfaces.add('solution');
		}
		if (path.includes('/runtime/')) surfaces.add('runtime');
		if (path.includes('/harness')) surfaces.add('harness');
		if (path.includes('/ai-agent/')) surfaces.add('agent');
		if (path.includes('/knowledge/')) surfaces.add('knowledge');
		if (path.includes('/mcp/')) surfaces.add('mcp');
	}

	if (surfaces.size === 0) {
		surfaces.add('runtime');
	}

	surfaces.add('audit');
	return [...surfaces].sort();
}

function loadMergedConfig(
	workspaceRoot: string,
	packageRoot: string
): ResolvedContractsrcConfig {
	let config: ResolvedContractsrcConfig = { ...DEFAULT_CONTRACTSRC };

	if (workspaceRoot !== packageRoot) {
		config = mergeConfigFile(config, join(workspaceRoot, '.contractsrc.json'));
	}

	return mergeConfigFile(config, join(packageRoot, '.contractsrc.json'));
}

function mergeConfigFile(
	base: ResolvedContractsrcConfig,
	configPath: string
): ResolvedContractsrcConfig {
	if (!existsSync(configPath)) {
		return base;
	}

	try {
		const content = readFileSync(configPath, 'utf-8');
		const parsed = JSON.parse(content);
		const validated = ContractsrcSchema.safeParse(parsed);
		if (!validated.success) {
			return base;
		}

		return {
			...base,
			...validated.data,
		} as ResolvedContractsrcConfig;
	} catch {
		return base;
	}
}

function resolveRepoId(packageRoot: string, workspaceRoot: string): string {
	const packageJsonPath = join(packageRoot, 'package.json');
	if (existsSync(packageJsonPath)) {
		try {
			const packageJson = JSON.parse(
				readFileSync(packageJsonPath, 'utf-8')
			) as { name?: string };
			if (packageJson.name) {
				return packageJson.name;
			}
		} catch {
			// Fall back to directory name below.
		}
	}

	return basename(workspaceRoot);
}
