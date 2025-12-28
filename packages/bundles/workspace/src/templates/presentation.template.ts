import type { PresentationSpecData } from '../types';

/**
 * Generate presentation spec TypeScript code
 */
export function generatePresentationSpec(data: PresentationSpecData): string {
  const {
    name,
    version,
    description,
    stability,
    owners,
    tags,
    presentationKind,
  } = data;

  const varName = toPascalCase(name.replace(/\./g, '_')) + 'Presentation';

  let contentBlock = '';

  switch (presentationKind) {
    case 'web_component':
      contentBlock = `  content: {
    kind: 'web_component',
    framework: 'react',
    componentKey: '${name.replace(/\./g, '_')}',
    props: new SchemaModel({
      name: '${varName}Props',
      description: 'Props for ${name}',
      fields: {
        // TODO: Define component props
      },
    }),
    analytics: [
      // TODO: Define analytics events
    ],
  },`;
      break;

    case 'markdown':
      contentBlock = `  content: {
    kind: 'markdown',
    content: \`
# ${description}

TODO: Add markdown content here
    \`,
    // Or use resourceUri: 'feature://${name}/guide.md'
  },`;
      break;

    case 'data':
      contentBlock = `  content: {
    kind: 'data',
    mimeType: 'application/json',
    model: new SchemaModel({
      name: '${varName}Data',
      description: 'Data structure for ${name}',
      fields: {
        // TODO: Define data structure
      },
    }),
  },`;
      break;
  }

  return `import type { PresentationSpec } from '@contractspec/lib.contracts/presentations';
import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

export const ${varName}: PresentationSpec = {
  meta: {
    key: '${name}',
    version: ${version},
    stability: '${stability}',
    owners: [${owners.map((o) => `'${o}'`).join(', ')}],
    tags: [${tags.map((t) => `'${t}'`).join(', ')}],
    description: '${description}',
  },
  
  policy: {
    // flags: [],
    // pii: [],
  },
  
${contentBlock}
};
`;
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_.]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}
