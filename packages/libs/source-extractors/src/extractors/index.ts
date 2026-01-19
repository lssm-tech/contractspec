/**
 * Source extractors module.
 *
 * Exports all available framework extractors.
 */

// Base extractor class
export { BaseExtractor } from './base';
export type { ExtractorFsAdapter, ExtractionContext } from './base';

// Framework-specific extractors
export { NestJsExtractor } from './nestjs/extractor';
export { ExpressExtractor } from './express/extractor';
export { FastifyExtractor } from './fastify/extractor';
export { HonoExtractor } from './hono/extractor';
export { ElysiaExtractor } from './elysia/extractor';
export { TrpcExtractor } from './trpc/extractor';
export { NextApiExtractor } from './next-api/extractor';

// Schema extractors
export { ZodSchemaExtractor } from './zod/extractor';

// Registration helper
import { extractorRegistry } from '../registry';
import { NestJsExtractor } from './nestjs/extractor';
import { ExpressExtractor } from './express/extractor';
import { FastifyExtractor } from './fastify/extractor';
import { HonoExtractor } from './hono/extractor';
import { ElysiaExtractor } from './elysia/extractor';
import { TrpcExtractor } from './trpc/extractor';
import { NextApiExtractor } from './next-api/extractor';
import { ZodSchemaExtractor } from './zod/extractor';

/**
 * Register all built-in extractors with the global registry.
 */
export function registerAllExtractors(): void {
  extractorRegistry.register(new NestJsExtractor());
  extractorRegistry.register(new ExpressExtractor());
  extractorRegistry.register(new FastifyExtractor());
  extractorRegistry.register(new HonoExtractor());
  extractorRegistry.register(new ElysiaExtractor());
  extractorRegistry.register(new TrpcExtractor());
  extractorRegistry.register(new NextApiExtractor());
  extractorRegistry.register(new ZodSchemaExtractor());
}
