/**
 * Schema-to-Markdown Utilities
 *
 * Generate markdown from SchemaModel definitions and data.
 * Provides automatic table, list, and detail view generation
 * based on schema field introspection.
 */
import type { AnySchemaModel, SchemaFieldConfig } from '@lssm/lib.schema';
import { isSchemaModel } from '@lssm/lib.schema';

/**
 * Options for schema-to-markdown generation
 */
export interface SchemaMarkdownOptions {
  /** Title for the markdown section */
  title?: string;
  /** Description to include below the title */
  description?: string;
  /** Output format: table for lists, list for simple items, detail for single objects */
  format?: 'table' | 'list' | 'detail' | 'auto';
  /** Maximum number of items to render (for arrays) */
  maxItems?: number;
  /** Only include these fields (if not specified, all fields are included) */
  includeFields?: string[];
  /** Exclude these fields from output */
  excludeFields?: string[];
  /** Custom field labels (field name -> display label) */
  fieldLabels?: Record<string, string>;
  /** Fields to use for summary in list format */
  summaryFields?: string[];
  /** Nesting depth for nested schemas (default: 2) */
  maxDepth?: number;
}

/**
 * Internal type for field metadata used during rendering
 */
interface FieldMeta {
  name: string;
  label: string;
  isOptional: boolean;
  isArray: boolean;
  isNested: boolean;
}

/**
 * Generate markdown from a SchemaModel and data.
 * Automatically detects array vs object data and formats accordingly.
 */
export function schemaToMarkdown(
  schema: AnySchemaModel,
  data: unknown,
  options: SchemaMarkdownOptions = {}
): string {
  const { format = 'auto', title, description, maxDepth = 2 } = options;

  const lines: string[] = [];

  // Add title and description
  if (title) {
    lines.push(`# ${title}`, '');
  }
  if (description) {
    lines.push(`> ${description}`, '');
  }

  // Determine format based on data type if auto
  const effectiveFormat =
    format === 'auto' ? (Array.isArray(data) ? 'table' : 'detail') : format;

  // Generate content based on format
  if (effectiveFormat === 'table' && Array.isArray(data)) {
    lines.push(schemaToMarkdownTable(schema, data, options));
  } else if (effectiveFormat === 'list' && Array.isArray(data)) {
    lines.push(schemaToMarkdownList(schema, data, options));
  } else if (
    !Array.isArray(data) &&
    data !== null &&
    typeof data === 'object'
  ) {
    lines.push(schemaToMarkdownDetail(schema, data, { ...options, maxDepth }));
  } else {
    // Fallback for primitive or null data
    lines.push(`**Data:** ${String(data)}`, '');
  }

  return lines.join('\n');
}

/**
 * Generate a markdown table from array data using schema fields as columns.
 */
export function schemaToMarkdownTable(
  schema: AnySchemaModel,
  items: unknown[],
  options: SchemaMarkdownOptions = {}
): string {
  const { maxItems = 100, includeFields, excludeFields = [] } = options;

  const fields = getFieldMeta(schema, includeFields, excludeFields);
  if (fields.length === 0 || items.length === 0) {
    return '_No data available_\n';
  }

  const limitedItems = items.slice(0, maxItems);
  const lines: string[] = [];

  // Table header
  const headers = fields.map((f) => f.label);
  lines.push(`| ${headers.join(' | ')} |`);
  lines.push(`| ${headers.map(() => '---').join(' | ')} |`);

  // Table rows
  for (const item of limitedItems) {
    const row = fields.map((f) => formatCellValue(getFieldValue(item, f.name)));
    lines.push(`| ${row.join(' | ')} |`);
  }

  // Add truncation notice if needed
  if (items.length > maxItems) {
    lines.push('', `_Showing ${maxItems} of ${items.length} items_`);
  }

  lines.push('');
  return lines.join('\n');
}

