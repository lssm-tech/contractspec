import type { FsAdapter } from '../../ports/fs';
import { basename, dirname, join } from 'path';
import { AgentOrchestrator } from '../../ai/agents/orchestrator';
import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts';

export interface ImplementationValidatorOptions {
  implementationPath?: string;
}

export interface ImplementationValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  report?: string;
}

export async function validateImplementationWithAgent(
  specFile: string,
  specCode: string,
  config: ResolvedContractsrcConfig,
  options: ImplementationValidatorOptions,
  adapters: { fs: FsAdapter }
): Promise<ImplementationValidationResult> {
  const { fs } = adapters;

  // Find implementation file
  let implementationPath = options.implementationPath;

  if (!implementationPath) {
    // Try to infer from spec file path
    const specDir = dirname(specFile);
    const specBaseName = basename(specFile, '.ts');

    // Try common patterns
    const possiblePaths = [
      join(specDir, specBaseName.replace('.contracts', '.handler') + '.ts'),
      join(specDir, specBaseName.replace('.presentation', '') + '.tsx'),
      join(specDir, specBaseName.replace('.form', '.form') + '.tsx'),
      join(
        dirname(specDir),
        'handlers',
        specBaseName.replace('.contracts', '.handler') + '.ts'
      ),
      join(
        dirname(specDir),
        'components',
        specBaseName.replace('.presentation', '') + '.tsx'
      ),
    ];

    for (const path of possiblePaths) {
      if (await fs.exists(path)) {
        implementationPath = path;
        break;
      }
    }
  }

  if (!implementationPath || !(await fs.exists(implementationPath))) {
    return {
      success: true, // Not an error if file not found, just nothing to validate
      errors: [],
      warnings: [
        'Implementation file not found. Specify with --implementation-path',
      ],
      suggestions: [],
    };
  }

  const implementationCode = await fs.readFile(implementationPath);

  // Use agent orchestrator to validate
  const orchestrator = new AgentOrchestrator(config);
  const result = await orchestrator.validate(specCode, implementationCode);

  return {
    success: result.success,
    errors: result.errors || [],
    warnings: result.warnings || [],
    suggestions: result.suggestions || [],
    report: result.code,
  };
}
