import type { AppBlueprintSpec } from '@contractspec/lib.contracts-spec/app-config/spec';
import { validateBlueprint as validateBlueprintSpec } from '@contractspec/lib.contracts-spec/app-config/validation';
import { resolve } from 'path';
import type { FsAdapter } from '../../ports/fs';
import { loadAuthoredModule } from '../module-loader';

/**
 * Result of blueprint validation.
 */
export interface BlueprintValidationResult {
	spec?: AppBlueprintSpec;
	report?: ReturnType<typeof validateBlueprintSpec>;
	valid: boolean;
	errors: string[];
}

/**
 * Validate a blueprint spec file.
 */
export async function validateBlueprint(
	blueprintPath: string,
	adapters: { fs: FsAdapter }
): Promise<BlueprintValidationResult> {
	const { fs } = adapters;
	const resolvedPath = resolve(process.cwd(), blueprintPath);

	if (!(await fs.exists(resolvedPath))) {
		return {
			valid: false,
			errors: [`Blueprint file not found: ${resolvedPath}`],
		};
	}

	try {
		const mod = await loadAuthoredModule(resolvedPath);
		const spec = extractBlueprintSpec(mod.exports);
		const report = validateBlueprintSpec(spec);

		return {
			spec,
			report,
			valid: report.valid,
			errors: report.errors.map((e) => `[${e.code}] ${e.path}: ${e.message}`),
		};
	} catch (error) {
		return {
			valid: false,
			errors: [error instanceof Error ? error.message : String(error)],
		};
	}
}

function extractBlueprintSpec(mod: Record<string, unknown>): AppBlueprintSpec {
	const candidates = Object.values(mod).filter(isBlueprintSpec);
	if (candidates.length === 0) {
		throw new Error('Blueprint module does not export an AppBlueprintSpec.');
	}
	return candidates[0] as AppBlueprintSpec;
}

function isBlueprintSpec(value: unknown): value is AppBlueprintSpec {
	return (
		typeof value === 'object' &&
		value !== null &&
		'meta' in value &&
		typeof (value as AppBlueprintSpec).meta?.key === 'string' &&
		typeof (value as AppBlueprintSpec).meta?.version === 'string'
	);
}
