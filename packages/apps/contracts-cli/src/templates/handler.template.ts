/**
 * Generate handler implementation template
 */
export function generateHandlerTemplate(specName: string, kind: 'command' | 'query'): string {
  const handlerName = toCamelCase(specName.split('.').pop() || 'unknown') + 'Handler';
  const specVarName = toPascalCase(specName.split('.').pop() || 'Unknown') + 'Spec';

  return `import type { ContractHandler } from '@lssm/lib.contracts';
import { ${specVarName} } from '../contracts/${toKebabCase(specName)}.contracts';

/**
 * Handler for ${specName}
 */
export const ${handlerName}: ContractHandler<typeof ${specVarName}> = async (
  input,
  context
) => {
  // TODO: Implement ${kind} logic
  
  try {
    // 1. Validate prerequisites
    // 2. Perform business logic
    // 3. Emit events if needed
    // 4. Return result
    
    return {
      ok: true,
    };
  } catch (error) {
    // Handle and map errors to spec.io.errors
    throw error;
  }
};
`;
}

/**
 * Generate component template
 */
export function generateComponentTemplate(
  componentName: string,
  description: string
): string {
  const pascalName = toPascalCase(componentName);

  return `import React from 'react';

interface ${pascalName}Props {
  // TODO: Define props based on presentation spec
}

/**
 * ${description}
 */
export const ${pascalName}: React.FC<${pascalName}Props> = (props) => {
  return (
    <div>
      {/* TODO: Implement component UI */}
      <p>Component: ${pascalName}</p>
    </div>
  );
};
`;
}

/**
 * Generate test template
 */
export function generateTestTemplate(
  targetName: string,
  type: 'handler' | 'component'
): string {
  const importPath = type === 'handler' ? '../handlers' : '../components';
  const testName = toPascalCase(targetName);

  return `import { describe, it, expect } from 'vitest';
import { ${testName} } from '${importPath}/${toKebabCase(targetName)}';

describe('${testName}', () => {
  it('should ${type === 'handler' ? 'handle valid input' : 'render correctly'}', async () => {
    // TODO: Implement test
    expect(true).toBe(true);
  });

  it('should handle edge cases', async () => {
    // TODO: Test edge cases
  });

  ${
    type === 'handler'
      ? `it('should handle errors appropriately', async () => {
    // TODO: Test error scenarios
  });`
      : `it('should be accessible', async () => {
    // TODO: Test accessibility
  });`
  }
});
`;
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_.]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function toKebabCase(str: string): string {
  return str
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

