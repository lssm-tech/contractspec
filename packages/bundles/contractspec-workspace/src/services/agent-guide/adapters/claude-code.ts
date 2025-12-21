/**
 * Claude Code Agent Adapter
 *
 * Formats implementation plans and prompts for Claude Code (Anthropic's
 * advanced coding agent mode).
 */

import type { AnyOperationSpec } from '@lssm/lib.contracts';
import type { AgentPrompt, ImplementationPlan } from '@lssm/lib.contracts/llm';
import { AGENT_SYSTEM_PROMPTS } from '@lssm/lib.contracts/llm';
import type { AgentAdapter } from '../types';

/**
 * Claude Code adapter implementation.
 * Optimized for Claude's extended thinking and code generation capabilities.
 */
export class ClaudeCodeAdapter implements AgentAdapter {
  agentType = 'claude-code' as const;

  /**
   * Format an implementation plan for Claude Code.
   * Uses structured markdown with clear sections and checklists.
   */
  formatPlan(plan: ImplementationPlan): AgentPrompt {
    const lines: string[] = [];

    // Header
    lines.push(`# Implement: ${plan.target.name}.v${plan.target.version}`);
    lines.push('');

    // Context section
    lines.push('## Context');
    lines.push('');
    lines.push(`**Goal:** ${plan.context.goal}`);
    lines.push('');
    lines.push(`**Description:** ${plan.context.description}`);
    lines.push('');
    if (plan.context.background) {
      lines.push(`**Background:**`);
      lines.push(plan.context.background);
      lines.push('');
    }

    // Full specification
    lines.push('## Specification');
    lines.push('');
    lines.push(plan.specMarkdown);
    lines.push('');

    // File structure
    if (plan.fileStructure.length > 0) {
      lines.push('## Files to Create/Modify');
      lines.push('');
      for (const file of plan.fileStructure) {
        const icon = file.type === 'create' ? '📝' : '✏️';
        lines.push(`${icon} \`${file.path}\``);
        lines.push(`   ${file.purpose}`);
        lines.push('');
      }
    }

    // Implementation steps
    lines.push('## Implementation Steps');
    lines.push('');
    for (const step of plan.steps) {
      lines.push(`### ${step.order}. ${step.title}`);
      lines.push('');
      lines.push(step.description);
      lines.push('');
      lines.push('**Acceptance Criteria:**');
      for (const criteria of step.acceptanceCriteria) {
        lines.push(`- [ ] ${criteria}`);
      }
      lines.push('');
    }

    // Constraints
    if (
      plan.constraints.policy.length > 0 ||
      plan.constraints.security.length > 0 ||
      plan.constraints.pii.length > 0
    ) {
      lines.push('## Constraints');
      lines.push('');

      if (plan.constraints.policy.length > 0) {
        lines.push('### Policy');
        for (const p of plan.constraints.policy) {
          lines.push(`- ${p}`);
        }
        lines.push('');
      }

      if (plan.constraints.security.length > 0) {
        lines.push('### Security');
        for (const s of plan.constraints.security) {
          lines.push(`- ⚠️ ${s}`);
        }
        lines.push('');
      }

      if (plan.constraints.pii.length > 0) {
        lines.push('### PII Handling');
        lines.push(
          'The following fields contain personally identifiable information:'
        );
        for (const pii of plan.constraints.pii) {
          lines.push(`- \`${pii}\``);
        }
        lines.push('');
      }
    }

    // Verification checklist
    lines.push('## Verification Checklist');
    lines.push('');
    lines.push('Before submitting, verify:');
    for (const check of plan.verificationChecklist) {
      lines.push(`- [ ] ${check}`);
    }
    lines.push('');

    // Instructions
    lines.push('## Instructions');
    lines.push('');
    lines.push('1. Implement each step in order');
    lines.push('2. Use TypeScript with strict typing (no `any`)');
    lines.push('3. Include JSDoc comments for public APIs');
    lines.push('4. Handle all error cases defined in the spec');
    lines.push('5. Emit events as specified');
    lines.push('6. Mark checklist items as you complete them');
    lines.push('');

    return {
      agent: 'claude-code',
      systemPrompt: AGENT_SYSTEM_PROMPTS['claude-code'],
      taskPrompt: lines.join('\n'),
    };
  }

  /**
   * Generate agent-specific configuration.
   * For Claude Code, this generates a prompt that can be used as context.
   */
  generateConfig(spec: AnyOperationSpec): string {
    const lines: string[] = [];

    lines.push('# ContractSpec Implementation Context');
    lines.push('');
    lines.push('This codebase uses ContractSpec for spec-first development.');
    lines.push('');
    lines.push('## Spec Details');
    lines.push('');
    lines.push(`- **Name:** ${spec.meta.name}`);
    lines.push(`- **Version:** ${spec.meta.version}`);
    lines.push(`- **Kind:** ${spec.meta.kind}`);
    lines.push(`- **Stability:** ${spec.meta.stability}`);
    lines.push('');
    lines.push('## Implementation Requirements');
    lines.push('');
    lines.push('1. Match input/output types exactly');
    lines.push('2. Handle all defined error cases');
    lines.push('3. Emit events as specified');
    lines.push('4. Respect policy constraints');
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Parse Claude Code output to extract generated code.
   */
  parseOutput(output: string): { code?: string; errors?: string[] } {
    // Extract code from markdown code blocks
    const codeBlockMatch = output.match(
      /```(?:typescript|ts|tsx)?\n([\s\S]*?)\n```/
    );

    if (codeBlockMatch?.[1]) {
      return { code: codeBlockMatch[1] };
    }

    // Check for error indicators
    const errors: string[] = [];
    const errorPatterns = [
      /error:\s*(.+)/gi,
      /failed:\s*(.+)/gi,
      /cannot\s+(.+)/gi,
    ];

    for (const pattern of errorPatterns) {
      const matches = output.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          errors.push(match[1]);
        }
      }
    }

    if (errors.length > 0) {
      return { errors };
    }

    // Return raw output if no code block found
    return { code: output };
  }
}

/** Singleton instance */
export const claudeCodeAdapter = new ClaudeCodeAdapter();
