/**
 * Policy enforcement checks.
 */

import {
	ContractsrcSchema,
	DEFAULT_CONTRACTSRC,
	type ResolvedContractsrcConfig,
} from '@contractspec/lib.contracts-spec/workspace-config';
import type { FsAdapter } from '../../../ports/fs';
import type { LoggerAdapter } from '../../../ports/logger';
import { loadWorkspaceConfig } from '../../config';
import { listSpecs } from '../../list';
import type { CICheckOptions, CIIssue } from '../types';

const IMPLEMENTATION_PATH_PATTERN =
	/(^|\/)(handlers?|routes?|controllers?|api)(\/|$)|\.(handler|handlers|route|routes|controller)\.(ts|tsx)$/i;

const CONTRACT_REFERENCE_PATTERN =
	/@contractspec\/lib\.contracts(?:-spec|-integrations)?|define(Command|Query|Event|Feature|Presentation|Capability|Form|DataView|Integration)|OperationSpecRegistry|ContractHandler|installOp|contracts\//;

function splitConventionPath(value?: string): string[] {
	if (!value) {
		return [];
	}

	return value
		.split(/[|/]/)
		.map((segment) => segment.trim())
		.filter(Boolean);
}

function isLikelyContractDefinitionPath(
	filePath: string,
	config: CICheckOptions['config']
): boolean {
	const normalized = filePath.replaceAll('\\', '/');
	const knownSegments = new Set([
		'contracts',
		'features',
		...splitConventionPath(config?.conventions?.operations),
		...splitConventionPath(config?.conventions?.events),
		...splitConventionPath(config?.conventions?.presentations),
		...splitConventionPath(config?.conventions?.forms),
	]);

	return normalized.split('/').some((segment) => knownSegments.has(segment));
}

function isPolicyCandidate(
	filePath: string,
	specFiles: Set<string>,
	config: CICheckOptions['config']
): boolean {
	const normalized = filePath.replaceAll('\\', '/');

	if (!/\.(ts|tsx)$/.test(normalized)) {
		return false;
	}

	if (
		normalized.includes('/node_modules/') ||
		normalized.includes('/dist/') ||
		normalized.endsWith('.d.ts') ||
		normalized.endsWith('.test.ts') ||
		normalized.endsWith('.spec.ts')
	) {
		return false;
	}

	if (specFiles.has(normalized)) {
		return false;
	}

	if (isLikelyContractDefinitionPath(normalized, config)) {
		return false;
	}

	return IMPLEMENTATION_PATH_PATTERN.test(normalized);
}

function resolvePolicyConfig(
	config?: CICheckOptions['config']
): ResolvedContractsrcConfig {
	if (!config) {
		return DEFAULT_CONTRACTSRC;
	}

	const resolved = ContractsrcSchema.safeParse(config);
	const parsed = resolved.success ? resolved.data : {};

	return {
		...DEFAULT_CONTRACTSRC,
		...parsed,
		conventions: {
			...DEFAULT_CONTRACTSRC.conventions,
			...(parsed.conventions ?? {}),
		},
		ci: {
			...DEFAULT_CONTRACTSRC.ci,
			...(parsed.ci ?? {}),
		},
	};
}

/**
 * Run contract-first implementation checks.
 */
export async function runPolicyChecks(
	adapters: { fs: FsAdapter; logger: LoggerAdapter },
	options: CICheckOptions
): Promise<CIIssue[]> {
	const { fs, logger } = adapters;
	const issues: CIIssue[] = [];
	const config = options.config
		? resolvePolicyConfig(options.config)
		: await loadWorkspaceConfig(fs);

	const scannedSpecs = await listSpecs({ fs }, { config });
	const specFiles = new Set(
		scannedSpecs.map((spec) => spec.filePath.replaceAll('\\', '/'))
	);
	const sourceFiles = await fs.glob({ pattern: '**/*.{ts,tsx}' });

	for (const file of sourceFiles) {
		if (!isPolicyCandidate(file, specFiles, config)) {
			continue;
		}

		try {
			const content = await fs.readFile(file);
			if (CONTRACT_REFERENCE_PATTERN.test(content)) {
				continue;
			}

			issues.push({
				ruleId: 'policy-contract-first',
				severity: 'error',
				message:
					'Implementation entrypoints in handlers/routes/api must import or reference a ContractSpec contract before shipping behavior.',
				category: 'policy',
				file,
			});
		} catch (error) {
			logger.warn('Policy scan failed for file', {
				file,
				error: error instanceof Error ? error.message : String(error),
			});
		}
	}

	return issues;
}
