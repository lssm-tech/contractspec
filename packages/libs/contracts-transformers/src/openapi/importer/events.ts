import type { ParsedEvent } from '../types';
import {
  generateImports,
  generateSchemaModelCode,
  type ImportGeneratorOptions,
} from '../schema-converter';
import { toPascalCase, toValidIdentifier } from '../../common/utils';

/**
 * Generate code for an event.
 */
export function generateEventCode(
  event: ParsedEvent,
  options: ImportGeneratorOptions
): string {
  const eventName = toValidIdentifier(event.name);
  const modelName = toPascalCase(eventName) + 'Payload';

  // Generate payload model inline or referenced?
  // Let's generate the payload schema definition first
  const payloadModel = generateSchemaModelCode(event.payload, modelName);

  const imports = new Set<string>();
  imports.add(
    "import { defineEvent, type EventSpec } from '@lssm/lib.contracts';"
  );

  const modelImports = generateImports(payloadModel.fields, options);
  // Merge imports - this is a bit hacky string manipulation but works for now
  modelImports
    .split('\n')
    .filter(Boolean)
    .forEach((i) => imports.add(i));

  // If payloadModel is a reference (empty fields and different name), import it
  if (payloadModel.name !== modelName) {
    const modelsDir = options?.modelsDir ?? '.';
    const kebabName = payloadModel.name
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase();
    imports.add(`import { ${payloadModel.name} } from '${modelsDir}/${kebabName}';`);
  }

  const allImports = Array.from(imports).join('\n');

  return `
${allImports}

${payloadModel.code}

export const ${eventName} = defineEvent({
  name: '${event.name}',
  version: 1,
  description: ${JSON.stringify(event.description ?? '')},
  payload: ${payloadModel.name},
});
`.trim();
}
