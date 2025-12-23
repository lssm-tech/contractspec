/**
 * LLM Prompt Templates
 *
 * Pre-built prompt templates for different agent types and tasks.
 * These prompts are designed to guide AI coding agents in implementing,
 * testing, and verifying ContractSpec-based code.
 */

import type { AnyOperationSpec } from '../operations';
import type { AgentPrompt, AgentType, ImplementationPlan } from './types';
import {
  operationSpecToAgentPrompt,
  operationSpecToFullMarkdown,
} from './exporters';

/**
 * System prompts for different agent types.
 */
export const AGENT_SYSTEM_PROMPTS: Record<AgentType, string> = {
  'claude-code': `You are an expert TypeScript developer working with ContractSpec, a spec-first development framework.

Your code follows these principles:
- Type-safe with comprehensive TypeScript types (no \`any\`)
- Well-documented with JSDoc comments
- Production-ready with proper error handling
- Following SOLID principles and clean code practices
- Modular and testable

When implementing specs:
1. Validate input against the schema before processing
2. Handle all error cases defined in the spec
3. Emit events as specified in sideEffects
4. Respect policy constraints (auth, rate limits, PII handling)
5. Follow the acceptance scenarios as your implementation guide

Generate clean, idiomatic TypeScript that exactly matches the specification.`,

  'cursor-cli': `You are implementing features for a ContractSpec-driven codebase.

ContractSpec is a spec-first framework where specifications define:
- Operations (commands and queries) with typed I/O
- Events that operations emit
- Presentations for UI components
- Features that group related specs

When working with specs:
- Read the spec carefully before implementing
- Match the input/output types exactly
- Implement all error cases
- Follow the acceptance scenarios
- Respect policy constraints

Use the project's existing patterns and conventions.`,

  'generic-mcp': `You are a code generation assistant working with ContractSpec specifications.

ContractSpec specs define:
- meta: name, version, kind (command/query), description, goal, context
- io: input schema, output schema, error definitions
- policy: auth level, rate limits, feature flags, PII handling
- sideEffects: events to emit, analytics, audit
- acceptance: scenarios and examples

Your task is to generate or modify code that complies with the given specification.
Follow the spec exactly and handle all defined cases.`,
};

/**
 * Generate an implementation prompt for a specific agent type.
 */
export function generateImplementationPrompt(
  spec: AnyOperationSpec,
  agent: AgentType,
  options?: {
    existingCode?: string;
    targetPath?: string;
  }
): AgentPrompt {
  const systemPrompt = AGENT_SYSTEM_PROMPTS[agent];
  const specMarkdown = operationSpecToFullMarkdown(spec);

  let taskPrompt: string;

  if (agent === 'claude-code') {
    taskPrompt = `## Implementation Task

Implement the following ContractSpec operation:

${specMarkdown}

${options?.targetPath ? `**Target file:** \`${options.targetPath}\`\n` : ''}
${options?.existingCode ? `**Existing code to modify:**\n\`\`\`typescript\n${options.existingCode}\n\`\`\`\n` : ''}

Generate a complete, production-ready TypeScript implementation that:
1. Exports a handler function matching the spec signature
2. Validates input using the schema
3. Handles all defined error cases
4. Emits events as specified
5. Includes JSDoc documentation

Provide ONLY the TypeScript code.`;
  } else if (agent === 'cursor-cli') {
    taskPrompt = `Implement this ContractSpec operation.

${specMarkdown}

${options?.targetPath ? `Target: ${options.targetPath}\n` : ''}

Requirements:
- TypeScript with strict types
- Handle all error cases
- Emit specified events
- Follow acceptance scenarios`;
  } else {
    taskPrompt = operationSpecToAgentPrompt(spec, {
      taskType: 'implement',
      existingCode: options?.existingCode,
    });
  }

  return {
    agent,
    systemPrompt,
    taskPrompt,
  };
}

/**
 * Generate a test generation prompt.
 */
export function generateTestPrompt(
  spec: AnyOperationSpec,
  agent: AgentType,
  options?: {
    implementationCode?: string;
    testFramework?: 'vitest' | 'jest' | 'bun';
  }
): AgentPrompt {
  const framework = options?.testFramework ?? 'vitest';
  const specMarkdown = operationSpecToFullMarkdown(spec);

  const taskPrompt = `## Test Generation Task

Generate comprehensive tests for this specification:

${specMarkdown}

${options?.implementationCode ? `**Implementation:**\n\`\`\`typescript\n${options.implementationCode}\n\`\`\`\n` : ''}

**Test Framework:** ${framework}

Generate tests that:
1. Cover all acceptance scenarios from the spec
2. Test all defined error cases
3. Verify input validation
4. Check event emissions
5. Test edge cases

Use descriptive test names: "should [behavior] when [condition]"

Provide a complete test file.`;

  return {
    agent,
    systemPrompt: AGENT_SYSTEM_PROMPTS[agent],
    taskPrompt,
  };
}

/**
 * Generate a code review prompt.
 */
export function generateReviewPrompt(
  spec: AnyOperationSpec,
  agent: AgentType,
  implementationCode: string
): AgentPrompt {
  const specMarkdown = operationSpecToFullMarkdown(spec);

  const taskPrompt = `## Code Review Task

Review this implementation against its specification:

**Specification:**
${specMarkdown}

**Implementation:**
\`\`\`typescript
${implementationCode}
\`\`\`

Provide a structured review:

### Compliance Check
- [ ] Input types match spec
- [ ] Output types match spec
- [ ] All error cases handled
- [ ] Events emitted correctly
- [ ] Policy constraints respected

### Issues Found
List any issues with severity (error/warning/info)

### Suggestions
List improvements and recommendations

Be thorough and precise. Focus on spec compliance first, then code quality.`;

  return {
    agent,
    systemPrompt: AGENT_SYSTEM_PROMPTS[agent],
    taskPrompt,
  };
}

