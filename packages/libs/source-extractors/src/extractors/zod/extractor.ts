/**
 * Zod schema extractor.
 *
 * Extracts standalone Zod schema definitions that aren't tied to a specific framework.
 * Useful for shared validation schemas.
 */

import { BaseExtractor, type ExtractionContext } from '../base';
import type { SchemaCandidate } from '../../types';

const PATTERNS = {
  zodSchema:
    /(?:export\s+)?const\s+(\w+)\s*=\s*z\.(?:object|string|number|boolean|array|enum|union|intersection|literal|tuple|record)/g,
  zodInfer: /type\s+(\w+)\s*=\s*z\.infer<typeof\s+(\w+)>/g,
};

export class ZodSchemaExtractor extends BaseExtractor {
  id = 'zod';
  name = 'Zod Schema Extractor';
  frameworks = ['zod'];
  priority = 5; // Lower priority, runs after framework extractors

  async detect(): Promise<boolean> {
    // Always available as a fallback
    return true;
  }

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

      if (!content.includes('z.')) continue;

      await this.extractSchemas(ctx, file, content);
    }
  }

  private async extractSchemas(
    ctx: ExtractionContext,
    file: string,
    content: string
  ): Promise<void> {
    const matches = [...content.matchAll(PATTERNS.zodSchema)];

    for (const match of matches) {
      const name = match[1] ?? 'unknownSchema';
      const index = match.index ?? 0;
      const lineNumber = content.slice(0, index).split('\n').length;

      // Find the end of the schema definition (roughly)
      let depth = 0;
      let endIndex = index;
      for (let i = index; i < content.length; i++) {
        const char = content[i];
        if (char === '(' || char === '{' || char === '[') depth++;
        if (char === ')' || char === '}' || char === ']') depth--;
        if (depth === 0 && (char === ';' || char === '\n')) {
          endIndex = i;
          break;
        }
      }

      const rawDefinition = content.slice(index, endIndex + 1);
      const endLineNumber = lineNumber + rawDefinition.split('\n').length - 1;

      const schema: SchemaCandidate = {
        id: this.generateSchemaId(name, file),
        name,
        schemaType: 'zod',
        rawDefinition,
        source: this.createLocation(file, lineNumber, endLineNumber),
        confidence: this.createConfidence('high', 'explicit-schema'),
      };

      this.addSchema(ctx, schema);
    }
  }
}
