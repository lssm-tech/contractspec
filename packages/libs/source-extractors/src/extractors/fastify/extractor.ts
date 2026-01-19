/**
 * Fastify extractor.
 *
 * Extracts contract candidates from Fastify applications by parsing:
 * - fastify.get(), fastify.post(), etc. route handlers
 * - JSON Schema definitions
 * - Route options with schema
 */

import { BaseExtractor, type ExtractionContext } from '../base';
import type { EndpointCandidate, HttpMethod } from '../../types';

const PATTERNS = {
  route:
    /(?:fastify|app|server)\.(get|post|put|patch|delete|head|options)\s*\(\s*['"`]([^'"`]+)['"`]/gi,
  schemaOption: /schema\s*:\s*\{/g,
  bodySchema: /body\s*:\s*(\w+)/g,
  responseSchema: /response\s*:\s*\{/g,
};

export class FastifyExtractor extends BaseExtractor {
  id = 'fastify';
  name = 'Fastify Extractor';
  frameworks = ['fastify'];
  priority = 15;

  protected async doExtract(ctx: ExtractionContext): Promise<void> {
    const { project, options, fs } = ctx;

    const pattern = options.scope?.length
      ? options.scope.map((s) => `${s}/**/*.ts`).join(',')
      : '**/*.ts';

    const files = await fs.glob(pattern, { cwd: project.rootPath });
    ctx.ir.stats.filesScanned = files.length;

    for (const file of files) {
      if (file.includes('node_modules') || file.includes('.test.')) continue;

      const fullPath = `${project.rootPath}/${file}`;
      const content = await fs.readFile(fullPath);

      await this.extractRoutes(ctx, file, content);
    }
  }

  private async extractRoutes(
    ctx: ExtractionContext,
    file: string,
    content: string
  ): Promise<void> {
    const matches = [...content.matchAll(PATTERNS.route)];

    for (const match of matches) {
      const method = (match[1]?.toUpperCase() ?? 'GET') as HttpMethod;
      const path = match[2] ?? '/';
      const index = match.index ?? 0;
      const lineNumber = content.slice(0, index).split('\n').length;

      const afterMatch = content.slice(index, index + 1000);
      const hasSchema = PATTERNS.schemaOption.test(afterMatch);

      const endpoint: EndpointCandidate = {
        id: this.generateEndpointId(method, path),
        method,
        path,
        kind: this.methodToOpKind(method),
        handlerName: 'handler',
        source: this.createLocation(file, lineNumber, lineNumber + 10),
        confidence: this.createConfidence(
          hasSchema ? 'high' : 'medium',
          hasSchema ? 'explicit-schema' : 'decorator-hints'
        ),
        frameworkMeta: { hasSchema },
      };

      this.addEndpoint(ctx, endpoint);
    }
  }
}
