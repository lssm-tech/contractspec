import chalk from 'chalk';
import type { AgentOrchestrator } from '../../ai/agents/index';
import type { Config } from '../../utils/config';
import { writeFileSafe } from '../../utils/fs';
import {
  generateHandlerTemplate,
  generateTestTemplate,
} from '../../templates/handler.template';
import {
  generateTestsWithAgent,
  generateWithAgent,
  ensureTrailingNewline,
} from './agent-generation';
import { resolveOperationPaths } from './paths';
import { toKebabCase } from './naming';
import {
  deriveNameFromFile,
  extractMetaValue,
  extractOperationKind,
} from './spec-detect';

import type { BuildOptions } from './types';

export async function buildOperation(
  specFile: string,
  specCode: string,
  options: BuildOptions,
  config: Config,
  orchestrator: AgentOrchestrator | null
) {
  const specName =
    extractMetaValue(specCode, 'name') || deriveNameFromFile(specFile);
  const operationKind = extractOperationKind(specCode) || 'command';
  const sanitizedName = toKebabCase(specName);
  const output = resolveOperationPaths(
    specFile,
    sanitizedName,
    options,
    config
  );

  const handlerResult = await generateWithAgent(
    orchestrator,
    config.agentMode,
    {
      label: 'handler',
      target: 'handler',
      specCode,
      targetPath: output.handlerPath,
    }
  );

  const handlerCode =
    handlerResult?.code ?? generateHandlerTemplate(specName, operationKind);
  await writeFileSafe(output.handlerPath, ensureTrailingNewline(handlerCode));

  console.log(chalk.green(`✅ Handler written to ${output.handlerPath}`));

  if (!options.noTests) {
    const testsResult = await generateTestsWithAgent(
      orchestrator,
      config.agentMode,
      {
        specCode,
        existingCode: handlerCode,
        target: 'handler',
      }
    );

    const testCode =
      testsResult?.code ?? generateTestTemplate(specName, 'handler');
    await writeFileSafe(output.testPath, ensureTrailingNewline(testCode));

    console.log(chalk.green(`✅ Tests written to ${output.testPath}`));
  }

  console.log(chalk.cyan('\n✨ Build complete!'));
}


