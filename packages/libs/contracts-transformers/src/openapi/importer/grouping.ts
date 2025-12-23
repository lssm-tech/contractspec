/**
 * Grouping utilities for OpenAPI import/export.
 * Determines output folder structure based on configuration.
 */
import type { FolderConventions } from '@lssm/lib.contracts';
import type { ParsedOperation } from '../types';

/**
 * Grouping strategy type (matches ContractSpec config).
 */
type GroupingStrategy =
  | 'by-tag'
  | 'by-owner'
  | 'by-domain'
  | 'by-url-path-single'
  | 'by-url-path-multi'
  | 'by-feature'
  | 'none';

/**
 * Grouping rule configuration.
 */
interface GroupingRule {
  strategy: GroupingStrategy;
  urlPathLevel?: number;
  pattern?: string;
}

/**
 * Resolve the group folder for an operation based on grouping config.
 */
export function resolveOperationGroupFolder(
  operation: ParsedOperation,
  conventions: FolderConventions
): string {
  const groupingRule = conventions.operationsGrouping as
    | GroupingRule
    | undefined;

  if (!groupingRule || groupingRule.strategy === 'none') {
    return '';
  }

  return applyGroupingStrategy(groupingRule, {
    name: operation.operationId,
    tags: operation.tags,
    path: operation.path,
  });
}

/**
 * Resolve the group folder for a model based on grouping config.
 */
export function resolveModelGroupFolder(
  modelName: string,
  conventions: FolderConventions,
  relatedPath?: string,
  relatedTags?: string[]
): string {
  const groupingRule = conventions.modelsGrouping as GroupingRule | undefined;

  if (!groupingRule || groupingRule.strategy === 'none') {
    return '';
  }

  return applyGroupingStrategy(groupingRule, {
    name: modelName,
    tags: relatedTags ?? [],
    path: relatedPath,
  });
}

/**
 * Resolve the group folder for an event based on grouping config.
 */
export function resolveEventGroupFolder(
  eventName: string,
  conventions: FolderConventions,
  relatedTags?: string[]
): string {
  const groupingRule = conventions.eventsGrouping as GroupingRule | undefined;

  if (!groupingRule || groupingRule.strategy === 'none') {
    return '';
  }

  return applyGroupingStrategy(groupingRule, {
    name: eventName,
    tags: relatedTags ?? [],
  });
}

/**
 * Apply grouping strategy to extract folder name.
 */
function applyGroupingStrategy(
  rule: GroupingRule,
  context: {
    name: string;
    tags?: string[];
    path?: string;
    owners?: string[];
  }
): string {
  switch (rule.strategy) {
    case 'by-tag':
      return context.tags?.[0] ?? 'untagged';

    case 'by-owner':
      return context.owners?.[0] ?? 'unowned';

    case 'by-domain':
      return extractDomain(context.name);

    case 'by-url-path-single':
      return extractUrlPathLevel(context.path, 1);

    case 'by-url-path-multi':
      return extractUrlPathLevel(context.path, rule.urlPathLevel ?? 2);

    case 'by-feature':
      // Use domain extraction for feature grouping
      return extractDomain(context.name);

    case 'none':
    default:
      return '';
  }
}

/**
 * Extract domain from operation/model name.
 * e.g., "users.create" -> "users"
 */
function extractDomain(name: string): string {
  // Handle camelCase/PascalCase names
  if (name.includes('.')) {
    return name.split('.')[0] ?? 'default';
  }
  if (name.includes('_')) {
    return name.split('_')[0] ?? 'default';
  }
  // Extract from camelCase like "createUser" -> "create"
  const match = name.match(/^([a-z]+)/i);
  return match?.[1]?.toLowerCase() ?? 'default';
}

/**
 * Extract URL path segments for grouping.
 */
function extractUrlPathLevel(path: string | undefined, level: number): string {
  if (!path) return 'root';
  const segments = path.split('/').filter(Boolean);

  // Filter out path parameters like {id}
  const nonParamSegments = segments.filter((s) => !s.startsWith('{'));

  if (nonParamSegments.length === 0) return 'root';

  return nonParamSegments.slice(0, level).join('/');
}

/**
 * Build full output path including group folder.
 */
export function buildOutputPath(
  baseDir: string,
  surfaceDir: string,
  groupFolder: string,
  fileName: string
): string {
  const parts = [baseDir, surfaceDir];

  if (groupFolder) {
    parts.push(groupFolder);
  }

  parts.push(fileName);

  return parts.filter(Boolean).join('/');
}

/**
 * Determine if feature-based grouping should be applied.
 */
export function shouldGroupByFeature(conventions: FolderConventions): boolean {
  return conventions.groupByFeature;
}
