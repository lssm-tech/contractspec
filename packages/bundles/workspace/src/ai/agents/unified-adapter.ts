/**
 * Adapter for UnifiedAgent to work with Workspace AgentOrchestrator.
 */

import type { AgentProvider, AgentResult, AgentTask } from './types';
import type { AgentMode } from '@contractspec/lib.contracts';
import {
  type AgentSpec,
  createUnifiedAgent,
  UnifiedAgent,
  type UnifiedAgentConfig,
} from '@contractspec/lib.ai-agent';

export class UnifiedAgentAdapter implements AgentProvider {
  private agent: UnifiedAgent;

  constructor(
    public readonly name: AgentMode,
    config: UnifiedAgentConfig,
    spec: AgentSpec = {
      meta: {
        key: 'workspace-agent',
        version: '1.0.0',
        description: 'Workspace Agent',
        stability: 'experimental',
        owners: [],
        tags: [],
      },
      instructions:
        'You are an expert software engineer implementing specifications.',
      tools: [],
    }
  ) {
    this.agent = createUnifiedAgent(spec, config);
  }

  canHandle(_task: AgentTask): boolean {
    return true;
  }

  async generate(task: AgentTask): Promise<AgentResult> {
    try {
      const prompt = this.buildPrompt(task);
      const result = await this.agent.run(prompt);

      return {
        success: true,
        code: result.text,
        metadata: {
          finishReason: result.finishReason,
          usage: result.usage,
        },
      };
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  async validate(task: AgentTask): Promise<AgentResult> {
    return this.generate(task);
  }

  private buildPrompt(task: AgentTask): string {
    let prompt = '';

    if (task.specCode) {
      prompt += `Specification:\n${task.specCode}\n\n`;
    }

    if (task.existingCode) {
      prompt += `Existing Code:\n${task.existingCode}\n\n`;
    }

    switch (task.type) {
      case 'generate':
        prompt +=
          'Generate implementation code based on the specification above.';
        break;
      case 'validate':
        prompt +=
          'Validate if the existing code implements the specification correctly. Report any issues.';
        break;
      case 'refactor':
        prompt +=
          'Refactor the existing code to better match the specification and improve quality.';
        break;
      case 'test':
        prompt +=
          'Generate tests for the existing code based on the specification.';
        break;
    }

    return prompt;
  }
}
