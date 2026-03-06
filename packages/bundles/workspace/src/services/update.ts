/**
 * Update spec service.
 *
 * Reads an existing spec file, applies field-level patches or
 * full-content replacement, re-validates, and writes back.
 */

import { scanSpecSource, type SpecScanResult } from "@contractspec/module.workspace";
import type { FsAdapter } from "../ports/fs";
import type { LoggerAdapter } from "../ports/logger";
import { validateSpec } from "./validate/spec-validator";

function unknownSpecResult(filePath: string): SpecScanResult {
  return {
    specType: "unknown",
    filePath,
    hasMeta: false,
    hasIo: false,
    hasPolicy: false,
    hasPayload: false,
    hasContent: false,
    hasDefinition: false,
  };
}

/**
 * A single field patch: dot-path key and the replacement source text.
 *
 * Example: `{ key: "meta.stability", value: "stable" }`
 * replaces the `stability: '...'` value in the `meta` block.
 */
export interface SpecFieldPatch {
  key: string;
  value: string;
}

export interface UpdateSpecOptions {
  /** Replace spec file content entirely. */
  content?: string;
  /** Apply individual field patches (ignored when `content` is set). */
  fields?: SpecFieldPatch[];
  /** Skip post-update validation. */
  skipValidation?: boolean;
  /** Write even when validation produces warnings. */
  allowWarnings?: boolean;
}

export interface UpdateSpecResult {
  specPath: string;
  specInfo: SpecScanResult;
  updated: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Update an existing spec file.
 */
export async function updateSpec(
  specPath: string,
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  options: UpdateSpecOptions = {},
): Promise<UpdateSpecResult> {
  const { fs, logger } = adapters;

  const exists = await fs.exists(specPath);
  if (!exists) {
    return {
      specPath,
      specInfo: unknownSpecResult(specPath),
      updated: false,
      errors: [`Spec file not found: ${specPath}`],
      warnings: [],
    };
  }

  const originalCode = await fs.readFile(specPath);
  let updatedCode: string;

  if (options.content !== undefined) {
    updatedCode = options.content;
  } else if (options.fields?.length) {
    updatedCode = applyFieldPatches(originalCode, options.fields);
  } else {
    return {
      specPath,
      specInfo: scanSpecSource(originalCode, specPath),
      updated: false,
      errors: ["No update provided: supply `content` or `fields`"],
      warnings: [],
    };
  }

  if (!options.skipValidation) {
    await fs.writeFile(specPath, updatedCode);

    const validation = await validateSpec(specPath, adapters);

    if (validation.errors.length > 0) {
      await fs.writeFile(specPath, originalCode);
      return {
        specPath,
        specInfo: scanSpecSource(updatedCode, specPath),
        updated: false,
        errors: validation.errors,
        warnings: validation.warnings,
      };
    }

    if (validation.warnings.length > 0 && !options.allowWarnings) {
      await fs.writeFile(specPath, originalCode);
      return {
        specPath,
        specInfo: scanSpecSource(updatedCode, specPath),
        updated: false,
        errors: ["Validation produced warnings (use allowWarnings to override)"],
        warnings: validation.warnings,
      };
    }

    logger.info(`Updated spec: ${specPath}`);
    return {
      specPath,
      specInfo: scanSpecSource(updatedCode, specPath),
      updated: true,
      errors: [],
      warnings: validation.warnings,
    };
  }

  await fs.writeFile(specPath, updatedCode);
  logger.info(`Updated spec (validation skipped): ${specPath}`);

  return {
    specPath,
    specInfo: scanSpecSource(updatedCode, specPath),
    updated: true,
    errors: [],
    warnings: [],
  };
}

/**
 * Apply field-level patches to spec source code using simple text replacement.
 *
 * Handles common patterns like `stability: "beta"` or `key: "foo.bar"`.
 */
function applyFieldPatches(code: string, fields: SpecFieldPatch[]): string {
  let result = code;

  for (const { key, value } of fields) {
    const fieldName = key.includes(".") ? key.split(".").pop() : key;
    if (!fieldName) continue;

    const pattern = new RegExp(
      `(${escapeRegex(fieldName)}\\s*:\\s*)(['"\`])([^'"\`]*?)\\2`,
      "g",
    );

    const needsQuotes = !/^(true|false|\d+(\.\d+)?)$/.test(value);
    const replacement = needsQuotes ? `$1"${value}"` : `$1${value}`;

    result = result.replace(pattern, replacement);
  }

  return result;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
