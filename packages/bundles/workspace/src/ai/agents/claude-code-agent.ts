/**
 * Claude Code Agent - Uses Anthropic's advanced code capabilities
 * with extended context and agentic workflows
 */

import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import type { AgentProvider, AgentResult, AgentTask } from './types';

export class ClaudeCodeAgent implements AgentProvider {
  name = 'claude-code' as const;
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
  }

  canHandle(_task: AgentTask): boolean {
    return !!this.apiKey;
  }

  async generate(task: AgentTask): Promise<AgentResult> {
    if (!this.apiKey) {
      return {
        success: false,
        errors: [
          'ANTHROPIC_API_KEY not set. Claude Code agent requires API access.',
        ],
      };
    }

    try {
      // Use Claude with extended thinking and code-optimized prompts
      const model = anthropic('claude-3-7-sonnet-20250219');

      const systemPrompt = this.buildSystemPrompt(task);
      const userPrompt = this.buildUserPrompt(task);

      const result = await generateText({
        model,
        prompt: userPrompt,
        system: systemPrompt,
        temperature: 0.2, // Lower temperature for more deterministic code
      });

      // Extract code from response (Claude may wrap in markdown)
      const code = this.extractCode(result.text);

      return {
        success: true,
        code,
        metadata: {
          model: 'claude-3-7-sonnet',
          agentMode: 'claude-code',
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
        errors: ['ANTHROPIC_API_KEY not set'],
      };
    }

    try {
      const model = anthropic('claude-3-7-sonnet-20250219');

      const prompt = `
You are an expert code reviewer. Carefully analyze this implementation against its specification.

SPECIFICATION:
\`\`\`typescript
${task.specCode}
\`\`\`

IMPLEMENTATION:
\`\`\`typescript
${task.existingCode || '// No implementation provided'}
\`\`\`

Provide a structured validation report:

## Compliance
- Does the implementation fulfill all requirements in the spec?
- Are all inputs/outputs correctly typed?

## Code Quality
- Are there any bugs or potential issues?
- Is error handling adequate?
- Are best practices followed?

## Suggestions
- What improvements would you recommend?
- Are there any missing edge cases?

Be thorough and precise. Use a critical but constructive tone.
`;

      const result = await generateText({
        model,
        prompt,
        system:
          'You are a senior software engineer performing a critical code review.',
        temperature: 0.3,
      });

      // Analyze the review for issues
      const hasErrors = this.detectIssues(result.text);

      return {
        success: !hasErrors,
        code: result.text,
        errors: hasErrors ? this.extractErrors(result.text) : [],
        warnings: this.extractWarnings(result.text),
        suggestions: this.extractSuggestions(result.text),
        metadata: {
          agentMode: 'claude-code',
          validationType: 'comprehensive',
        },
      };
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  private buildSystemPrompt(task: AgentTask): string {
    const basePrompt = `You are an expert TypeScript developer specializing in contract-driven development.

Your code is:
- Type-safe with comprehensive TypeScript types
- Well-documented with JSDoc comments
- Production-ready with proper error handling
- Following SOLID principles and best practices
- Modular and testable

Generate clean, idiomatic TypeScript code that exactly matches the specification.`;

    if (task.type === 'test') {
      return (
        basePrompt +
        '\n\nYou are also an expert in testing. Write comprehensive tests using Vitest.'
      );
    }

    return basePrompt;
  }

  private buildUserPrompt(task: AgentTask): string {
    const prompts = {
      generate: `Generate a complete, production-ready implementation for this specification:\n\n${task.specCode}\n\nProvide ONLY the TypeScript code, no explanations.`,
      test: `Generate comprehensive tests for this code:\n\nSpec:\n${task.specCode}\n\nImplementation:\n${task.existingCode}\n\nProvide complete Vitest test suite.`,
      refactor: `Refactor this code while preserving functionality:\n\n${task.existingCode}\n\nSpec:\n${task.specCode}`,
      validate: `Validate this implementation:\n\nSpec:\n${task.specCode}\n\nCode:\n${task.existingCode}`,
    };

    return prompts[task.type] || prompts.generate;
  }

  private extractCode(text: string): string {
    // Extract code from markdown code blocks
    const codeBlockMatch = text.match(
      /```(?:typescript|ts|tsx)?\n([\s\S]*?)\n```/
    );
    if (codeBlockMatch && codeBlockMatch[1]) {
      return codeBlockMatch[1];
    }
    return text;
  }

  private detectIssues(reviewText: string): boolean {
    const errorIndicators = [
      'missing',
      'incorrect',
      'bug',
      'error',
      'violation',
      'does not',
      'fails to',
      'not implemented',
      'critical',
    ];

    const lowerText = reviewText.toLowerCase();
    return errorIndicators.some((indicator) => lowerText.includes(indicator));
  }

  private extractErrors(text: string): string[] {
    const errors: string[] = [];
    const lines = text.split('\n');

    for (const line of lines) {
      const lower = line.toLowerCase();
      if (
        lower.includes('error') ||
        lower.includes('bug') ||
        lower.includes('incorrect') ||
        lower.includes('missing')
      ) {
        errors.push(line.trim());
      }
    }

    return errors.length > 0 ? errors : ['Code review identified issues'];
  }

  private extractWarnings(text: string): string[] {
    const warnings: string[] = [];
    const lines = text.split('\n');

    for (const line of lines) {
      const lower = line.toLowerCase();
      if (
        lower.includes('warning') ||
        lower.includes('should') ||
        lower.includes('consider')
      ) {
        warnings.push(line.trim());
      }
    }

    return warnings;
  }

  private extractSuggestions(text: string): string[] {
    const suggestions: string[] = [];
    const lines = text.split('\n');

    for (const line of lines) {
      const lower = line.toLowerCase();
      if (
        lower.includes('suggest') ||
        lower.includes('recommend') ||
        lower.includes('could') ||
        lower.includes('improvement')
      ) {
        suggestions.push(line.trim());
      }
    }

    return suggestions;
  }
}
