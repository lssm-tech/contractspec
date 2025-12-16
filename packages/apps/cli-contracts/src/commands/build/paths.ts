import { dirname, join, relative, resolve as resolvePath } from 'node:path';
import type { Config } from '../../utils/config';
import type { BuildOptions } from './types';

export function resolveOperationPaths(
  specFile: string,
  sanitizedName: string,
  options: BuildOptions,
  config: Config
) {
  const baseDir = resolveBaseOutputDir(options, config, 'handlers');
  const handlerDir = baseDir ?? join(dirname(specFile), '..', 'handlers');
  const normalizedHandlerDir = handlerDir.endsWith('handlers')
    ? handlerDir
    : join(handlerDir, 'handlers');

  return {
    handlerPath: join(normalizedHandlerDir, `${sanitizedName}.handler.ts`),
    testPath: join(normalizedHandlerDir, `${sanitizedName}.handler.test.ts`),
  };
}

export function resolvePresentationPaths(
  specFile: string,
  sanitizedName: string,
  options: BuildOptions,
  config: Config
) {
  const baseDir = resolveBaseOutputDir(options, config, 'components');
  const componentDir = baseDir ?? join(dirname(specFile), '..', 'components');
  const normalizedComponentDir = componentDir.endsWith('components')
    ? componentDir
    : join(componentDir, 'components');

  return {
    componentPath: join(normalizedComponentDir, `${sanitizedName}.tsx`),
    testPath: join(normalizedComponentDir, `${sanitizedName}.test.tsx`),
  };
}

export function resolveFormPaths(
  specFile: string,
  sanitizedName: string,
  options: BuildOptions,
  config: Config
) {
  const baseDir = resolveBaseOutputDir(options, config, 'forms');
  const formsDir = baseDir ?? join(dirname(specFile), '..', 'forms');
  const normalizedFormsDir = formsDir.endsWith('forms')
    ? formsDir
    : join(formsDir, 'forms');

  return {
    formPath: join(normalizedFormsDir, `${sanitizedName}.form.tsx`),
    testPath: join(normalizedFormsDir, `${sanitizedName}.form.test.tsx`),
  };
}

export function resolveDataViewRendererPath(
  specFile: string,
  sanitizedName: string,
  options: BuildOptions,
  config: Config
) {
  const baseDir = resolveBaseOutputDir(options, config, 'views');
  const targetDir = baseDir ?? dirname(specFile);
  return join(targetDir, `${sanitizedName}.renderer.tsx`);
}

export function resolveWorkflowRunnerPath(
  specFile: string,
  sanitizedName: string,
  options: BuildOptions,
  config: Config
) {
  const baseDir = resolveBaseOutputDir(options, config, 'workflows');
  const targetDir = baseDir ?? dirname(specFile);
  return join(targetDir, `${sanitizedName}.runner.ts`);
}

export function resolveBaseOutputDir(
  options: BuildOptions,
  config: Config,
  subdir: string
): string | null {
  const explicit = options.outputDir || config.outputDir;
  if (!explicit) {
    return null;
  }

  const resolved = explicit.startsWith('.')
    ? resolvePath(process.cwd(), explicit, subdir)
    : resolvePath(explicit, subdir);

  return resolved;
}

export function computeRelativeImport(
  specFile: string,
  targetPath: string
): string {
  const relativePath = relative(dirname(targetPath), specFile)
    .replace(/\\/g, '/')
    .replace(/\.ts$/, '');
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

