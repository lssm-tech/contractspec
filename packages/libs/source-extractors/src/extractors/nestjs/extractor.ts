/**
 * NestJS extractor.
 *
 * Extracts contract candidates from NestJS applications by parsing:
 * - @Controller() decorated classes
 * - @Get(), @Post(), etc. decorated methods
 * - Class-validator DTOs
 * - HttpException patterns
 */

import { BaseExtractor, type ExtractionContext } from '../base';
import type {
  EndpointCandidate,
  HttpMethod,
  SchemaCandidate,
} from '../../types';

/**
 * Regex patterns for NestJS detection and extraction.
 */
const PATTERNS = {
  controller: /@Controller\s*\(\s*['"`]([^'"`]*)['"`]\s*\)/g,
  route:
    /@(Get|Post|Put|Patch|Delete|Head|Options)\s*\(\s*(?:['"`]([^'"`]*)['"`])?\s*\)/g,
  body: /@Body\s*\(\s*\)/g,
  param: /@Param\s*\(\s*(?:['"`]([^'"`]*)['"`])?\s*\)/g,
  query: /@Query\s*\(\s*(?:['"`]([^'"`]*)['"`])?\s*\)/g,
  dto: /class\s+(\w+(?:Dto|DTO|Request|Response|Input|Output))\s*\{/g,
  classValidator:
    /@(IsString|IsNumber|IsBoolean|IsArray|IsOptional|IsNotEmpty|Min|Max|Length|Matches)/g,
};

/**
 * NestJS framework extractor.
 */
export class NestJsExtractor extends BaseExtractor {
  id = 'nestjs';
  name = 'NestJS Extractor';
  frameworks = ['nestjs'];
  priority = 20; // Higher priority for NestJS-specific detection

  protected async doExtract(ctx: ExtractionContext): Promise<void> {
    const { project, options, fs } = ctx;

    // Find TypeScript files
    const pattern = options.scope?.length
      ? options.scope.map((s) => `${s}/**/*.ts`).join(',')
      : '**/*.ts';

    const files = await fs.glob(pattern, { cwd: project.rootPath });
    ctx.ir.stats.filesScanned = files.length;

    for (const file of files) {
      // Skip test files and node_modules
      if (
        file.includes('node_modules') ||
        file.includes('.spec.') ||
        file.includes('.test.')
      ) {
        continue;
      }

      const fullPath = `${project.rootPath}/${file}`;
      const content = await fs.readFile(fullPath);

      // Extract controllers and routes
      await this.extractControllers(ctx, file, content);

      // Extract DTOs
      await this.extractDtos(ctx, file, content);
    }
  }

  /**
   * Extract controllers and their routes from a file.
   */
  private async extractControllers(
    ctx: ExtractionContext,
    file: string,
    content: string
  ): Promise<void> {
    // Find controllers
    const controllerMatches = [...content.matchAll(PATTERNS.controller)];

    for (const controllerMatch of controllerMatches) {
      const basePath = controllerMatch[1] || '';
      const controllerIndex = controllerMatch.index ?? 0;

      // Find the class name after the decorator
      const afterDecorator = content.slice(controllerIndex);
      const classMatch = afterDecorator.match(/class\s+(\w+)/);
      const controllerName = classMatch?.[1] ?? 'UnknownController';

      // Find route decorators in this controller
      // We need to find routes between this controller and the next one (or end of file)
      const nextController = content.indexOf(
        '@Controller',
        controllerIndex + 1
      );
      const controllerBlock =
        nextController > 0
          ? content.slice(controllerIndex, nextController)
          : content.slice(controllerIndex);

      const routeMatches = [...controllerBlock.matchAll(PATTERNS.route)];

      for (const routeMatch of routeMatches) {
        const method = routeMatch[1]?.toUpperCase() as HttpMethod;
        const routePath = routeMatch[2] || '';
        const fullPath = this.normalizePath(`/${basePath}/${routePath}`);

        // Find the method name after the route decorator
        const afterRoute = controllerBlock.slice(routeMatch.index ?? 0);
        const methodMatch = afterRoute.match(
          /(?:async\s+)?(\w+)\s*\([^)]*\)\s*(?::\s*\w+(?:<[^>]+>)?)?\s*\{/
        );
        const handlerName = methodMatch?.[1] ?? 'unknownHandler';

        // Calculate line numbers
        const absoluteIndex = controllerIndex + (routeMatch.index ?? 0);
        const lineNumber = content.slice(0, absoluteIndex).split('\n').length;

        // Check for body, params, query decorators
        const hasBody = PATTERNS.body.test(afterRoute.slice(0, 200));
        const hasParams = PATTERNS.param.test(afterRoute.slice(0, 200));
        const hasQuery = PATTERNS.query.test(afterRoute.slice(0, 200));

        const endpoint: EndpointCandidate = {
          id: this.generateEndpointId(method, fullPath, handlerName),
          method,
          path: fullPath,
          kind: this.methodToOpKind(method),
          handlerName,
          controllerName,
          source: this.createLocation(file, lineNumber, lineNumber + 10),
          confidence: this.createConfidence('medium', 'decorator-hints'),
          frameworkMeta: {
            hasBody,
            hasParams,
            hasQuery,
          },
        };

        this.addEndpoint(ctx, endpoint);
      }
    }
  }

  /**
   * Extract DTO classes from a file.
   */
  private async extractDtos(
    ctx: ExtractionContext,
    file: string,
    content: string
  ): Promise<void> {
    const dtoMatches = [...content.matchAll(PATTERNS.dto)];

    for (const match of dtoMatches) {
      const name = match[1] ?? 'UnknownDto';
      const index = match.index ?? 0;
      const lineNumber = content.slice(0, index).split('\n').length;

      // Check if it uses class-validator (check for import statement)
      const hasClassValidator =
        content.includes('class-validator') ||
        content.includes('@IsString') ||
        content.includes('@IsNumber');

      const schema: SchemaCandidate = {
        id: this.generateSchemaId(name, file),
        name,
        schemaType: hasClassValidator ? 'class-validator' : 'typescript',
        source: this.createLocation(file, lineNumber, lineNumber + 20),
        confidence: this.createConfidence(
          hasClassValidator ? 'high' : 'medium',
          hasClassValidator ? 'explicit-schema' : 'inferred-types'
        ),
      };

      this.addSchema(ctx, schema);
    }
  }

  /**
   * Normalize a path (remove double slashes, ensure leading slash).
   */
  private normalizePath(path: string): string {
    return '/' + path.replace(/\/+/g, '/').replace(/^\/+|\/+$/g, '');
  }
}