/**
 * Generate a verification prompt for AI-powered semantic review.
 */
export function generateVerificationPrompt(
  spec: AnyOperationSpec,
  implementationCode: string
): AgentPrompt {
  const specMarkdown = operationSpecToFullMarkdown(spec);

  const taskPrompt = `## Semantic Verification Task

Verify that this implementation fulfills the specification's intent.

**Specification:**
${specMarkdown}

**Implementation:**
\`\`\`typescript
${implementationCode}
\`\`\`

Analyze and respond with JSON:

\`\`\`json
{
  "passed": true/false,
  "score": 0-100,
  "compliance": {
    "inputTypes": { "match": true/false, "issues": [] },
    "outputTypes": { "match": true/false, "issues": [] },
    "errorHandling": { "coverage": "full/partial/none", "missing": [] },
    "eventEmission": { "correct": true/false, "issues": [] },
    "policyCompliance": { "auth": true/false, "rateLimit": true/false, "pii": true/false }
  },
  "scenarios": [
    { "name": "scenario name", "covered": true/false, "notes": "" }
  ],
  "issues": [
    { "severity": "error/warning/info", "category": "type/export/import/scenario/error_handling/semantic", "message": "", "suggestion": "" }
  ],
  "summary": "Brief summary of verification results"
}
\`\`\``;

  return {
    agent: 'generic-mcp',
    taskPrompt,
  };
}

/**
 * Generate a feature implementation plan.
 */
export function generateImplementationPlan(
  spec: AnyOperationSpec,
  options?: {
    projectRoot?: string;
    existingFiles?: string[];
  }
): ImplementationPlan {
  const m = spec.meta;

  // Suggest file structure based on spec type
  const fileStructure: ImplementationPlan['fileStructure'] = [];
  const basePath = options?.projectRoot ?? 'src';
  const specPath = m.name.replace(/\./g, '/');

  if (m.kind === 'command' || m.kind === 'query') {
    fileStructure.push(
      {
        path: `${basePath}/${specPath}/handler.ts`,
        purpose: 'Main handler implementation',
        type: 'create',
      },
      {
        path: `${basePath}/${specPath}/types.ts`,
        purpose: 'Type definitions',
        type: 'create',
      },
      {
        path: `${basePath}/${specPath}/handler.test.ts`,
        purpose: 'Handler tests',
        type: 'create',
      }
    );
  }

  // Generate implementation steps from acceptance scenarios
  const steps: ImplementationPlan['steps'] = [];
  let order = 1;

  // Step 1: Types
  steps.push({
    order: order++,
    title: 'Define Types',
    description:
      'Create TypeScript types for input, output, and internal data structures',
    acceptanceCriteria: [
      'Input type matches spec schema exactly',
      'Output type matches spec schema exactly',
      'Error types defined for all error cases',
    ],
  });

  // Step 2: Validation
  steps.push({
    order: order++,
    title: 'Implement Input Validation',
    description: 'Add validation logic for the input payload',
    acceptanceCriteria: [
      'All required fields are validated',
      'Type constraints are enforced',
      'Validation errors return appropriate error codes',
    ],
  });

  // Step 3: Core logic
  steps.push({
    order: order++,
    title: 'Implement Core Logic',
    description: 'Implement the main business logic of the operation',
    acceptanceCriteria: spec.acceptance?.scenarios?.map((s) => s.name) ?? [
      'Operation completes successfully for valid input',
    ],
  });

  // Step 4: Error handling
  if (spec.io.errors && Object.keys(spec.io.errors).length > 0) {
    steps.push({
      order: order++,
      title: 'Implement Error Handling',
      description: 'Handle all defined error cases',
      acceptanceCriteria: Object.entries(spec.io.errors).map(
        ([code, err]) => `Handle ${code}: ${err.when}`
      ),
    });
  }

  // Step 5: Events
  if (spec.sideEffects?.emits?.length) {
    steps.push({
      order: order++,
      title: 'Implement Event Emission',
      description: 'Emit events as specified',
      acceptanceCriteria: spec.sideEffects.emits.map((e) => {
        if ('ref' in e) {
          return `Emit ${e.ref.name}.v${e.ref.version} when ${e.when}`;
        }
        return `Emit ${e.name}.v${e.version} when ${e.when}`;
      }),
    });
  }

  // Step 6: Tests
  steps.push({
    order: order++,
    title: 'Write Tests',
    description: 'Create comprehensive test suite',
    acceptanceCriteria: [
      'All acceptance scenarios covered',
      'All error cases tested',
      'Edge cases handled',
      'Events verified',
    ],
  });

  // Extract constraints
  const constraints: ImplementationPlan['constraints'] = {
    policy: [],
    security: [],
    pii: [],
  };

  constraints.policy.push(`Auth level: ${spec.policy.auth}`);
  if (spec.policy.idempotent !== undefined) {
    constraints.policy.push(`Idempotent: ${spec.policy.idempotent}`);
  }
  if (spec.policy.rateLimit) {
    constraints.policy.push(
      `Rate limit: ${spec.policy.rateLimit.rpm} rpm per ${spec.policy.rateLimit.key}`
    );
  }
  if (spec.policy.flags?.length) {
    constraints.policy.push(
      `Feature flags required: ${spec.policy.flags.join(', ')}`
    );
  }
  if (spec.policy.escalate) {
    constraints.security.push(`Escalation required: ${spec.policy.escalate}`);
  }
  if (spec.policy.pii?.length) {
    constraints.pii = spec.policy.pii;
  }

  // Verification checklist
  const verificationChecklist = [
    'Input validation works for all cases',
    'Output matches expected schema',
    'All error cases return correct codes',
    'Events are emitted with correct payloads',
    'Auth requirements are enforced',
    'Rate limiting is applied (if applicable)',
    'PII fields are handled correctly',
    'All acceptance scenarios pass',
    'Tests provide adequate coverage',
  ];

  return {
    target: {
      type: 'spec',
      name: m.name,
      version: m.version,
    },
    context: {
      goal: m.goal,
      description: m.description,
      background: m.context,
    },
    specMarkdown: operationSpecToFullMarkdown(spec),
    fileStructure,
    steps,
    constraints,
    verificationChecklist,
  };
}

