/**
 * Operation code generator.
 *
 * Generates defineCommand/defineQuery specs from endpoint candidates.
 */

import type { EndpointCandidate, ImportIR } from '../types';
import type { GeneratedFile, GenerationOptions } from './types';

/**
 * Generate a single operation spec file.
 */
export function generateOperation(
  endpoint: EndpointCandidate,
  options: GenerationOptions
): GeneratedFile {
  const specName = toSpecName(endpoint);
  const fileName = `${toFileName(endpoint)}.ts`;

  const code = generateOperationCode(endpoint, specName, options);

  return {
    path: fileName,
    content: code,
    type: 'operation',
  };
}

/**
 * Generate all operation spec files from IR.
 */
export function generateOperations(
  ir: ImportIR,
  options: GenerationOptions
): GeneratedFile[] {
  return ir.endpoints.map((endpoint) => generateOperation(endpoint, options));
}

/**
 * Convert endpoint to spec name (PascalCase).
 */
function toSpecName(endpoint: EndpointCandidate): string {
  const parts = endpoint.path
    .replace(/^\//, '')
    .split('/')
    .filter((p) => p && !p.startsWith(':') && !p.startsWith('{'));

  const methodPart = endpoint.method.toLowerCase();
  const pathPart = parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');

  return `${methodPart}${pathPart}Spec`;
}

/**
 * Convert endpoint to file name (kebab-case).
 */
function toFileName(endpoint: EndpointCandidate): string {
  const parts = endpoint.path
    .replace(/^\//, '')
    .split('/')
    .filter((p) => p && !p.startsWith(':') && !p.startsWith('{'));

  const methodPart = endpoint.method.toLowerCase();
  const pathPart = parts.join('-');

  return `${methodPart}-${pathPart}`.replace(/--+/g, '-');
}

/**
 * Generate the operation spec code.
 */
function generateOperationCode(
  endpoint: EndpointCandidate,
  specName: string,
  options: GenerationOptions
): string {
  const isCommand = endpoint.kind === 'command';
  const defineFunc = isCommand ? 'defineCommand' : 'defineQuery';
  const auth = options.defaultAuth ?? 'user';
  const owners = options.defaultOwners ?? ['team'];

  const lines = [
    `/**`,
    ` * ${endpoint.method} ${endpoint.path}`,
    ` *`,
    ` * Generated from: ${endpoint.source.file}:${endpoint.source.startLine}`,
    ` * Confidence: ${endpoint.confidence.level}`,
    ` */`,
    ``,
    `import { ${defineFunc} } from '@contractspec/lib.contracts-spec';`,
    `import { fromZod } from '@contractspec/lib.schema';`,
    `import { z } from 'zod';`,
    ``,
    `// TODO: Define input schema based on extracted information`,
    `const inputSchema = fromZod(z.object({`,
    `  // Add fields here`,
    `}));`,
    ``,
    `// TODO: Define output schema`,
    `const outputSchema = fromZod(z.object({`,
    `  // Add fields here`,
    `}));`,
    ``,
    `export const ${specName} = ${defineFunc}({`,
    `  meta: {`,
    `    name: '${endpoint.handlerName ?? endpoint.id}',`,
    `    version: 1,`,
    `    stability: 'experimental',`,
    `    owners: ${JSON.stringify(owners)},`,
    `    goal: 'TODO: Describe the business goal',`,
    `    context: 'Generated from ${endpoint.source.file}',`,
    `  },`,
    `  io: {`,
    `    input: inputSchema,`,
    `    output: outputSchema,`,
    `  },`,
    `  policy: {`,
    `    auth: '${auth}',`,
    `  },`,
    `  transport: {`,
    `    rest: {`,
    `      method: '${endpoint.method}',`,
    `      path: '${endpoint.path}',`,
    `    },`,
    `  },`,
    `});`,
    ``,
  ];

  return lines.join('\n');
}
