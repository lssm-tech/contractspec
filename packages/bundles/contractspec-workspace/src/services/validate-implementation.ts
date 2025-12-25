/**
 * Implementation validation service (handlers + tests).
 *
 * Deterministic, static checks intended for reuse across CLI/VSCode/web tooling.
 * This does NOT execute spec modules.
 */

import { scanSpecSource } from '@lssm/module.contractspec-workspace';
import type { WorkspaceConfig } from '@lssm/module.contractspec-workspace';
import type { FsAdapter } from '../ports/fs';

export interface ValidateImplementationOptions {
  checkHandlers?: boolean;
  checkTests?: boolean;
  /**
   * Override workspace outputDir (defaults to config.outputDir).
   */
  outputDir?: string;
}

export interface ValidateImplementationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  expected: {
    handlerPath?: string;
    handlerTestPath?: string;
    componentPath?: string;
    componentTestPath?: string;
    formPath?: string;
    formTestPath?: string;
  };
}

function toKebabCase(value: string): string {
  return value
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function toPascalCase(value: string): string {
  return value
    .split(/[-_.]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export async function validateImplementationFiles(
  specFile: string,
  adapters: { fs: FsAdapter },
  config: WorkspaceConfig,
  options: ValidateImplementationOptions = {}
): Promise<ValidateImplementationResult> {
  const { fs } = adapters;
  const errors: string[] = [];
  const warnings: string[] = [];

  const exists = await fs.exists(specFile);
  if (!exists) {
    return {
      valid: false,
      errors: [`Spec file not found: ${specFile}`],
      warnings: [],
      expected: {},
    };
  }

  const code = await fs.readFile(specFile);
  const scan = scanSpecSource(code, specFile);
  const specName = scan.key ?? fs.basename(specFile).replace(/\.[jt]s$/, '');
  const outRoot = options.outputDir ?? config.outputDir ?? './src';
  const kebab = toKebabCase(specName);

  const expected: ValidateImplementationResult['expected'] = {};

  if (scan.specType === 'operation') {
    expected.handlerPath = fs.join(outRoot, 'handlers', `${kebab}.handler.ts`);
    expected.handlerTestPath = fs.join(
      outRoot,
      'handlers',
      `${kebab}.handler.test.ts`
    );
  }
  if (scan.specType === 'presentation') {
    expected.componentPath = fs.join(outRoot, 'components', `${kebab}.tsx`);
    expected.componentTestPath = fs.join(
      outRoot,
      'components',
      `${kebab}.test.tsx`
    );
  }
  if (scan.specType === 'form') {
    expected.formPath = fs.join(outRoot, 'forms', `${kebab}.form.tsx`);
    expected.formTestPath = fs.join(outRoot, 'forms', `${kebab}.form.test.tsx`);
  }

  if (options.checkHandlers && expected.handlerPath) {
    const handlerExists = await fs.exists(expected.handlerPath);
    if (!handlerExists) {
      errors.push(`Missing handler file: ${expected.handlerPath}`);
    } else {
      const handlerCode = await fs.readFile(expected.handlerPath);

      const expectedSpecVar = `${toPascalCase(specName.split('.').pop() ?? specName)}Spec`;
      const hasContractHandlerType = /ContractHandler<\s*typeof\s+\w+\s*>/.test(
        handlerCode
      );
      const referencesExpectedSpec = new RegExp(
        `typeof\\s+${expectedSpecVar}\\b`
      ).test(handlerCode);
      if (!hasContractHandlerType) {
        warnings.push(
          `Handler does not appear to type itself as ContractHandler<typeof Spec>: ${expected.handlerPath}`
        );
      } else if (!referencesExpectedSpec) {
        warnings.push(
          `Handler ContractHandler typing does not reference expected spec var (${expectedSpecVar}): ${expected.handlerPath}`
        );
      }
    }
  }

  if (options.checkTests) {
    const candidateTests = [
      expected.handlerTestPath,
      expected.componentTestPath,
      expected.formTestPath,
    ].filter((p): p is string => typeof p === 'string');

    for (const testPath of candidateTests) {
      const testExists = await fs.exists(testPath);
      if (!testExists) {
        errors.push(`Missing test file: ${testPath}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    expected,
  };
}