/**
 * Format an implementation plan for a specific agent.
 */
export function formatPlanForAgent(
  plan: ImplementationPlan,
  agent: AgentType
): AgentPrompt {
  let taskPrompt: string;

  if (agent === 'claude-code') {
    taskPrompt = `## Implementation Plan: ${plan.target.name}.v${plan.target.version}

### Context
**Goal:** ${plan.context.goal}

**Background:** ${plan.context.background}

### Specification
${plan.specMarkdown}

### File Structure
${plan.fileStructure.map((f) => `- \`${f.path}\` (${f.type}): ${f.purpose}`).join('\n')}

### Implementation Steps
${plan.steps
  .map(
    (s) => `
#### Step ${s.order}: ${s.title}
${s.description}

**Acceptance Criteria:**
${s.acceptanceCriteria.map((c) => `- [ ] ${c}`).join('\n')}
`
  )
  .join('\n')}

### Constraints
${plan.constraints.policy.length ? `**Policy:**\n${plan.constraints.policy.map((p) => `- ${p}`).join('\n')}\n` : ''}
${plan.constraints.security.length ? `**Security:**\n${plan.constraints.security.map((s) => `- ${s}`).join('\n')}\n` : ''}
${plan.constraints.pii.length ? `**PII Handling:**\n${plan.constraints.pii.map((p) => `- ${p}`).join('\n')}\n` : ''}

### Verification Checklist
${plan.verificationChecklist.map((c) => `- [ ] ${c}`).join('\n')}

Implement this plan step by step.`;
  } else if (agent === 'cursor-cli') {
    taskPrompt = `# ${plan.target.name}.v${plan.target.version}

${plan.context.goal}

## Spec
${plan.specMarkdown}

## Files to create
${plan.fileStructure.map((f) => `${f.type}: ${f.path}`).join('\n')}

## Steps
${plan.steps.map((s) => `${s.order}. ${s.title}`).join('\n')}`;
  } else {
    taskPrompt = `Implementation plan for ${plan.target.name}.v${plan.target.version}

${plan.specMarkdown}

Steps:
${plan.steps.map((s) => `${s.order}. ${s.title}: ${s.description}`).join('\n')}`;
  }

  return {
    agent,
    systemPrompt: AGENT_SYSTEM_PROMPTS[agent],
    taskPrompt,
  };
}

/**
 * Generate a fix violations prompt after verification.
 */
export function generateFixViolationsPrompt(
  spec: AnyOperationSpec,
  implementationCode: string,
  violations: { message: string; suggestion?: string }[]
): AgentPrompt {
  const specMarkdown = operationSpecToFullMarkdown(spec);

  const violationsList = violations
    .map(
      (v, i) =>
        `${i + 1}. ${v.message}${v.suggestion ? `\n   Suggestion: ${v.suggestion}` : ''}`
    )
    .join('\n');

  const taskPrompt = `## Fix Specification Violations

The following implementation has violations against its specification:

**Specification:**
${specMarkdown}

**Current Implementation:**
\`\`\`typescript
${implementationCode}
\`\`\`

**Violations Found:**
${violationsList}

Fix ALL violations while maintaining existing functionality.
Provide the corrected implementation.`;

  return {
    agent: 'generic-mcp',
    taskPrompt,
  };
}
