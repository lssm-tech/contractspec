import {
	type BuilderBlueprint,
	type BuilderReadinessReport,
	type BuilderWorkspace,
	type BuilderWorkspaceSnapshot,
	validateBuilderBlueprint,
	validateBuilderReadinessReport,
	validateBuilderWorkspace,
	validateBuilderWorkspaceSnapshot,
} from '@contractspec/lib.builder-spec';
import {
	type ExternalExecutionReceipt,
	type ExternalPatchProposal,
	type ProviderRoutingPolicy,
	type RuntimeTarget,
	validateExternalExecutionReceipt,
	validateExternalPatchProposal,
	validateProviderRoutingPolicy,
	validateRuntimeTarget,
} from '@contractspec/lib.provider-spec';
import {
	type BundleContext,
	type ModuleBundleSpec,
	validateBundleNodeKinds,
	validateLayoutSlots,
} from '@contractspec/lib.surface-runtime/spec';
import type {
	AuthoringTargetId,
	SpecScanResult,
} from '@contractspec/module.workspace';
import type { FsAdapter } from '../../ports/fs';
import { loadAuthoredModule } from '../module-loader';

export interface PackageScaffoldValidationResult {
	valid: boolean;
	errors: string[];
	warnings: string[];
}

export async function validatePackageScaffold(
	spec: SpecScanResult,
	fs: FsAdapter
): Promise<PackageScaffoldValidationResult> {
	if (!isPackageTarget(spec.specType)) {
		return { valid: true, errors: [], warnings: [] };
	}

	const packageRoot = resolvePackageRoot(spec.filePath);
	const requiredFiles = [
		`${packageRoot}/package.json`,
		`${packageRoot}/README.md`,
		`${packageRoot}/src/index.ts`,
		spec.filePath,
	];

	const errors: string[] = [];
	for (const filePath of requiredFiles) {
		if (!(await fs.exists(filePath))) {
			errors.push(`Missing package scaffold file: ${filePath}`);
		}
	}

	if (errors.length > 0) {
		return { valid: false, errors, warnings: [] };
	}

	let moduleExports: Record<string, unknown>;
	try {
		moduleExports = (await loadAuthoredModule(spec.filePath)).exports;
	} catch (error) {
		return {
			valid: false,
			errors: [error instanceof Error ? error.message : String(error)],
			warnings: [],
		};
	}

	const result =
		spec.specType === 'module-bundle'
			? validateModuleBundleExports(moduleExports)
			: spec.specType === 'builder-spec'
				? validateBuilderSpecExports(moduleExports)
				: validateProviderSpecExports(moduleExports);

	return {
		valid: errors.length === 0 && result.errors.length === 0,
		errors: [...errors, ...result.errors],
		warnings: result.warnings.map((warning) => `[${spec.filePath}] ${warning}`),
	};
}

function validateModuleBundleExports(moduleExports: Record<string, unknown>) {
	const errors: string[] = [];
	const warnings: string[] = [];
	const recognized = collectRecognizedExports(
		moduleExports,
		isModuleBundleSpec
	);

	if (recognized.length === 0) {
		warnings.push(warningForUnrecognizedExports('module-bundle', 'bundle'));
		return { errors, warnings };
	}

	for (const exported of recognized) {
		const surfaces = Object.values(exported.value.surfaces);
		for (const surface of surfaces) {
			try {
				validateLayoutSlots(surface);
			} catch (error) {
				errors.push(
					`[${exported.exportName}] ${error instanceof Error ? error.message : String(error)}`
				);
			}
			for (const warning of validateBundleNodeKinds(surface).warnings) {
				warnings.push(`[${exported.exportName}] ${warning}`);
			}
		}
	}

	return { errors, warnings };
}

function validateBuilderSpecExports(moduleExports: Record<string, unknown>) {
	const errors: string[] = [];
	const warnings: string[] = [];
	let recognizedCount = 0;

	for (const [exportName, value] of Object.entries(moduleExports)) {
		if (exportName === '__esModule') {
			continue;
		}

		if (isBuilderWorkspace(value)) {
			recognizedCount += 1;
			errors.push(
				...formatBuilderIssues(exportName, validateBuilderWorkspace(value))
			);
			continue;
		}
		if (isBuilderBlueprint(value)) {
			recognizedCount += 1;
			errors.push(
				...formatBuilderIssues(exportName, validateBuilderBlueprint(value))
			);
			continue;
		}
		if (isBuilderReadinessReport(value)) {
			recognizedCount += 1;
			errors.push(
				...formatBuilderIssues(
					exportName,
					validateBuilderReadinessReport(value)
				)
			);
			continue;
		}
		if (isBuilderWorkspaceSnapshot(value)) {
			recognizedCount += 1;
			errors.push(
				...formatBuilderIssues(
					exportName,
					validateBuilderWorkspaceSnapshot(value)
				)
			);
		}
	}

	if (recognizedCount === 0) {
		warnings.push(warningForUnrecognizedExports('builder-spec', 'builder'));
	}

	return { errors, warnings };
}

