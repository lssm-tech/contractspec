import { resolve } from 'path';
import { pathToFileURL } from 'url';
import {
  validateBlueprint as validateBlueprintSpec,
  type AppBlueprintSpec,
} from '@contractspec/lib.contracts';
import type { FsAdapter } from '../../ports/fs';

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
    const mod = await loadModule(resolvedPath);
    const spec = extractBlueprintSpec(mod);
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

async function loadModule(
  modulePath: string
): Promise<Record<string, unknown>> {
  try {
    const url = pathToFileURL(modulePath).href;
    // Using native import which works with Bun and Node (if configured)
    const mod = await import(url);
    return mod;
  } catch (error) {
    throw new Error(`Failed to load module at ${modulePath}: ${error}`);
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
