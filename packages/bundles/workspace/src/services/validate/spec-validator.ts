/**
 * Validation service.
 */

import type { AppBlueprintSpec } from '@contractspec/lib.contracts-spec/app-config/spec';
import { validateBlueprint as validateBlueprintSpec } from '@contractspec/lib.contracts-spec/app-config/validation';
import type { FeatureModuleSpec } from '@contractspec/lib.contracts-spec/features';
import { validateFeatureSpec } from '@contractspec/lib.contracts-spec/features';
import type { ThemeSpec } from '@contractspec/lib.contracts-spec/themes';
import { validateThemeSpec } from '@contractspec/lib.contracts-spec/themes';
import {
	type SpecScanResult,
	type ValidationResult,
	validateSpecStructure,
} from '@contractspec/module.workspace';
import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';
import { listSpecs } from '../list';
import { loadAuthoredModule } from '../module-loader';

/**
 * Options for spec validation.
 */
export interface ValidateSpecOptions {
	/**
	 * Skip spec structure validation (e.g., for blueprint files).
	 */
	skipStructure?: boolean;
}

/**
 * Result of spec validation.
 */
export interface ValidateSpecResult {
	valid: boolean;
	structureResult?: ValidationResult;
	errors: string[];
	warnings: string[];
	code?: string;
}

export interface DiscoveredSpecValidationResult extends ValidateSpecResult {
	spec: SpecScanResult;
}

export async function validateScannedSpec(
	spec: SpecScanResult,
	options: ValidateSpecOptions = {}
): Promise<ValidateSpecResult> {
	const allErrors: string[] = [];
	const allWarnings: string[] = [];
	let structureResult: ValidationResult | undefined;

	if (!options.skipStructure) {
		structureResult = validateSpecStructure(spec);
		allErrors.push(...structureResult.errors);
		allWarnings.push(...structureResult.warnings);

		const authoredValidation = await validateAuthoredSpec(spec);
		allErrors.push(...authoredValidation.errors);
		allWarnings.push(...authoredValidation.warnings);
	}

	return {
		valid: allErrors.length === 0,
		structureResult,
		errors: allErrors,
		warnings: allWarnings,
		code: spec.sourceBlock,
	};
}

export async function validateDiscoveredSpecs(
	specs: SpecScanResult[],
	options: ValidateSpecOptions = {}
): Promise<DiscoveredSpecValidationResult[]> {
	return Promise.all(
		specs.map(async (spec) => ({
			spec,
			...(await validateScannedSpec(spec, options)),
		}))
	);
}

/**
 * Validate a spec file.
 */
export async function validateSpec(
	specFilePath: string,
	adapters: { fs: FsAdapter; logger: LoggerAdapter },
	options: ValidateSpecOptions = {}
): Promise<ValidateSpecResult> {
	const { fs } = adapters;

	const exists = await fs.exists(specFilePath);
	if (!exists) {
		return {
			valid: false,
			errors: [`Spec file not found: ${specFilePath}`],
			warnings: [],
			code: undefined,
		};
	}

	const specCode = await fs.readFile(specFilePath);

	const allErrors: string[] = [];
	const allWarnings: string[] = [];
	let structureResult: ValidationResult | undefined = undefined;

	if (!options.skipStructure) {
		const specFiles = await listSpecs(adapters, { pattern: specFilePath });
		for (const specFile of specFiles) {
			const result = await validateScannedSpec(specFile, options);
			structureResult = result.structureResult;
			allErrors.push(...result.errors);
			allWarnings.push(...result.warnings);
		}
	}

	return {
		valid: allErrors.length === 0,
		structureResult,
		errors: allErrors,
		warnings: allWarnings,
		code: specCode,
	};
}

/**
 * Validate multiple spec files.
 */
export async function validateSpecs(
	specFiles: string[],
	adapters: { fs: FsAdapter; logger: LoggerAdapter },
	options: ValidateSpecOptions = {}
): Promise<Map<string, ValidateSpecResult>> {
	const results = new Map<string, ValidateSpecResult>();

	for (const specFile of specFiles) {
		const result = await validateSpec(specFile, adapters, options);
		results.set(specFile, result);
	}

	return results;
}

