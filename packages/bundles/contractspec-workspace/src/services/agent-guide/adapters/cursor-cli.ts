/**
 * Cursor CLI Agent Adapter
 * 
 * Formats implementation plans and prompts for Cursor's CLI/background mode.
 * Can also generate .mdc cursor rules files.
 */

import type { AnyContractSpec } from '@lssm/lib.contracts';
import type {
  ImplementationPlan,
  AgentPrompt,
} from '@lssm/lib.contracts/llm';
import { AGENT_SYSTEM_PROMPTS, specToFullMarkdown } from '@lssm/lib.contracts/llm';
import type { AgentAdapter } from '../types';

/**
 * Cursor CLI adapter implementation.
 * Optimized for Cursor's background/composer mode.
 */
export class CursorCLIAdapter implements AgentAdapter {
  agentType = 'cursor-cli' as const;

  /**
   * Format an implementation plan for Cursor CLI.
   * Uses concise format optimized for Cursor's context window.
   */
  formatPlan(plan: ImplementationPlan): AgentPrompt {
    const lines: string[] = [];

    // Compact header
    lines.push(`# ${plan.target.name}.v${plan.target.version}`);
    lines.push('');
    lines.push(`> ${plan.context.goal}`);
    lines.push('');

    // Files to work on
    if (plan.fileStructure.length > 0) {
      lines.push('## Files');
      lines.push('');
      for (const file of plan.fileStructure) {
        lines.push(`- ${file.type}: \`${file.path}\` - ${file.purpose}`);
      }
      lines.push('');
    }

    // Compact spec (key sections only)
    lines.push('## Spec');
    lines.push('');
    lines.push(plan.specMarkdown);
    lines.push('');

    // Steps as simple list
    lines.push('## Steps');
    lines.push('');
    for (const step of plan.steps) {
      lines.push(`${step.order}. **${step.title}**: ${step.description}`);
    }
    lines.push('');

    // Key constraints (compact)
    const constraints = [
      ...plan.constraints.policy,
      ...plan.constraints.security.map(s => `⚠️ ${s}`),
    ];
    if (constraints.length > 0) {
      lines.push('## Constraints');
      lines.push('');
      for (const c of constraints) {
        lines.push(`- ${c}`);
      }
      lines.push('');
    }

    // PII warning
    if (plan.constraints.pii.length > 0) {
      lines.push('## PII Fields');
      lines.push('');
      lines.push(`Handle carefully: ${plan.constraints.pii.map(p => `\`${p}\``).join(', ')}`);
      lines.push('');
    }

    return {
      agent: 'cursor-cli',
      systemPrompt: AGENT_SYSTEM_PROMPTS['cursor-cli'],
      taskPrompt: lines.join('\n'),
    };
  }

  /**
   * Generate Cursor rules (.mdc format) for a spec.
   * Can be saved to .cursor/rules/ to provide persistent context.
   */
  generateConfig(spec: AnyContractSpec): string {
    const m = spec.meta;
    const lines: string[] = [];

    // MDC frontmatter
    lines.push('---');
    lines.push(`description: Implementation rules for ${m.name}.v${m.version}`);
    lines.push(`globs: ["**/${m.name.replace(/\./g, '/')}/**"]`);
    lines.push('alwaysApply: false');
    lines.push('---');
    lines.push('');

    // Rule content
    lines.push(`# ${m.name} Implementation Rules`);
    lines.push('');
    lines.push(`This ${m.kind} operation must follow the ContractSpec specification.`);
    lines.push('');

    lines.push('## Goal');
    lines.push('');
    lines.push(m.goal);
    lines.push('');

    lines.push('## Requirements');
    lines.push('');
    lines.push('1. Input/output types MUST match the spec schema exactly');
    lines.push('2. All error cases MUST be handled');
    
    if (spec.sideEffects?.emits?.length) {
      lines.push('3. Events MUST be emitted as specified');
    }
    
    lines.push(`4. Auth level: ${spec.policy.auth}`);
    
    if (spec.policy.idempotent !== undefined) {
      lines.push(`5. Idempotency: ${spec.policy.idempotent}`);
    }
    lines.push('');

    // Error handling
    if (spec.io.errors && Object.keys(spec.io.errors).length > 0) {
      lines.push('## Error Cases');
      lines.push('');
      for (const [code, err] of Object.entries(spec.io.errors)) {
        lines.push(`- \`${code}\` (HTTP ${err.http ?? 400}): ${err.when}`);
      }
      lines.push('');
    }

    // Events
    if (spec.sideEffects?.emits?.length) {
      lines.push('## Events to Emit');
      lines.push('');
      for (const e of spec.sideEffects.emits) {
        if ('ref' in e) {
          lines.push(`- \`${e.ref.name}.v${e.ref.version}\`: ${e.when}`);
        } else {
          lines.push(`- \`${e.name}.v${e.version}\`: ${e.when}`);
        }
      }
      lines.push('');
    }

    // PII
    if (spec.policy.pii?.length) {
      lines.push('## PII Handling');
      lines.push('');
      lines.push('These fields contain PII and must be handled with care:');
      for (const field of spec.policy.pii) {
        lines.push(`- \`${field}\``);
      }
      lines.push('');
    }

    // Acceptance scenarios
    if (spec.acceptance?.scenarios?.length) {
      lines.push('## Acceptance Scenarios');
      lines.push('');
      for (const s of spec.acceptance.scenarios) {
        lines.push(`### ${s.name}`);
        lines.push(`- Given: ${s.given.join('; ')}`);
        lines.push(`- When: ${s.when.join('; ')}`);
        lines.push(`- Then: ${s.then.join('; ')}`);
        lines.push('');
      }
    }

    return lines.join('\n');
  }

  /**
   * Generate a cursor rules file path for a spec.
   */
  getCursorRulesPath(spec: AnyContractSpec): string {
    const safeName = spec.meta.name.replace(/\./g, '-');
    return `.cursor/rules/${safeName}.mdc`;
  }

  /**
   * Parse Cursor output to extract generated code.
   */
  parseOutput(output: string): { code?: string; errors?: string[] } {
    // Cursor typically returns code in markdown blocks
    const codeBlockMatch = output.match(
      /```(?:typescript|ts|tsx|javascript|js)?\n([\s\S]*?)\n```/
    );
    
    if (codeBlockMatch?.[1]) {
      return { code: codeBlockMatch[1] };
    }

    // Return raw output if no code block
    return { code: output };
  }
}

/** Singleton instance */
export const cursorCLIAdapter = new CursorCLIAdapter();