/**
 * Generate a markdown list from array data.
 * Uses summaryFields to create concise list items.
 */
export function schemaToMarkdownList(
  schema: AnySchemaModel,
  items: unknown[],
  options: SchemaMarkdownOptions = {}
): string {
  const {
    maxItems = 50,
    summaryFields,
    includeFields,
    excludeFields = [],
  } = options;

  const fields = getFieldMeta(schema, includeFields, excludeFields);
  const displayFields = summaryFields
    ? fields.filter((f) => summaryFields.includes(f.name))
    : fields.slice(0, 3); // Default to first 3 fields

  if (displayFields.length === 0 || items.length === 0) {
    return '_No data available_\n';
  }

  const limitedItems = items.slice(0, maxItems);
  const lines: string[] = [];

  for (const item of limitedItems) {
    const primaryValue = formatCellValue(
      getFieldValue(item, displayFields[0]?.name ?? 'id')
    );
    const secondaryValues = displayFields
      .slice(1)
      .map((f) => `${f.label}: ${formatCellValue(getFieldValue(item, f.name))}`)
      .join(' · ');

    const itemLine = secondaryValues
      ? `- **${primaryValue}** (${secondaryValues})`
      : `- **${primaryValue}**`;
    lines.push(itemLine);
  }

  // Add truncation notice if needed
  if (items.length > maxItems) {
    lines.push('', `_Showing ${maxItems} of ${items.length} items_`);
  }

  lines.push('');
  return lines.join('\n');
}

/**
 * Generate a markdown detail view (key-value pairs) from object data.
 */
export function schemaToMarkdownDetail(
  schema: AnySchemaModel,
  item: unknown,
  options: SchemaMarkdownOptions = {}
): string {
  const { includeFields, excludeFields = [], maxDepth = 2 } = options;

  if (item === null || typeof item !== 'object') {
    return '_No data available_\n';
  }

  const fields = getFieldMeta(schema, includeFields, excludeFields);
  if (fields.length === 0) {
    return '_No fields to display_\n';
  }

  const lines: string[] = [];

  for (const field of fields) {
    const value = getFieldValue(item, field.name);
    const formattedValue = formatDetailValue(value, maxDepth, 0);
    lines.push(`**${field.label}:** ${formattedValue}`);
  }

  lines.push('');
  return lines.join('\n');
}

/**
 * Generate markdown summary statistics for numeric fields in array data.
 */
