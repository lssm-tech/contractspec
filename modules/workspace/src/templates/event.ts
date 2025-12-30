/**
 * Event spec template generation.
 * Extracted from cli-contractspec/src/templates/event.template.ts
 */

import type { EventSpecData } from '../types/spec-types';
import { toPascalCase } from './utils';

/**
 * Generate event spec TypeScript code.
 */
export function generateEventSpec(data: EventSpecData): string {
  const { name, version, description, stability, owners, tags, piiFields } =
    data;

  const eventVarName = toPascalCase(name.replace(/\./g, '_')) + 'V' + version;
  const payloadSchemaName = eventVarName + 'Payload';

  return `import { defineEvent } from '@contractspec/lib.contracts';
import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';

// TODO: Define event payload schema
export const ${payloadSchemaName} = new SchemaModel({
  name: '${payloadSchemaName}',
  description: 'Payload for ${name}',
  fields: {
    // Add your payload fields here
    // example: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const ${eventVarName} = defineEvent({
  meta: {
    name: '${name}',
    version: ${version},
    description: '${description}',
    stability: '${stability}',
    owners: [${owners.map((o) => `'${o}'`).join(', ')}],
    tags: [${tags.map((t) => `'${t}'`).join(', ')}],
  },
  ${piiFields.length > 0 ? `pii: [${piiFields.map((f) => `'${f}'`).join(', ')}],` : '// pii: [],'}
  payload: ${payloadSchemaName},
});
`;
}
