/**
 * Generic MCP Agent Adapter
 *
 * Formats implementation plans and prompts for any MCP-compatible agent.
 * Uses standard MCP resource/prompt/tool patterns.
 */

import type { AnyOperationSpec } from '@contractspec/lib.contracts-spec';
import type {
  AgentPrompt,
  ImplementationPlan,
} from '@contractspec/lib.contracts-spec/llm';
import { AGENT_SYSTEM_PROMPTS } from '@contractspec/lib.contracts-spec/llm';
import type { AgentAdapter } from '../types';

/**
 * Generic MCP adapter implementation.
 * Works with any MCP-compatible agent (Cline, Aider, etc.).
 */
export class GenericMCPAdapter implements AgentAdapter {
  agentType = 'generic-mcp' as const;

  /**
   * Format an implementation plan for generic MCP agents.
   * Uses a standard markdown format that works across different agents.
   */
  formatPlan(plan: ImplementationPlan): AgentPrompt {
    const lines: string[] = [];

    // Standard header
    lines.push(
      `# Implementation Task: ${plan.target.key}.v${plan.target.version}`
    );
    lines.push('');

    // Task description
    lines.push('## Task');
    lines.push('');
    lines.push(
      `Implement the ${plan.target.type} \`${plan.target.key}\` version ${plan.target.version}.`
    );
    lines.push('');

    // Context
    lines.push('## Context');
    lines.push('');
    lines.push(`**Goal:** ${plan.context.goal}`);
    lines.push('');
    lines.push(`**Description:** ${plan.context.description}`);
    lines.push('');
    if (plan.context.background) {
      lines.push('**Background:**');
      lines.push('');
      lines.push(plan.context.background);
      lines.push('');
    }

    // Specification
    lines.push('## Specification');
    lines.push('');
    lines.push(plan.specMarkdown);
    lines.push('');

    // Files
    if (plan.fileStructure.length > 0) {
      lines.push('## Files');
      lines.push('');
      lines.push('| Path | Action | Purpose |');
      lines.push('|------|--------|---------|');
      for (const file of plan.fileStructure) {
        lines.push(`| \`${file.path}\` | ${file.type} | ${file.purpose} |`);
      }
      lines.push('');
    }

    // Steps
    lines.push('## Implementation Steps');
    lines.push('');
    for (const step of plan.steps) {
      lines.push(`### Step ${step.order}: ${step.title}`);
      lines.push('');
      lines.push(step.description);
      lines.push('');
      if (step.acceptanceCriteria.length > 0) {
        lines.push('**Acceptance Criteria:**');
        lines.push('');
        for (const criteria of step.acceptanceCriteria) {
          lines.push(`- ${criteria}`);
        }
        lines.push('');
      }
    }

    // Constraints
    lines.push('## Constraints');
    lines.push('');

    if (plan.constraints.policy.length > 0) {
      lines.push('**Policy:**');
      for (const p of plan.constraints.policy) {
        lines.push(`- ${p}`);
      }
      lines.push('');
    }

    if (plan.constraints.security.length > 0) {
      lines.push('**Security:**');
      for (const s of plan.constraints.security) {
        lines.push(`- ${s}`);
      }
      lines.push('');
    }

    if (plan.constraints.pii.length > 0) {
      lines.push('**PII Fields (handle with care):**');
      for (const pii of plan.constraints.pii) {
        lines.push(`- \`${pii}\``);
      }
      lines.push('');
    }

    // Verification
    lines.push('## Verification');
    lines.push('');
    lines.push('After implementation, verify:');
    lines.push('');
    for (const check of plan.verificationChecklist) {
      lines.push(`- [ ] ${check}`);
    }
    lines.push('');

    return {
      agent: 'generic-mcp',
      systemPrompt: AGENT_SYSTEM_PROMPTS['generic-mcp'],
      taskPrompt: lines.join('\n'),
    };
  }

  /**
   * Format the plan as an MCP resource.
   * Returns JSON that can be served as an MCP resource.
   */
  formatAsResource(plan: ImplementationPlan): {
    uri: string;
    mimeType: string;
    data: string;
  } {
    return {
      uri: `spec://${plan.target.key}/v${plan.target.version}/plan`,
      mimeType: 'application/json',
      data: JSON.stringify(
        {
          target: plan.target,
          context: plan.context,
          fileStructure: plan.fileStructure,
          steps: plan.steps,
          constraints: plan.constraints,
          verificationChecklist: plan.verificationChecklist,
        },
        null,
        2
      ),
    };
  }

  /**
   * Format the plan as an MCP prompt message.
   */
  formatAsPromptMessage(plan: ImplementationPlan): {
    role: 'user' | 'assistant';
    content: { type: 'text'; text: string };
  } {
    const prompt = this.formatPlan(plan);
    return {
      role: 'user',
      content: {
        type: 'text',
        text: prompt.taskPrompt,
      },
    };
  }

  /**
   * Generate configuration (generic markdown for any agent).
   */
  generateConfig(spec: AnyOperationSpec): string {
    const m = spec.meta;
    const lines: string[] = [];

    lines.push(`# ${m.key} v${m.version}`);
    lines.push('');
    lines.push(`**Type:** ${m.kind}`);
    lines.push(`**Stability:** ${m.stability}`);
    lines.push('');
    lines.push('## Goal');
    lines.push('');
    lines.push(m.goal);
    lines.push('');
    lines.push('## Description');
    lines.push('');
    lines.push(m.description);
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Parse agent output - generic implementation.
   */
  parseOutput(output: string): { code?: string; errors?: string[] } {
    // Try to extract code from markdown code blocks
    const codeBlockMatch = output.match(
      /```(?:typescript|ts|tsx|javascript|js|python|go|rust)?\n([\s\S]*?)\n```/
    );

    if (codeBlockMatch?.[1]) {
      return { code: codeBlockMatch[1] };
    }

    // Check for JSON output
    try {
      const parsed = JSON.parse(output);
      if (typeof parsed.code === 'string') {
        return { code: parsed.code };
      }
      if (typeof parsed.errors === 'object') {
        return {
          errors: Array.isArray(parsed.errors)
            ? parsed.errors
            : [String(parsed.errors)],
        };
      }
    } catch {
      // Not JSON, return as-is
    }

    return { code: output };
  }
}

/** Singleton instance */
export const genericMCPAdapter = new GenericMCPAdapter();
