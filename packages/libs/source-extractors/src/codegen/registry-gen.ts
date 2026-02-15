/**
 * Registry code generator.
 *
 * Generates OperationSpecRegistry from generated operations.
 */

import type { GeneratedFile } from './types';

/**
 * Generate a registry file for the generated operations.
 */
export function generateRegistry(
  operationFiles: GeneratedFile[]
): GeneratedFile {
  const operationImports = operationFiles
    .filter((f) => f.type === 'operation')
    .map((f) => {
      const name = f.path.replace('.ts', '').replace(/-/g, '_');
      const specName = toPascalCase(name) + 'Spec';
      return { path: f.path, name, specName };
    });

  const lines = [
    `/**`,
    ` * Generated operation registry.`,
    ` */`,
    ``,
    `import { OperationSpecRegistry } from '@contractspec/lib.contracts-spec';`,
    ``,
  ];

  // Add imports
  for (const op of operationImports) {
    const importPath = `./${op.path.replace('.ts', '')}`;
    lines.push(`import { ${op.specName} } from '${importPath}';`);
  }

  lines.push(``);
  lines.push(`export const operationRegistry = new OperationSpecRegistry();`);
  lines.push(``);

  // Register operations
  for (const op of operationImports) {
    lines.push(`operationRegistry.register(${op.specName});`);
  }

  lines.push(``);

  return {
    path: 'registry.ts',
    content: lines.join('\n'),
    type: 'registry',
  };
}

/**
 * Convert kebab-case to PascalCase.
 */
function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}
