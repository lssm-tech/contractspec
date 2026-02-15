/**
 * Build/scaffold service for generating implementation files from specs.
 *
 * Uses templates from @contractspec/module.workspace to generate
 * handler, component, and test skeletons without requiring AI.
 */

import {
  generateComponentTemplate,
  generateHandlerTemplate,
  generateTestTemplate,
  inferSpecTypeFromFilePath,
  scanSpecSource,
  type SpecScanResult,
} from '@contractspec/module.workspace';
import type { FsAdapter } from '../ports/fs';
import type { LoggerAdapter } from '../ports/logger';
import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts-spec';

/**
 * Build target types.
 */
export type BuildTarget = 'handler' | 'component' | 'test';

/**
 * Options for building from a spec.
 */
export interface BuildSpecOptions {
  /**
   * Which artifacts to generate.
   */
  targets?: BuildTarget[];

  /**
   * Override output directory.
   */
  outputDir?: string;

  /**
   * Whether to overwrite existing files.
   */
  overwrite?: boolean;

  /**
   * Skip writing files (dry run).
   */
  dryRun?: boolean;
}

/**
 * Result of a single build target.
 */
export interface BuildTargetResult {
  target: BuildTarget;
  outputPath: string;
  success: boolean;
  skipped?: boolean;
  error?: string;
}

/**
 * Result of building from a spec.
 */
export interface BuildSpecResult {
  specPath: string;
  specInfo: SpecScanResult;
  results: BuildTargetResult[];
}

/**
 * Build implementation files from a spec.
 */
export async function buildSpec(
  specPath: string,
  adapters: {
    fs: FsAdapter;
    logger: LoggerAdapter;
    workspace?: typeof import('@contractspec/module.workspace');
  },
  config: ResolvedContractsrcConfig,
  options: BuildSpecOptions = {}
): Promise<BuildSpecResult> {
  const { fs, logger, workspace } = adapters;

  // Use injected modules or defaults
  const scan = workspace?.scanSpecSource ?? scanSpecSource;
  const inferType =
    workspace?.inferSpecTypeFromFilePath ?? inferSpecTypeFromFilePath;
  const genHandler =
    workspace?.generateHandlerTemplate ?? generateHandlerTemplate;
  const genComponent =
    workspace?.generateComponentTemplate ?? generateComponentTemplate;
  const genTest = workspace?.generateTestTemplate ?? generateTestTemplate;

  const {
    targets = detectDefaultTargets(specPath, inferType),
    outputDir = config.outputDir,
    overwrite = false,
    dryRun = false,
  } = options;

  // Read and scan spec
  const specCode = await fs.readFile(specPath);
  const specInfo = scan(specCode, specPath);
  const specType = inferType(specPath);

  logger.info(`Building from spec: ${specPath}`, { specType });

  const results: BuildTargetResult[] = [];

  for (const target of targets) {
    try {
      const result = await buildTarget(
        target,
        specPath,
        specCode,
        specInfo,
        specType,
        { fs, logger },
        outputDir,
        overwrite,
        dryRun,
        { genHandler, genComponent, genTest }
      );
      results.push(result);
    } catch (error) {
      results.push({
        target,
        outputPath: '',
        success: false,
        error: error instanceof Error ? error.message : String(error),
        skipped: false, // Default to false unless overridden
      });
    }
  }

  return {
    specPath,
    specInfo,
    results,
  };
}

/**
 * Build a single target from a spec.
 */
async function buildTarget(
  target: BuildTarget,
  specPath: string,
  _specCode: string,
  specInfo: SpecScanResult,
  specType: string,
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  outputDir: string,
  overwrite: boolean,
  dryRun: boolean,
  generators: {
    genHandler: typeof generateHandlerTemplate;
    genComponent: typeof generateComponentTemplate;
    genTest: typeof generateTestTemplate;
  }
): Promise<BuildTargetResult> {
  const { fs, logger } = adapters;
  const { genHandler, genComponent, genTest } = generators;

  let code: string;
  let outputPath: string;

  switch (target) {
    case 'handler': {
      if (specType !== 'operation') {
        return {
          target,
          outputPath: '',
          success: false,
          skipped: true,
          error: `Handler generation only supported for operation specs (got ${specType})`,
        };
      }

      const kind =
        specInfo.kind === 'command' || specInfo.kind === 'query'
          ? specInfo.kind
          : 'command';

      code = genHandler(specInfo.key ?? 'unknown', kind);
      outputPath = resolveOutputPath(
        specPath,
        outputDir,
        'handlers',
        specInfo.key ?? 'unknown',
        '.handler.ts',
        adapters.fs
      );
      break;
    }

    case 'component': {
      if (specType !== 'presentation') {
        return {
          target,
          outputPath: '',
          success: false,
          skipped: true,
          error: `Component generation only supported for presentation specs (got ${specType})`,
        };
      }

      code = genComponent(
        specInfo.key ?? 'unknown',
        specInfo.description ?? ''
      );
      outputPath = resolveOutputPath(
        specPath,
        outputDir,
        'components',
        specInfo.key ?? 'unknown',
        '.tsx',
        adapters.fs
      );
      break;
    }

    case 'test': {
      const testType = specType === 'operation' ? 'handler' : 'component';
      code = genTest(specInfo.key ?? 'unknown', testType);
      outputPath = resolveOutputPath(
        specPath,
        outputDir,
        '__tests__',
        specInfo.key ?? 'unknown',
        '.test.ts',
        adapters.fs
      );
      break;
    }

    default:
      return {
        target,
        outputPath: '',
        success: false,
        error: `Unknown target: ${target}`,
      };
  }

  // Check if file exists
  const exists = await fs.exists(outputPath);
  if (exists && !overwrite) {
    return {
      target,
      outputPath,
      success: false,
      skipped: true,
      error: 'File already exists (use overwrite option)',
    };
  }

  if (dryRun) {
    logger.info(`[dry-run] Would write: ${outputPath}`);
    return {
      target,
      outputPath,
      success: true,
    };
  }

  // Ensure directory exists
  const dirPath = fs.dirname(outputPath);
  await fs.mkdir(dirPath);

  // Write file
  await fs.writeFile(outputPath, code);
  logger.info(`Generated: ${outputPath}`);

  return {
    target,
    outputPath,
    success: true,
  };
}

/**
 * Detect default targets based on spec type.
 */
function detectDefaultTargets(
  specPath: string,
  inferType: typeof inferSpecTypeFromFilePath
): BuildTarget[] {
  const specType = inferType(specPath);

  switch (specType) {
    case 'operation':
      return ['handler'];
    case 'presentation':
      return ['component'];
    default:
      return [];
  }
}

/**
 * Resolve output path for generated file.
 */
function resolveOutputPath(
  specPath: string,
  outputDir: string,
  subdir: string,
  specName: string,
  extension: string,
  fs: FsAdapter
): string {
  const sanitizedName = toKebabCase(specName.split('.').pop() ?? 'unknown');

  let baseDir: string;
  if (outputDir.startsWith('.')) {
    // Relative to spec file location
    baseDir = fs.resolve(fs.dirname(specPath), '..', outputDir, subdir);
  } else {
    // Absolute or relative to cwd
    baseDir = fs.resolve(outputDir, subdir);
  }

  return fs.join(baseDir, `${sanitizedName}${extension}`);
}

/**
 * Convert string to kebab-case.
 */
function toKebabCase(str: string): string {
  return str
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}