export function schemaToMarkdownSummary(
  items: unknown[],
  options: { numericFields?: string[]; countByField?: string } = {}
): string {
  const { numericFields = [], countByField } = options;
  const lines: string[] = [];

  lines.push(`**Total Items:** ${items.length}`);

  // Numeric field summaries
  for (const fieldName of numericFields) {
    const values = items
      .map((item) => getFieldValue(item, fieldName))
      .filter((v): v is number => typeof v === 'number');

    if (values.length > 0) {
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);

      lines.push(
        `**${formatFieldName(fieldName)}:** Sum: ${formatNumber(sum)}, Avg: ${formatNumber(avg)}, Min: ${formatNumber(min)}, Max: ${formatNumber(max)}`
      );
    }
  }

  // Count by field
  if (countByField) {
    const counts: Record<string, number> = {};
    for (const item of items) {
      const value = String(getFieldValue(item, countByField) ?? 'Unknown');
      counts[value] = (counts[value] ?? 0) + 1;
    }

    lines.push('', `**By ${formatFieldName(countByField)}:**`);
    for (const [value, count] of Object.entries(counts)) {
      lines.push(`- ${value}: ${count}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

// ============ Helper Functions ============

/**
 * Get field metadata from schema, applying include/exclude filters
 */
function getFieldMeta(
  schema: AnySchemaModel,
  includeFields?: string[],
  excludeFields: string[] = []
): FieldMeta[] {
  // Only SchemaModel has config.fields
  if (!isSchemaModel(schema)) {
    return [];
  }

  const schemaFields = schema.config.fields;
  const fieldNames = Object.keys(schemaFields);

  const filteredFields = fieldNames.filter((name) => {
    if (excludeFields.includes(name)) return false;
    if (includeFields && !includeFields.includes(name)) return false;
    return true;
  });

  return filteredFields.map((name) => {
    const fieldConfig = schemaFields[name] as SchemaFieldConfig | undefined;
    const isNested = Boolean(
      fieldConfig?.type &&
      typeof fieldConfig.type === 'object' &&
      'config' in fieldConfig.type &&
      typeof (fieldConfig.type as { config?: { fields?: unknown } }).config
        ?.fields === 'object'
    );
    return {
      name,
      label: formatFieldName(name),
      isOptional: fieldConfig?.isOptional ?? false,
      isArray: fieldConfig?.isArray === true,
      isNested,
    };
  });
}

/**
 * Get value from object by field name (supports nested paths)
 */
function getFieldValue(item: unknown, fieldName: string): unknown {
  if (item === null || typeof item !== 'object') return undefined;
  const obj = item as Record<string, unknown>;

  // Support dot notation for nested fields
  if (fieldName.includes('.')) {
    const parts = fieldName.split('.');
    let current: unknown = obj;
    for (const part of parts) {
      if (current === null || typeof current !== 'object') return undefined;
      current = (current as Record<string, unknown>)[part];
    }
    return current;
  }

  return obj[fieldName];
}

/**
 * Format a value for table cell display
 */
function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? '✓' : '✗';
  if (typeof value === 'number') return formatNumber(value);
  if (value instanceof Date) return formatDate(value);
  if (typeof value === 'string' && isISODate(value))
    return formatDate(new Date(value));
  if (Array.isArray(value)) return `[${value.length} items]`;
  if (typeof value === 'object') return '[Object]';

  const str = String(value);
  // Truncate long strings and escape pipe characters for tables
  return str.length > 50 ? `${str.slice(0, 47)}...` : str.replace(/\|/g, '\\|');
}

/**
 * Format a value for detail view (allows more space)
 */
function formatDetailValue(
  value: unknown,
  maxDepth: number,
  currentDepth: number
): string {
  if (value === null || value === undefined) return '_none_';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return formatNumber(value);
  if (value instanceof Date) return formatDate(value);
  if (typeof value === 'string' && isISODate(value))
    return formatDate(new Date(value));

  if (Array.isArray(value)) {
    if (value.length === 0) return '_empty list_';
    if (currentDepth >= maxDepth) return `[${value.length} items]`;

    // For short arrays of primitives, inline them
    if (value.length <= 5 && value.every((v) => typeof v !== 'object')) {
      return value.map((v) => formatCellValue(v)).join(', ');
    }
    return `[${value.length} items]`;
  }

  if (typeof value === 'object') {
    if (currentDepth >= maxDepth) return '[Object]';
    // For simple objects, show key count
    const keys = Object.keys(value);
    return `{${keys.length} fields}`;
  }

  return String(value);
}

/**
 * Format field name to human-readable label
 */
function formatFieldName(name: string): string {
  return (
    name
      // Split on camelCase
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Split on underscores
      .replace(/_/g, ' ')
      // Capitalize first letter
      .replace(/^\w/, (c) => c.toUpperCase())
  );
}

/**
 * Format number with locale-aware formatting
 */
function formatNumber(value: number): string {
  // For currency-like values (large numbers), use formatting
  if (Math.abs(value) >= 1000) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(value);
  }
  // For small numbers, show more precision
  if (Number.isInteger(value)) {
    return String(value);
  }
  return value.toFixed(2);
}

/**
 * Format date to readable string
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Check if string is ISO date format
 */
function isISODate(str: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}/.test(str)) return false;
  const date = new Date(str);
  return !isNaN(date.getTime());
}
