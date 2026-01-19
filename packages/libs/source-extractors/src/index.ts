/**
 * @contractspec/lib.source-extractors
 *
 * Extract contract candidates from TypeScript source code across multiple frameworks.
 * Produces an Intermediate Representation (IR) that can be converted to ContractSpec definitions.
 *
 * Supported frameworks:
 * - NestJS
 * - Express
 * - Fastify
 * - Hono
 * - Elysia
 * - tRPC
 * - Next.js API Routes
 *
 * @example
 * ```typescript
 * import { extractFromProject, detectFramework } from '@contractspec/lib.source-extractors';
 *
 * const framework = await detectFramework('./my-project');
 * const ir = await extractFromProject('./my-project', { framework });
 * ```
 */

// Core types
export * from './types';

// Extractor registry and detection
export * from './registry';
export * from './detect';

// Main extraction function
export * from './extract';

// Re-export extractors module
export * as extractors from './extractors/index';

// Re-export codegen module
export * as codegen from './codegen/index';
