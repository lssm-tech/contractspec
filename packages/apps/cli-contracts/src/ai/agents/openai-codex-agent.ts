/**
 * OpenAI Codex Agent - Uses OpenAI's code-optimized models
 * Supports GPT-4o and o1 reasoning models for complex code generation
 */

import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import type { AgentProvider, AgentResult, AgentTask } from './types';

export class OpenAICodexAgent implements AgentProvider {
  name = 'openai-codex' as const;
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
  }

  canHandle(task: AgentTask): boolean {
    return !!this.apiKey;
  }

  async generate(task: AgentTask): Promise<AgentResult> {
    if (!this.apiKey) {
      return {
        success: false,
        errors: [
          'OPENAI_API_KEY not set. OpenAI Codex agent requires API access.',
        ],
      };
    }

    try {
      // Use o1 for complex generation, gpt-4o for standard
      const isComplex = this.isComplexTask(task);
      const modelName = isComplex ? 'o1' : 'gpt-4o';
      const model = openai(modelName);

      const systemPrompt = this.buildSystemPrompt(task);
      const userPrompt = this.buildUserPrompt(task);

      const result = await generateText({
        model,
        prompt: userPrompt,
        system: systemPrompt,
        temperature: 0.2,
      });

      const code = this.extractCode(result.text);

      return {
        success: true,
        code,
        metadata: {
          model: modelName,
          agentMode: 'openai-codex',
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
    if (!this.apiKey) {
      return {
        success: false,
        errors: ['OPENAI_API_KEY not set'],
      };
    }

    try {
      const model = openai('gpt-4o');

      const prompt = `
Review this code implementation against its specification.

SPECIFICATION:
\`\`\`typescript
${task.specCode}
\`\`\`

IMPLEMENTATION:
\`\`\`typescript
${task.existingCode || '// No implementation'}
\`\`\`

Provide a detailed validation report including:
1. Specification compliance
2. Code quality assessment
3. Potential bugs or issues
4. Recommendations for improvement

Format as a structured report.
`;

      const result = await generateText({
        model,
        prompt,
        system:
          'You are a senior software engineer performing thorough code review.',
        temperature: 0.3,
      });

      const hasIssues = this.detectIssues(result.text);

      return {
        success: !hasIssues,
        code: result.text,
        errors: hasIssues ? this.extractErrors(result.text) : [],
        warnings: this.extractWarnings(result.text),
        metadata: {
          agentMode: 'openai-codex',
          validationType: 'ai-review',
        },
      };
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  private isComplexTask(task: AgentTask): boolean {
    // Use o1 reasoning model for complex tasks
    const complexIndicators = [
      'algorithm',
      'optimization',
      'complex logic',
      'state management',
      'concurrent',
      'distributed',
    ];

    const taskStr = (task.specCode + (task.existingCode || '')).toLowerCase();
    return complexIndicators.some((indicator) => taskStr.includes(indicator));
  }

  private buildSystemPrompt(task: AgentTask): string {
    const basePrompt = `You are an expert TypeScript/JavaScript developer.

Generate production-quality code that is:
- Type-safe and well-typed
- Documented with clear comments
- Following best practices and SOLID principles
- Properly handling errors and edge cases
- Testable and maintainable

Output only the code without explanations unless specifically asked.`;

    if (task.type === 'test') {
      return (
        basePrompt + '\n\nGenerate comprehensive test suites using Vitest.'
      );
    }

    return basePrompt;
  }

  private buildUserPrompt(task: AgentTask): string {
    switch (task.type) {
      case 'generate':
        return `Implement this specification:\n\n${task.specCode}\n\nProvide complete, production-ready TypeScript code.`;

      case 'test':
        return `Create comprehensive tests:\n\nSpec:\n${task.specCode}\n\nImplementation:\n${task.existingCode}\n\nGenerate complete Vitest test suite.`;

      case 'refactor':
        return `Refactor this code while maintaining functionality:\n\n${task.existingCode}\n\nSpec:\n${task.specCode}`;

      default:
        return task.specCode;
    }
  }

  private extractCode(text: string): string {
    // Extract from markdown code blocks
    const match = text.match(
      /```(?:typescript|ts|tsx|javascript|js)?\n([\s\S]*?)\n```/
    );
    return match && match[1] ? match[1] : text;
  }

  private detectIssues(text: string): boolean {
    const issueKeywords = [
      'issue',
      'problem',
      'bug',
      'error',
      'incorrect',
      'missing',
      'fails',
      'violation',
    ];

    const lower = text.toLowerCase();
    return issueKeywords.some((keyword) => lower.includes(keyword));
  }

  private extractErrors(text: string): string[] {
    const errors: string[] = [];
    const lines = text.split('\n');

    for (const line of lines) {
      if (
        line.toLowerCase().includes('error') ||
        line.toLowerCase().includes('bug') ||
        line.toLowerCase().includes('fails')
      ) {
        errors.push(line.trim());
      }
    }

    return errors;
  }

  private extractWarnings(text: string): string[] {
    const warnings: string[] = [];
    const lines = text.split('\n');

    for (const line of lines) {
      if (
        line.toLowerCase().includes('warning') ||
        line.toLowerCase().includes('should') ||
        line.toLowerCase().includes('consider')
      ) {
        warnings.push(line.trim());
      }
    }

    return warnings;
  }
}
