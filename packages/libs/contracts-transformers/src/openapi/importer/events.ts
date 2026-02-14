import type { ParsedEvent } from '../types';
import { generateImports, generateSchemaModelCode } from '../schema-converter';
import { toPascalCase, toValidIdentifier } from '../../common/utils';
import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts-spec';

/**
 * Generate code for an event.
 */
export function generateEventCode(
  event: ParsedEvent,
  options: ResolvedContractsrcConfig
): string {
  const eventName = toValidIdentifier(event.name);
  const modelName = toPascalCase(eventName) + 'Payload';

  const schemaFormat = options.schemaFormat || 'contractspec';
  // Generate payload model inline or referenced?
  // Let's generate the payload schema definition first
  const payloadModel = generateSchemaModelCode(
    event.payload,
    modelName,
    schemaFormat,
    options
  );

  const imports = new Set<string>();
  imports.add(
    "import { defineEvent, type EventSpec } from '@contractspec/lib.contracts-spec';"
  );

  if (payloadModel.imports && payloadModel.imports.length > 0) {
    payloadModel.imports.forEach((i) => imports.add(i));
  } else if (payloadModel.fields && payloadModel.fields.length > 0) {
    const modelImports = generateImports(payloadModel.fields, options);
    // Merge imports - this is a bit hacky string manipulation but works for now
    modelImports
      .split('\n')
      .filter(Boolean)
      .forEach((i) => imports.add(i));
  }

  // If payloadModel is a reference (empty fields and different name), import it
  if (payloadModel.name !== modelName) {
    const modelsDir = `../${options.conventions.models}`;
    const kebabName = payloadModel.name
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase();
    imports.add(
      `import { ${payloadModel.name} } from '${modelsDir}/${kebabName}';`
    );
  }

  const allImports = Array.from(imports).join('\n');

  return `
${allImports}

${payloadModel.code}

export const ${eventName} = defineEvent({
  meta: {
    key: '${event.name}',
    version: '1.0.0',
    description: ${JSON.stringify(event.description ?? '')},
  },
  payload: ${payloadModel.name},
});
`.trim();
}
