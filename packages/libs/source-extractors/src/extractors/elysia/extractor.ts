/**
 * Elysia extractor.
 *
 * Extracts contract candidates from Elysia applications by parsing:
 * - app.get(), app.post(), etc. route handlers
 * - t.* schema definitions
 */

import { BaseExtractor, type ExtractionContext } from '../base';
import type { EndpointCandidate, HttpMethod } from '../../types';

const PATTERNS = {
  route: /\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/gi,
  tSchema: /body:\s*t\.\w+/g,
};

export class ElysiaExtractor extends BaseExtractor {
  id = 'elysia';
  name = 'Elysia Extractor';
  frameworks = ['elysia'];
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

      if (!content.includes('elysia')) continue;

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

      const afterMatch = content.slice(index, index + 500);
      const hasTSchema = PATTERNS.tSchema.test(afterMatch);

      const endpoint: EndpointCandidate = {
        id: this.generateEndpointId(method, path),
        method,
        path,
        kind: this.methodToOpKind(method),
        handlerName: 'handler',
        source: this.createLocation(file, lineNumber, lineNumber + 5),
        confidence: this.createConfidence(
          hasTSchema ? 'high' : 'medium',
          hasTSchema ? 'explicit-schema' : 'decorator-hints'
        ),
      };

      this.addEndpoint(ctx, endpoint);
    }
  }
}
