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
import {
	auditPackageDeclarations,
	createPackageDeclarationIssue,
	resolvePackageDeclarationConfig,
} from '../../package-declarations';
import type { CICheckOptions, CIIssue } from '../types';

const IMPLEMENTATION_PATH_PATTERN =
	/(^|\/)(handlers?|routes?|controllers?|api)(\/|$)|\.(handler|handlers|route|routes|controller)\.(ts|tsx)$/i;

const CONTRACT_REFERENCE_PATTERN =
	/@contractspec\/lib\.contracts(?:-spec|-integrations)?|define(Command|Query|Event|Feature|Presentation|Capability|Form|DataView|Integration)|OperationSpecRegistry|ContractHandler|installOp|contracts\b|['"][^'"]+\.(operation|event|presentation|feature|capability|form|test-spec)(?:\.[tj]sx?)?['"]/;

const CONTRACT_CONTEXT_PATTERN =
	/@contractspec\/(?:lib\.contracts(?:-spec|-integrations)?|module\.ai-chat|bundle\.library\/application\/mcp|example\.)|['"][^'"]+\.(operation|event|presentation|feature|capability|form|test-spec)(?:\.[tj]sx?)?['"]/;

const SUPPORT_FILE_PATTERN =
	/(^|\/)(index|types)\.ts$|\.types\.ts$|\.storage\.ts$|(?:^|\/)[^/]*\.(resolver|scheduler)\.ts$|(?:^|\/)[^/]*(factory|resources|mock-data)\.ts$/i;

const FIXTURE_PATH_PATTERN = /(^|\/)(__fixtures__|fixtures)(\/|$)/i;

const WORKSPACE_PACKAGE_ROOT_PATTERN =
	/^(.*\/packages\/(?:apps|apps-registry|bundles|examples|integrations|libs|modules|tools)\/[^/]+)(?:\/|$)/i;

const PACKAGE_ROOT_POLICY_CONTEXT_PATTERN =
	/\/packages\/(?:apps|apps-registry|bundles|modules)\//i;

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
		FIXTURE_PATH_PATTERN.test(normalized) ||
		SUPPORT_FILE_PATTERN.test(normalized) ||
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

function getWorkspacePackageRoot(filePath: string): string | null {
	const normalized = filePath.replaceAll('\\', '/');
	const match = normalized.match(WORKSPACE_PACKAGE_ROOT_PATTERN);
	return match?.[1] ?? null;
}

function isBarrelFile(content: string): boolean {
	const meaningfulLines = content
		.split('\n')
		.map((line) => line.trim())
		.filter(
			(line) =>
				line.length > 0 &&
				!line.startsWith('//') &&
				!line.startsWith('/*') &&
				!line.startsWith('*') &&
				!line.startsWith('*/')
		);

	return (
		meaningfulLines.length > 0 &&
		meaningfulLines.every(
			(line) =>
				line.startsWith('import ') ||
				line.startsWith('export *') ||
				line.startsWith('export {') ||
				line.startsWith('export type {') ||
				line === "'use client';" ||
				line === '"use client";' ||
				line === "'use server';" ||
				line === '"use server";'
		)
	);
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
	const packageDeclarationConfig = resolvePackageDeclarationConfig(config);

	const scannedSpecs = await listSpecs({ fs }, { config });
	const specFiles = new Set(
		scannedSpecs.map((spec) => spec.filePath.replaceAll('\\', '/'))
	);
	const packageRootsWithSpecs = new Set(
		scannedSpecs
			.map((spec) => getWorkspacePackageRoot(spec.filePath))
			.filter((root): root is string => Boolean(root))
	);
	const sourceFiles = await fs.glob({ pattern: '**/*.{ts,tsx}' });

	for (const file of sourceFiles) {
		if (!isPolicyCandidate(file, specFiles, config)) {
			continue;
		}

		try {
			const content = await fs.readFile(file);
			if (isBarrelFile(content)) {
				continue;
			}

			const packageRoot = getWorkspacePackageRoot(file);
			const hasLocalSpecContext =
				packageRoot !== null &&
				PACKAGE_ROOT_POLICY_CONTEXT_PATTERN.test(packageRoot) &&
				packageRootsWithSpecs.has(packageRoot);
			if (!hasLocalSpecContext && !CONTRACT_CONTEXT_PATTERN.test(content)) {
				continue;
			}

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

	if (packageDeclarationConfig.severity !== 'off') {
		const packageDeclarations = await auditPackageDeclarations(fs, {
			config,
			workspaceRoot: options.workspaceRoot,
		});

		for (const declaration of packageDeclarations) {
			if (declaration.exists && declaration.matchesExpectedTarget) {
				continue;
			}

			const issue = createPackageDeclarationIssue(
				declaration,
				packageDeclarationConfig.allowMissing ?? []
			);
			issues.push({
				ruleId: 'policy-package-declaration',
				severity:
					issue.allowlisted || packageDeclarationConfig.severity === 'warning'
						? 'warning'
						: 'error',
				message: issue.message,
				category: 'policy',
				file: declaration.canonicalDeclarationPath,
				context: {
					allowlisted: issue.allowlisted,
					expectedTarget: declaration.target,
					packageName: declaration.packageName,
					packageRoot: declaration.relativePackageRoot,
				},
			});
		}
	}

	return issues;
}
