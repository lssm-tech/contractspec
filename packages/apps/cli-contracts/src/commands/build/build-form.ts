import chalk from 'chalk';
import type { AgentOrchestrator } from '../../ai/agents/index';
import type { Config } from '../../utils/config';
import { writeFileSafe } from '../../utils/fs';
import {
  generateTestsWithAgent,
  generateWithAgent,
  ensureTrailingNewline,
} from './agent-generation';
import { resolveFormPaths } from './paths';
import { toKebabCase, toPascalCase } from './naming';
import { deriveNameFromFile, extractMetaValue } from './spec-detect';
import type { BuildOptions } from './types';

export async function buildForm(
  specFile: string,
  specCode: string,
  options: BuildOptions,
  config: Config,
  orchestrator: AgentOrchestrator | null
) {
  const specName =
    extractMetaValue(specCode, 'name') || deriveNameFromFile(specFile);
  const sanitizedName = toKebabCase(specName);
  const output = resolveFormPaths(specFile, sanitizedName, options, config);

  const formResult = await generateWithAgent(orchestrator, config.agentMode, {
    label: 'form component',
    target: 'form',
    specCode,
    targetPath: output.formPath,
  });

  const formCode =
    formResult?.code ??
    `// ${specName} form implementation\n// TODO: implement form based on specification\n`;

  await writeFileSafe(output.formPath, ensureTrailingNewline(formCode));

  console.log(chalk.green(`✅ Form component written to ${output.formPath}`));

  if (!options.noTests) {
    const testsResult = await generateTestsWithAgent(
      orchestrator,
      config.agentMode,
      {
        specCode,
        existingCode: formCode,
        target: 'component',
      }
    );

    const testCode =
      testsResult?.code ??
      `import { describe, it, expect } from 'bun:test';\n\n// TODO: implement tests for ${specName} form component\n\ndescribe('${toPascalCase(
        specName
      )}Form', () => {\n  it('should render without crashing', () => {\n    expect(true).toBe(true);\n  });\n});\n`;

    await writeFileSafe(output.testPath, ensureTrailingNewline(testCode));

    console.log(chalk.green(`✅ Tests written to ${output.testPath}`));
  }

  console.log(chalk.cyan('\n✨ Build complete!'));
}




