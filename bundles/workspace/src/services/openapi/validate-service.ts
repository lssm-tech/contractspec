/**
 * OpenAPI validation service - validates specs against OpenAPI sources.
 */

import {
  parseOpenApi,
  type ParsedOperation,
} from '@contractspec/lib.contracts-transformers/openapi';
import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';
import type {
  OpenApiValidateServiceOptions,
  OpenApiValidateServiceResult,
} from './types';

/**
 * Validate ContractSpec specs against an OpenAPI source.
 */
export async function validateAgainstOpenApiService(
  options: OpenApiValidateServiceOptions,
  adapters: { fs: FsAdapter; logger: LoggerAdapter }
): Promise<OpenApiValidateServiceResult> {
  const { fs, logger } = adapters;
  const {
    specPath,
    openApiSource,
    ignoreDescriptions: _ignoreDescriptions,
    ignoreTags: _ignoreTags,
    ignoreTransport,
  } = options;

  logger.info(`Validating specs against OpenAPI: ${openApiSource}`);

  // Parse the OpenAPI document
  const parseResult = await parseOpenApi(openApiSource, {
    fetch: globalThis.fetch,
    readFile: (path) => fs.readFile(path),
  });

  logger.info(
    `Parsed ${parseResult.operations.length} operations from ${parseResult.info.title}`
  );

  // Build a map of operations by operationId
  const operationsMap = new Map<string, ParsedOperation>();
  for (const op of parseResult.operations) {
    operationsMap.set(op.operationId, op);
  }

  const results: OpenApiValidateServiceResult['results'] = [];
  let specsValidated = 0;
  let specsWithDiffs = 0;

  // Check if specPath is a directory or file
  const stat = await fs.stat(specPath);
  const specFiles: string[] = [];

  if (stat.isDirectory) {
    // Find all spec files in directory
    const files = await fs.glob({
      pattern: '**/*.ts',
      cwd: specPath,
      ignore: ['node_modules/**', 'dist/**', '*.test.ts', '*.spec.ts'],
      absolute: true,
    });
    specFiles.push(...files);
  } else {
    specFiles.push(specPath);
  }

  logger.info(`Found ${specFiles.length} spec files to validate`);

  for (const file of specFiles) {
    try {
      // Read the spec file
      const content = await fs.readFile(file);

      // Try to extract operationId from the spec file
      // Look for x-contractspec metadata or transport.rest.path
      const operationIdMatch =
        content.match(/operationId:\s*['"]([^'"]+)['"]/) ||
        content.match(/name:\s*['"]([^'"]+)['"]/) ||
        content.match(/export\s+const\s+(\w+)Spec\s*=/);

      if (!operationIdMatch || !operationIdMatch[1]) {
        logger.debug(`Could not extract operationId from ${file}`);
        continue;
      }

      const specName: string = operationIdMatch[1];
      specsValidated++;

      // Try to find matching OpenAPI operation
      // Match by operationId or by similar naming
      let matchingOp: ParsedOperation | undefined;

      // Direct match
      matchingOp = operationsMap.get(specName);

      // Try variations if no direct match
      if (!matchingOp) {
        // Try camelCase to snake_case
        const snakeName = specName.replace(/([A-Z])/g, '_$1').toLowerCase();
        matchingOp = operationsMap.get(snakeName);
      }

      if (!matchingOp) {
        // Try matching by partial name
        for (const [opId, op] of operationsMap) {
          if (
            opId.toLowerCase().includes(specName.toLowerCase()) ||
            specName.toLowerCase().includes(opId.toLowerCase())
          ) {
            matchingOp = op;
            break;
          }
        }
      }

      if (!matchingOp) {
        results.push({
          specPath: file,
          valid: false,
          diffs: [
            {
              path: '',
              type: 'removed',
              description: `No matching operation found in OpenAPI for spec: ${specName}`,
            },
          ],
        });
        specsWithDiffs++;
        continue;
      }

      // For now, we'll do a basic validation
      // In a full implementation, we would load the actual spec and compare
      const diffs: OpenApiValidateServiceResult['results'][0]['diffs'] = [];

      // Check if spec mentions deprecated when OpenAPI says deprecated
      if (matchingOp.deprecated && !content.includes('deprecated')) {
        diffs.push({
          path: 'meta.stability',
          type: 'modified',
          description:
            'OpenAPI operation is deprecated but spec does not indicate deprecation',
        });
      }

      // Check path match
      if (!ignoreTransport) {
        const pathMatch = content.match(/path:\s*['"]([^'"]+)['"]/);
        if (pathMatch && pathMatch[1] !== matchingOp.path) {
          diffs.push({
            path: 'transport.rest.path',
            type: 'modified',
            description: `Path mismatch: spec has "${pathMatch[1]}", OpenAPI has "${matchingOp.path}"`,
          });
        }
      }

      // Check method match
      if (!ignoreTransport) {
        const methodMatch = content.match(/method:\s*['"]([^'"]+)['"]/);
        if (
          methodMatch?.[1] &&
          methodMatch[1].toLowerCase() !== matchingOp.method.toLowerCase()
        ) {
          diffs.push({
            path: 'transport.rest.method',
            type: 'modified',
            description: `Method mismatch: spec has "${methodMatch[1]}", OpenAPI has "${matchingOp.method.toUpperCase()}"`,
          });
        }
      }

      const valid = diffs.length === 0;
      if (!valid) {
        specsWithDiffs++;
      }

      results.push({
        specPath: file,
        operationId: matchingOp.operationId,
        valid,
        diffs,
      });
    } catch (error) {
      logger.error(`Error validating ${file}: ${error}`);
      results.push({
        specPath: file,
        valid: false,
        diffs: [
          {
            path: '',
            type: 'modified',
            description: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      });
      specsWithDiffs++;
    }
  }

  const valid = specsWithDiffs === 0;

  logger.info(
    `Validation ${valid ? 'passed' : 'failed'}: ${specsValidated} specs checked, ${specsWithDiffs} with differences`
  );

  return {
    valid,
    specsValidated,
    specsWithDiffs,
    results,
  };
}
