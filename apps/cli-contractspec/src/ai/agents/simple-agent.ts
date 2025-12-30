/**
 * Simple LLM-based agent using direct API calls
 * This is the default fallback for basic code generation
 */

import { generateText } from 'ai';
import { getAIProvider } from '../providers';
import type { Config } from '../../utils/config';
import type { AgentProvider, AgentResult, AgentTask } from './types';
import {
  buildComponentPrompt,
  buildFormPrompt,
  buildHandlerPrompt,
  buildTestPrompt,
  getCodeGenSystemPrompt,
} from '../prompts/code-generation';

export class SimpleAgent implements AgentProvider {
  name = 'simple' as const;

  constructor(private config: Config) {}

  canHandle(_task: AgentTask): boolean {
    // Simple agent can handle all tasks as a fallback
    return true;
  }

  async generate(task: AgentTask): Promise<AgentResult> {
    try {
      const model = getAIProvider(this.config);
      const prompt = this.buildPrompt(task);

      const result = await generateText({
        model,
        prompt,
        system: getCodeGenSystemPrompt(),
      });

      return {
        success: true,
        code: result.text,
        metadata: {
          model: this.config.aiModel,
          provider: this.config.aiProvider,
          tokens: result.usage,
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
    try {
      const model = getAIProvider(this.config);

      const prompt = `
Review the following implementation against its specification.

Specification:
${task.specCode}

Implementation:
${task.existingCode || '// No implementation provided'}

Provide a detailed validation report:
1. Does the implementation match the spec?
2. Are there any missing features?
3. Are there any bugs or issues?
4. Suggestions for improvement
`;

      const result = await generateText({
        model,
        prompt,
        system:
          'You are a code review expert. Provide thorough, constructive feedback.',
      });

      // Parse validation result
      const hasErrors =
        result.text.toLowerCase().includes('error') ||
        result.text.toLowerCase().includes('missing') ||
        result.text.toLowerCase().includes('incorrect');

      return {
        success: !hasErrors,
        code: result.text,
        warnings: hasErrors
          ? ['Implementation may not match specification']
          : [],
        metadata: {
          validationType: 'simple-llm',
        },
      };
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  private buildPrompt(task: AgentTask): string {
    switch (task.type) {
      case 'generate':
        // Infer what to generate from spec
        if (
          task.specCode.includes('.contracts.') ||
          task.specCode.includes('kind:')
        ) {
          return buildHandlerPrompt(task.specCode);
        } else if (task.specCode.includes('.presentation.')) {
          return buildComponentPrompt(task.specCode);
        } else if (task.specCode.includes('.form.')) {
          return buildFormPrompt(task.specCode);
        }
        return `Generate implementation for:\n${task.specCode}`;

      case 'test':
        return buildTestPrompt(
          task.specCode,
          task.existingCode || '',
          'handler'
        );

      case 'validate':
        return `Validate this implementation:\n${task.existingCode}`;

      default:
        return task.specCode;
    }
  }
}
