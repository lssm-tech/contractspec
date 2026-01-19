/**
 * Hono extractor.
 *
 * Extracts contract candidates from Hono applications by parsing:
 * - app.get(), app.post(), etc. route handlers
 * - Zod validator middleware
 */

import { BaseExtractor, type ExtractionContext } from '../base';
import type { EndpointCandidate, HttpMethod } from '../../types';

const PATTERNS = {
  route:
    /(?:app|hono)\.(get|post|put|patch|delete|all)\s*\(\s*['"`]([^'"`]+)['"`]/gi,
  zodValidator: /zValidator\s*\(\s*['"`](\w+)['"`]\s*,\s*(\w+)/g,
};

export class HonoExtractor extends BaseExtractor {
  id = 'hono';
  name = 'Hono Extractor';
  frameworks = ['hono'];
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

      const afterMatch = content.slice(index, index + 500);
      const hasZodValidator = PATTERNS.zodValidator.test(afterMatch);

      const endpoint: EndpointCandidate = {
        id: this.generateEndpointId(method, path),
        method,
        path,
        kind: this.methodToOpKind(method),
        handlerName: 'handler',
        source: this.createLocation(file, lineNumber, lineNumber + 5),
        confidence: this.createConfidence(
          hasZodValidator ? 'high' : 'medium',
          hasZodValidator ? 'explicit-schema' : 'decorator-hints'
        ),
      };

      this.addEndpoint(ctx, endpoint);
    }
  }
}
