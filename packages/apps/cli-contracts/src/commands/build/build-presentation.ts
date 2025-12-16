import chalk from 'chalk';
import type { AgentOrchestrator } from '../../ai/agents/index';
import type { Config } from '../../utils/config';
import { writeFileSafe } from '../../utils/fs';
import {
  generateComponentTemplate,
  generateTestTemplate,
} from '../../templates/handler.template';
import {
  generateTestsWithAgent,
  generateWithAgent,
  ensureTrailingNewline,
} from './agent-generation';
import { resolvePresentationPaths } from './paths';
import { toKebabCase } from './naming';
import { deriveNameFromFile, extractMetaValue } from './spec-detect';
import type { BuildOptions } from './types';

export async function buildPresentation(
  specFile: string,
  specCode: string,
  options: BuildOptions,
  config: Config,
  orchestrator: AgentOrchestrator | null
) {
  const specName =
    extractMetaValue(specCode, 'name') || deriveNameFromFile(specFile);
  const description =
    extractMetaValue(specCode, 'description') ||
    'Generated presentation component';
  const sanitizedName = toKebabCase(specName);
  const output = resolvePresentationPaths(
    specFile,
    sanitizedName,
    options,
    config
  );

  const componentResult = await generateWithAgent(
    orchestrator,
    config.agentMode,
    {
      label: 'component',
      target: 'component',
      specCode,
      targetPath: output.componentPath,
    }
  );

  const componentCode =
    componentResult?.code ?? generateComponentTemplate(specName, description);

  await writeFileSafe(
    output.componentPath,
    ensureTrailingNewline(componentCode)
  );

  console.log(chalk.green(`✅ Component written to ${output.componentPath}`));

  if (!options.noTests) {
    const testsResult = await generateTestsWithAgent(
      orchestrator,
      config.agentMode,
      {
        specCode,
        existingCode: componentCode,
        target: 'component',
      }
    );

    const testCode =
      testsResult?.code ?? generateTestTemplate(specName, 'component');
    await writeFileSafe(output.testPath, ensureTrailingNewline(testCode));

    console.log(chalk.green(`✅ Tests written to ${output.testPath}`));
  }

  console.log(chalk.cyan('\n✨ Build complete!'));
}



