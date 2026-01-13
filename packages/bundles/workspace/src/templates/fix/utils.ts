/**
 * Template utilities.
 */

import type { SpecGenerationContext } from '../../services/fix/types';

/**
 * Convert a string to PascalCase.
 */
export function toPascalCase(str: string): string {
  return str
    .split(/[-_.]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

/**
 * Generate the metadata object properties string.
 *
 * @param ctx The generation context.
 * @param extra Extra key-value pairs to include in the meta object. Values should be valid JS literals/code (e.g. quoted strings).
 */
export function generateMetaProperties(
  ctx: SpecGenerationContext,
  extra?: Record<string, string | undefined>
): string {
  const owners = ctx.enrichment?.owners?.length
    ? ctx.enrichment.owners.map((o) => `'${o}'`).join(', ')
    : "'@team'";

  const tags = ctx.enrichment?.tags?.length
    ? ctx.enrichment.tags.map((t) => `'${t}'`).join(', ')
    : '';

  const description = ctx.description || `TODO: Add description for ${ctx.key}`;

  const props = [
    `key: '${ctx.key}'`,
    `version: '${ctx.version}'`,
    `stability: '${ctx.stability}'`,
  ];

  if (extra) {
    Object.entries(extra).forEach(([key, value]) => {
      if (value !== undefined) {
        props.push(`${key}: ${value}`);
      }
    });
  }

  // Standard props that go after custom ones (convention)
  props.push(`owners: [${owners}]`);
  props.push(`tags: [${tags}]`);
  props.push(`description: '${description}'`);

  return props.join(',\n    ');
}