async function validateAuthoredSpec(
	spec: SpecScanResult
): Promise<Pick<ValidateSpecResult, 'errors' | 'warnings'>> {
	if (
		spec.specType !== 'app-config' &&
		spec.specType !== 'feature' &&
		spec.specType !== 'theme'
	) {
		return { errors: [], warnings: [] };
	}

	try {
		const loaded = await loadAuthoredModule(spec.filePath);
		if (spec.specType === 'app-config') {
			const blueprint = extractBlueprintSpec(loaded.exports, spec);
			const result = validateBlueprintSpec(blueprint);
			return {
				errors: result.errors.map((issue) => formatIssue(issue)),
				warnings: [...result.warnings, ...result.info].map((issue) =>
					formatIssue(issue)
				),
			};
		}

		if (spec.specType === 'feature') {
			const feature = extractFeatureSpec(loaded.exports, spec);
			const result = validateFeatureSpec(feature);
			return {
				errors: result.issues
					.filter((issue) => issue.level === 'error')
					.map((issue) => formatAuthoredIssue(issue)),
				warnings: result.issues
					.filter((issue) => issue.level !== 'error')
					.map((issue) => formatAuthoredIssue(issue)),
			};
		}

		const theme = extractThemeSpec(loaded.exports, spec);
		const result = validateThemeSpec(theme);
		return {
			errors: result.issues
				.filter((issue) => issue.level === 'error')
				.map((issue) => formatAuthoredIssue(issue)),
			warnings: result.issues
				.filter((issue) => issue.level !== 'error')
				.map((issue) => formatAuthoredIssue(issue)),
		};
	} catch (error) {
		return {
			errors: [
				error instanceof Error
					? error.message
					: `Validation failed: ${String(error)}`,
			],
			warnings: [],
		};
	}
}

function extractBlueprintSpec(
	exports: Record<string, unknown>,
	spec: Pick<SpecScanResult, 'exportName'>
): AppBlueprintSpec {
	return extractExportedValue(exports, spec.exportName, isBlueprintSpec);
}

function extractFeatureSpec(
	exports: Record<string, unknown>,
	spec: Pick<SpecScanResult, 'exportName'>
): FeatureModuleSpec {
	return extractExportedValue(exports, spec.exportName, isFeatureSpec);
}

function extractThemeSpec(
	exports: Record<string, unknown>,
	spec: Pick<SpecScanResult, 'exportName'>
): ThemeSpec {
	return extractExportedValue(exports, spec.exportName, isThemeSpec);
}

function extractExportedValue<T>(
	exports: Record<string, unknown>,
	exportName: string | undefined,
	isTarget: (value: unknown) => value is T
): T {
	if (exportName && isTarget(exports[exportName])) {
		return exports[exportName];
	}

	const candidate = Object.values(exports).find(isTarget);
	if (!candidate) {
		throw new Error(
			'Expected authored module to export a compatible spec value.'
		);
	}
	return candidate;
}

function isBlueprintSpec(value: unknown): value is AppBlueprintSpec {
	return (
		typeof value === 'object' &&
		value !== null &&
		'meta' in value &&
		typeof (value as AppBlueprintSpec).meta?.key === 'string' &&
		typeof (value as AppBlueprintSpec).meta?.version === 'string' &&
		typeof (value as AppBlueprintSpec).meta?.appId === 'string'
	);
}

function isFeatureSpec(value: unknown): value is FeatureModuleSpec {
	return (
		typeof value === 'object' &&
		value !== null &&
		'meta' in value &&
		typeof (value as FeatureModuleSpec).meta?.key === 'string' &&
		typeof (value as FeatureModuleSpec).meta?.version === 'string'
	);
}

function isThemeSpec(value: unknown): value is ThemeSpec {
	return (
		typeof value === 'object' &&
		value !== null &&
		'meta' in value &&
		typeof (value as ThemeSpec).meta?.key === 'string' &&
		typeof (value as ThemeSpec).meta?.version === 'string' &&
		'tokens' in value
	);
}

function formatIssue(issue: {
	code?: string;
	path?: string;
	message: string;
}): string {
	const code = issue.code ? `[${issue.code}] ` : '';
	const path = issue.path ? `${issue.path}: ` : '';
	return `${code}${path}${issue.message}`;
}

function formatAuthoredIssue(issue: {
	path?: string;
	message: string;
}): string {
	return issue.path ? `${issue.path}: ${issue.message}` : issue.message;
}
