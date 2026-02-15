/**
 * Convention-based implementation path resolution.
 */

import type { ImplementationType } from '@contractspec/lib.contracts-spec';

/**
 * Convert string to kebab-case.
 */
export function toKebabCase(value: string): string {
  return value
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Get convention-based implementation paths for a spec.
 */
export function getConventionPaths(
  specType: string,
  specKey: string,
  outputDir: string
): { path: string; type: ImplementationType }[] {
  const kebab = toKebabCase(specKey);
  const paths: { path: string; type: ImplementationType }[] = [];

  if (specType === 'operation') {
    paths.push({
      path: `${outputDir}/handlers/${kebab}.handler.ts`,
      type: 'handler',
    });
    paths.push({
      path: `${outputDir}/handlers/${kebab}.handler.test.ts`,
      type: 'test',
    });
  }

  if (specType === 'presentation') {
    paths.push({
      path: `${outputDir}/components/${kebab}.tsx`,
      type: 'component',
    });
    paths.push({
      path: `${outputDir}/components/${kebab}.test.tsx`,
      type: 'test',
    });
  }

  if (specType === 'form') {
    paths.push({
      path: `${outputDir}/forms/${kebab}.form.tsx`,
      type: 'form',
    });
    paths.push({
      path: `${outputDir}/forms/${kebab}.form.test.tsx`,
      type: 'test',
    });
  }

  if (specType === 'event') {
    paths.push({
      path: `${outputDir}/handlers/${kebab}.handler.ts`,
      type: 'handler',
    });
    paths.push({
      path: `${outputDir}/handlers/${kebab}.handler.test.ts`,
      type: 'test',
    });
  }

  return paths;
}