function validateProviderSpecExports(moduleExports: Record<string, unknown>) {
	const errors: string[] = [];
	const warnings: string[] = [];
	let recognizedCount = 0;

	for (const [exportName, value] of Object.entries(moduleExports)) {
		if (exportName === '__esModule') {
			continue;
		}

		if (isRuntimeTarget(value)) {
			recognizedCount += 1;
			errors.push(
				...formatProviderIssues(exportName, validateRuntimeTarget(value))
			);
			continue;
		}
		if (isProviderRoutingPolicy(value)) {
			recognizedCount += 1;
			errors.push(
				...formatProviderIssues(
					exportName,
					validateProviderRoutingPolicy(value)
				)
			);
			continue;
		}
		if (isExternalExecutionReceipt(value)) {
			recognizedCount += 1;
			errors.push(
				...formatProviderIssues(
					exportName,
					validateExternalExecutionReceipt(value)
				)
			);
			continue;
		}
		if (isExternalPatchProposal(value)) {
			recognizedCount += 1;
			errors.push(
				...formatProviderIssues(
					exportName,
					validateExternalPatchProposal(value)
				)
			);
		}
	}

	if (recognizedCount === 0) {
		warnings.push(warningForUnrecognizedExports('provider-spec', 'provider'));
	}

	return { errors, warnings };
}

function collectRecognizedExports<T>(
	moduleExports: Record<string, unknown>,
	guard: (value: unknown) => value is T
) {
	return Object.entries(moduleExports)
		.filter(
			([exportName, value]) => exportName !== '__esModule' && guard(value)
		)
		.map(([exportName, value]) => ({ exportName, value: value as T }));
}

function formatBuilderIssues(
	exportName: string,
	issues: Array<{ path: string; message: string }>
) {
	return issues.map(
		(issue) => `[${exportName}] ${issue.path}: ${issue.message}`
	);
}

function formatProviderIssues(
	exportName: string,
	issues: Array<{ path: string; message: string }>
) {
	return issues.map(
		(issue) => `[${exportName}] ${issue.path}: ${issue.message}`
	);
}

function isPackageTarget(
	specType: SpecScanResult['specType']
): specType is Extract<
	AuthoringTargetId,
	'module-bundle' | 'builder-spec' | 'provider-spec'
> {
	return (
		specType === 'module-bundle' ||
		specType === 'builder-spec' ||
		specType === 'provider-spec'
	);
}

function isModuleBundleSpec(
	value: unknown
): value is ModuleBundleSpec<BundleContext> {
	return (
		typeof value === 'object' &&
		value !== null &&
		'meta' in value &&
		'routes' in value &&
		Array.isArray((value as ModuleBundleSpec).routes) &&
		'surfaces' in value &&
		typeof (value as ModuleBundleSpec).surfaces === 'object'
	);
}

function isBuilderWorkspace(value: unknown): value is BuilderWorkspace {
	return (
		typeof value === 'object' &&
		value !== null &&
		'tenantId' in value &&
		'defaultLocale' in value &&
		Array.isArray((value as BuilderWorkspace).ownerIds)
	);
}

function isBuilderBlueprint(value: unknown): value is BuilderBlueprint {
	return (
		typeof value === 'object' &&
		value !== null &&
		'appBrief' in value &&
		'coverageReport' in value &&
		Array.isArray((value as BuilderBlueprint).runtimeProfiles)
	);
}

function isBuilderReadinessReport(
	value: unknown
): value is BuilderReadinessReport {
	return (
		typeof value === 'object' &&
		value !== null &&
		'score' in value &&
		'recommendedNextAction' in value &&
		'evidenceBundleRef' in value
	);
}

function isBuilderWorkspaceSnapshot(
	value: unknown
): value is BuilderWorkspaceSnapshot {
	return (
		typeof value === 'object' &&
		value !== null &&
		'workspace' in value &&
		'stableMemory' in value &&
		'workingMemory' in value
	);
}

function isRuntimeTarget(value: unknown): value is RuntimeTarget {
	return (
		typeof value === 'object' &&
		value !== null &&
		'displayName' in value &&
		'capabilityProfile' in value &&
		Array.isArray((value as RuntimeTarget).capabilityProfile.availableProviders)
	);
}

function isProviderRoutingPolicy(
	value: unknown
): value is ProviderRoutingPolicy {
	return (
		typeof value === 'object' &&
		value !== null &&
		'taskRules' in value &&
		'riskRules' in value &&
		'runtimeModeRules' in value
	);
}

function isExternalExecutionReceipt(
	value: unknown
): value is ExternalExecutionReceipt {
	return (
		typeof value === 'object' &&
		value !== null &&
		'runId' in value &&
		'providerId' in value &&
		'contextBundleId' in value
	);
}

function isExternalPatchProposal(
	value: unknown
): value is ExternalPatchProposal {
	return (
		typeof value === 'object' &&
		value !== null &&
		'diffHash' in value &&
		'changedAreas' in value &&
		'verificationRequirements' in value
	);
}

function resolvePackageRoot(specPath: string) {
	const normalized = specPath.replaceAll('\\', '/');
	const markerIndex = normalized.lastIndexOf('/src/');
	return markerIndex === -1
		? normalized.replace(/\/[^/]+$/, '')
		: normalized.slice(0, markerIndex);
}

function warningForUnrecognizedExports(
	targetType: 'module-bundle' | 'builder-spec' | 'provider-spec',
	kind: string
) {
	return `No recognized ${kind} exports were found for ${targetType} deep validation.`;
}
