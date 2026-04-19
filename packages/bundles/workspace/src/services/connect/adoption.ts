import type { WorkspaceAdapters } from '../../ports/logger';
import * as adoption from '../adoption/index';
import type {
	ConnectPatchVerdict,
	ConnectVerdict,
	ConnectVerifyInput,
} from './types';

export async function evaluateConnectAdoption(
	adapters: Pick<WorkspaceAdapters, 'fs'>,
	input: ConnectVerifyInput
): Promise<{
	check?: ConnectPatchVerdict['checks'][number];
	reason?: string;
	remediation?: string[];
	resolution?: Awaited<ReturnType<typeof adoption.resolveAdoption>>;
	verdict?: ConnectVerdict;
}> {
	if (!input.config?.connect?.adoption?.enabled) {
		return {};
	}

	const family = classifyAdoptionFamily(input);
	if (!family) {
		return {};
	}

	const resolution = await adoption.resolveAdoption(
		{ fs: adapters.fs },
		{
			config: input.config,
			cwd: input.cwd,
			currentTarget: input.tool === 'acp.fs.access' ? input.path : undefined,
			family,
			paths:
				input.tool === 'acp.fs.access'
					? [input.path]
					: (input.touchedPaths ?? []),
			platform: family === 'ui' ? inferPlatform(input) : undefined,
			query: describeQuery(input),
			workspaceRoot: input.workspaceRoot,
			packageRoot: input.packageRoot,
		}
	);

	return {
		check: {
			id: 'adoption-resolution',
			status:
				resolution.verdict === 'permit'
					? 'pass'
					: resolution.verdict === 'rewrite'
						? 'warn'
						: 'fail',
			detail: resolution.reason,
		},
		reason: resolution.reason,
		remediation:
			resolution.selected != null
				? [
						`Prefer ${resolution.selected.candidate.source} candidate ${resolution.selected.candidate.title}.`,
					]
				: [
						'No reusable candidate matched; create the smallest viable surface.',
					],
		resolution,
		verdict: resolution.verdict,
	};
}

function classifyAdoptionFamily(input: ConnectVerifyInput) {
	const text = describeQuery(input).toLowerCase();
	if (/\b(contract|operation|event|spec|presentation|form)\b/.test(text)) {
		return 'contracts' as const;
	}
	if (/\b(integration|provider|sdk|adapter|bridge)\b/.test(text)) {
		return 'integrations' as const;
	}
	if (/\b(runtime|mcp|graphql|rest|harness|render)\b/.test(text)) {
		return 'runtime' as const;
	}
	if (/\b(component|ui|screen|view|page|tsx|jsx)\b/.test(text)) {
		return 'ui' as const;
	}
	if (/\b(module|bundle|example|template)\b/.test(text)) {
		return 'solutions' as const;
	}
	if (
		/\b(logger|schema|testing|observability|identity|utility|shared|lib)\b/.test(
			text
		)
	) {
		return 'sharedLibs' as const;
	}
	return null;
}

function describeQuery(input: ConnectVerifyInput) {
	return input.tool === 'acp.fs.access'
		? `${input.operation} ${input.path}`
		: `${input.command} ${(input.touchedPaths ?? []).join(' ')}`.trim();
}

function inferPlatform(input: ConnectVerifyInput) {
	const text = describeQuery(input).toLowerCase();
	return /\b(native|expo|react-native)\b/.test(text) ? 'native' : 'web';
}
