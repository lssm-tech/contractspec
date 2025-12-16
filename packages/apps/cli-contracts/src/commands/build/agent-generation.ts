import chalk from 'chalk';
import ora from 'ora';
import type { AgentOrchestrator } from '../../ai/agents/index';
import type { AgentResult } from '../../ai/agents/types';
import type { GenerationTarget, TestTarget } from './types';

export async function generateWithAgent(
  orchestrator: AgentOrchestrator | null,
  agentMode: string,
  task: {
    label: string;
    target: GenerationTarget;
    specCode: string;
    targetPath?: string;
  }
): Promise<{ code: string; result: AgentResult } | null> {
  if (!orchestrator) {
    return null;
  }

  const spinner = ora(
    `🤖 Generating ${task.label} using ${agentMode} agent...`
  ).start();
  try {
    const result = await orchestrator.generate(task.specCode, task.targetPath);

    if (result.success && result.code) {
      spinner.succeed(chalk.green(`Agent generated ${task.label}`));
      logAgentInsights(result);
      return { code: stripCode(result.code), result };
    }

    spinner.warn(
      chalk.yellow(
        `Agent could not produce a ${task.label}. Falling back to template.`
      )
    );
    logAgentInsights(result);
    return null;
  } catch (error) {
    spinner.fail(
      chalk.red(
        `Agent execution failed for ${task.label}: ${error instanceof Error ? error.message : String(error)}`
      )
    );
    return null;
  }
}

export async function generateTestsWithAgent(
  orchestrator: AgentOrchestrator | null,
  agentMode: string,
  task: {
    specCode: string;
    existingCode: string;
    target: TestTarget;
  }
): Promise<{ code: string; result: AgentResult } | null> {
  if (!orchestrator) {
    return null;
  }

  const spinner = ora(
    `🤖 Generating ${task.target} tests using ${agentMode} agent...`
  ).start();
  try {
    const result = await orchestrator.generateTests(
      task.specCode,
      task.existingCode
    );

    if (result.success && result.code) {
      spinner.succeed(chalk.green(`Agent generated ${task.target} tests`));
      logAgentInsights(result);
      return { code: stripCode(result.code), result };
    }

    spinner.warn(
      chalk.yellow(
        `Agent could not produce ${task.target} tests. Falling back to template.`
      )
    );
    logAgentInsights(result);
    return null;
  } catch (error) {
    spinner.fail(
      chalk.red(
        `Agent execution failed for tests: ${error instanceof Error ? error.message : String(error)}`
      )
    );
    return null;
  }
}

export function stripCode(text: string): string {
  const codeBlock = text.match(/```[a-zA-Z]*\n([\s\S]*?)```/);
  if (codeBlock && codeBlock[1]) {
    return codeBlock[1].trim();
  }
  return text.trim();
}

export function ensureTrailingNewline(code: string): string {
  return code.endsWith('\n') ? code : `${code}\n`;
}

function logAgentInsights(result?: AgentResult | null) {
  if (!result) {
    return;
  }

  if (result.warnings && result.warnings.length > 0) {
    console.log(chalk.yellow('\n  ⚠️  Agent warnings:'));
    result.warnings.forEach((warning) =>
      console.log(chalk.yellow(`     • ${warning}`))
    );
  }

  if (result.suggestions && result.suggestions.length > 0) {
    console.log(chalk.cyan('\n  💡 Agent suggestions:'));
    result.suggestions.forEach((suggestion) =>
      console.log(chalk.cyan(`     • ${suggestion}`))
    );
  }
}


