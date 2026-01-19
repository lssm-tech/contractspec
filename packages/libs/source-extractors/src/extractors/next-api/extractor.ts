/**
 * Next.js API Routes extractor.
 *
 * Extracts contract candidates from Next.js applications by parsing:
 * - App Router API routes (app/api/.../route.ts)
 * - Pages Router API routes (pages/api/.../*.ts)
 */

import { BaseExtractor, type ExtractionContext } from '../base';
import type { EndpointCandidate, HttpMethod } from '../../types';

const PATTERNS = {
  appRouterExport:
    /export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)/gi,
  pagesHandler: /export\s+default\s+(?:async\s+)?function/g,
  zodSchema: /z\.\w+\(/g,
};

export class NextApiExtractor extends BaseExtractor {
  id = 'next-api';
  name = 'Next.js API Extractor';
  frameworks = ['next-api'];
  priority = 15;

  protected async doExtract(ctx: ExtractionContext): Promise<void> {
    const { project, fs } = ctx;

    // Find App Router API routes
    const appRoutes = await fs.glob('**/app/api/**/route.ts', {
      cwd: project.rootPath,
    });
    // Find Pages Router API routes
    const pagesRoutes = await fs.glob('**/pages/api/**/*.ts', {
      cwd: project.rootPath,
    });

    const allRoutes = [...appRoutes, ...pagesRoutes];
    ctx.ir.stats.filesScanned = allRoutes.length;

    for (const file of allRoutes) {
      const fullPath = `${project.rootPath}/${file}`;
      const content = await fs.readFile(fullPath);

      if (file.includes('/app/api/')) {
        await this.extractAppRoutes(ctx, file, content);
      } else {
        await this.extractPagesRoutes(ctx, file, content);
      }
    }
  }

  private async extractAppRoutes(
    ctx: ExtractionContext,
    file: string,
    content: string
  ): Promise<void> {
    // Derive path from file path
    const pathMatch = file.match(/app\/api\/(.+)\/route\.ts$/);
    const routePath = pathMatch ? `/api/${pathMatch[1]}` : '/api';

    const matches = [...content.matchAll(PATTERNS.appRouterExport)];

    for (const match of matches) {
      const method = (match[1]?.toUpperCase() ?? 'GET') as HttpMethod;
      const index = match.index ?? 0;
      const lineNumber = content.slice(0, index).split('\n').length;

      const hasZod = PATTERNS.zodSchema.test(content);

      const endpoint: EndpointCandidate = {
        id: this.generateEndpointId(method, routePath),
        method,
        path: routePath.replace(/\[(\w+)\]/g, ':$1'),
        kind: this.methodToOpKind(method),
        handlerName: method,
        source: this.createLocation(file, lineNumber, lineNumber + 10),
        confidence: this.createConfidence(
          hasZod ? 'high' : 'medium',
          hasZod ? 'explicit-schema' : 'inferred-types'
        ),
        frameworkMeta: { routeType: 'app-router' },
      };

      this.addEndpoint(ctx, endpoint);
    }
  }

  private async extractPagesRoutes(
    ctx: ExtractionContext,
    file: string,
    content: string
  ): Promise<void> {
    const pathMatch = file.match(/pages\/api\/(.+)\.ts$/);
    const routePath = pathMatch ? `/api/${pathMatch[1]}` : '/api';

    if (!PATTERNS.pagesHandler.test(content)) return;

    const lineNumber = 1;
    const _hasZod = PATTERNS.zodSchema.test(content);

    // Pages API routes can handle multiple methods
    const methods: HttpMethod[] = ['GET', 'POST'];

    for (const method of methods) {
      const endpoint: EndpointCandidate = {
        id: this.generateEndpointId(method, routePath),
        method,
        path: routePath.replace(/\[(\w+)\]/g, ':$1'),
        kind: this.methodToOpKind(method),
        handlerName: 'handler',
        source: this.createLocation(file, lineNumber, lineNumber + 20),
        confidence: this.createConfidence('low', 'naming-convention'),
        frameworkMeta: { routeType: 'pages-router' },
      };

      this.addEndpoint(ctx, endpoint);
    }
  }
}
