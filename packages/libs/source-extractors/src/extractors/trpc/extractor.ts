/**
 * tRPC extractor.
 *
 * Extracts contract candidates from tRPC applications by parsing:
 * - router definitions
 * - procedure definitions (query, mutation)
 * - Zod input/output schemas
 */

import { BaseExtractor, type ExtractionContext } from '../base';
import type { EndpointCandidate, HttpMethod } from '../../types';

const PATTERNS = {
  procedure: /\.(query|mutation)\s*\(\s*(?:\{[^}]*\}|[^)]+)\)/gi,
  procedureName:
    /(\w+)\s*:\s*(?:publicProcedure|protectedProcedure|procedure)/g,
  zodInput: /\.input\s*\(\s*(\w+)/g,
  zodOutput: /\.output\s*\(\s*(\w+)/g,
};

export class TrpcExtractor extends BaseExtractor {
  id = 'trpc';
  name = 'tRPC Extractor';
  frameworks = ['trpc'];
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

      if (!content.includes('trpc') && !content.includes('Procedure')) continue;

      await this.extractProcedures(ctx, file, content);
    }
  }

  private async extractProcedures(
    ctx: ExtractionContext,
    file: string,
    content: string
  ): Promise<void> {
    const nameMatches = [...content.matchAll(PATTERNS.procedureName)];

    for (const match of nameMatches) {
      const procedureName = match[1] ?? 'unknownProcedure';
      const index = match.index ?? 0;
      const lineNumber = content.slice(0, index).split('\n').length;

      const afterMatch = content.slice(index, index + 500);
      const isQuery = afterMatch.includes('.query(');
      const isMutation = afterMatch.includes('.mutation(');

      if (!isQuery && !isMutation) continue;

      const hasZodInput = PATTERNS.zodInput.test(afterMatch);
      const hasZodOutput = PATTERNS.zodOutput.test(afterMatch);
      const hasSchema = hasZodInput || hasZodOutput;

      const method: HttpMethod = isMutation ? 'POST' : 'GET';

      const endpoint: EndpointCandidate = {
        id: `trpc.${procedureName}`,
        method,
        path: `/trpc/${procedureName}`,
        kind: isMutation ? 'command' : 'query',
        handlerName: procedureName,
        source: this.createLocation(file, lineNumber, lineNumber + 10),
        confidence: this.createConfidence(
          hasSchema ? 'high' : 'medium',
          hasSchema ? 'explicit-schema' : 'inferred-types'
        ),
        frameworkMeta: {
          procedureType: isMutation ? 'mutation' : 'query',
          hasInput: hasZodInput,
          hasOutput: hasZodOutput,
        },
      };

      this.addEndpoint(ctx, endpoint);
    }
  }
}
