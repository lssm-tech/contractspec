import * as mustache from 'mustache';

/**
 * Render a template string with provided data
 */
export type TemplateData = Record<string, string | number | boolean>;

export function renderTemplate(template: string, data: TemplateData): string {
  return (
    mustache as unknown as {
      render: (tpl: string, ctx: TemplateData) => string;
    }
  ).render(template, data);
}

/**
 * Format date for templates
 */
export function formatDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0] ?? '';
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert kebab-case to PascalCase
 */
export function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Convert kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
  const pascal = kebabToPascal(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
