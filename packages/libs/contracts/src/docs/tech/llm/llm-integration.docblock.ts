/**
 * DocBlock: LLM Integration
 *
 * Documentation for ContractSpec's LLM integration features.
 */

import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '../../registry';

export const tech_llm_integration_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.llm.overview',
    title: 'LLM Integration Overview',
    summary:
      'Export specs to LLM-friendly formats, generate implementation guides, and verify implementations.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/llm/overview',
    tags: ['llm', 'ai', 'export', 'guide', 'verify'],
    body: `# LLM Integration

ContractSpec provides first-class LLM integration to bridge specifications and AI coding agents.

## Core Features

### 1. Multi-Format Export

Export specs to markdown in formats optimized for LLM consumption:

- **Context format**: Summary for understanding (goal, context, acceptance criteria)
- **Full format**: Complete spec with all details (I/O schemas, policy, events)
- **Prompt format**: Actionable prompt with implementation instructions

### 2. Implementation Guidance

Generate agent-specific implementation plans:

- **Claude Code**: Extended thinking mode with structured prompts
- **Cursor CLI**: Background/composer mode with .mdc rules generation
- **Generic MCP**: Standard format for any MCP-compatible agent

### 3. Tiered Verification

Verify implementations against specs:

- **Tier 1 (Structure)**: Types, exports, imports validation
- **Tier 2 (Behavior)**: Scenario coverage, error handling, events
- **Tier 3 (AI Review)**: Semantic compliance analysis via LLM

## Access Points

| Surface | Commands/Tools |
|---------|---------------|
| CLI | \`contractspec llm export\`, \`guide\`, \`verify\`, \`copy\` |
| MCP | \`llm.export\`, \`llm.guide\`, \`llm.verify\` tools |
| VSCode | Export to LLM, Generate Guide, Verify, Copy commands |

## Quick Start

### CLI Usage

\`\`\`bash
# Export spec as markdown
contractspec llm export path/to/my.spec.ts --format full

# Generate implementation guide
contractspec llm guide path/to/my.spec.ts --agent claude-code

# Verify implementation
contractspec llm verify path/to/my.spec.ts path/to/impl.ts --tier 2

# Copy spec to clipboard
contractspec llm copy path/to/my.spec.ts --format context
\`\`\`

### MCP Usage

\`\`\`
# Export spec
llm.export { specPath: "path/to/my.spec.ts", format: "full" }

# Generate guide
llm.guide { specPath: "path/to/my.spec.ts", agent: "cursor-cli" }

# Verify implementation
llm.verify { specPath: "path/to/my.spec.ts", implementationPath: "path/to/impl.ts", tier: "2" }
\`\`\`

### Programmatic Usage

\`\`\`typescript
import { operationSpecToFullMarkdown, operationSpecToAgentPrompt } from '@lssm/lib.contracts/llm';
import { createAgentGuideService, createVerifyService } from '@lssm/bundle.contractspec-workspace';

// Export
const markdown = operationSpecToFullMarkdown(mySpec);

// Generate guide
const guideService = createAgentGuideService({ defaultAgent: 'claude-code' });
const guide = guideService.generateGuide(mySpec);

// Verify
const verifyService = createVerifyService();
const result = await verifyService.verify(mySpec, implementationCode, {
  tiers: ['structure', 'behavior']
});
\`\`\`
`,
  },
  {
    id: 'docs.tech.llm.export-formats',
    title: 'LLM Export Formats',
    summary:
      'Detailed explanation of the three export formats for LLM consumption.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/llm/export-formats',
    tags: ['llm', 'export', 'markdown'],
    body: `# LLM Export Formats

ContractSpec provides three export formats optimized for different LLM use cases.

## Context Format

Best for: Understanding what a spec does, providing background to LLMs.

Includes:
- Spec name, version, type
- Goal and context
- Description
- Acceptance scenarios

Example:

\`\`\`markdown
# users.createUser (v1)

> Create a new user account with email verification.

**Type:** command | **Stability:** stable

## Goal
Create a new user in the system and trigger email verification.

## Context
Part of the user onboarding flow. Called after signup form submission.

## Acceptance Criteria
### Happy path
**Given:** Valid email and password
**When:** User submits registration
**Then:** Account is created, verification email is sent
\`\`\`

## Full Format

Best for: Complete documentation, implementation reference.

Includes everything:
- All metadata
- JSON schemas for I/O
- Error definitions
- Policy (auth, rate limits, PII)
- Events emitted
- Examples
- Transport configuration

## Prompt Format

Best for: Feeding directly to coding agents.

Includes:
- Task header with clear instructions
- Full spec context
- Implementation requirements
- Task-specific guidance (implement/test/refactor/review)
- Expected output format

The prompt format adapts based on task type:
- **implement**: Full implementation with tests
- **test**: Test generation for existing code
- **refactor**: Refactoring while maintaining behavior
- **review**: Code review against spec
`,
  },
  {
    id: 'docs.tech.llm.agent-adapters',
    title: 'Agent Adapters',
    summary: 'Adapters for different AI coding agents (Claude, Cursor, MCP).',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/llm/agent-adapters',
    tags: ['llm', 'agents', 'claude', 'cursor', 'mcp'],
    body: `# Agent Adapters

ContractSpec provides specialized adapters for different AI coding agents.

## Claude Code Adapter

Optimized for Anthropic Claude's extended thinking and code generation.

Features:
- Structured markdown with clear sections
- Checklists for steps and verification
- Icons for file operations (📝 create, ✏️ modify)
- System prompt for ContractSpec context

Usage:
\`\`\`typescript
const guideService = createAgentGuideService({ defaultAgent: 'claude-code' });
const result = guideService.generateGuide(spec, { agent: 'claude-code' });
// result.prompt.systemPrompt - Claude system context
// result.prompt.taskPrompt - Task-specific instructions
\`\`\`

## Cursor CLI Adapter

Optimized for Cursor's background/composer mode.

Features:
- Compact format for context efficiency
- .mdc cursor rules generation
- Integration with Cursor's file system
- Concise step lists

Generate Cursor Rules:
\`\`\`typescript
const cursorRules = guideService.generateAgentConfig(spec, 'cursor-cli');
// Save to .cursor/rules/my-spec.mdc
\`\`\`

## Generic MCP Adapter

Works with any MCP-compatible agent (Cline, Aider, etc.).

Features:
- Standard markdown format
- Table-based metadata
- JSON resource format support
- Prompt message format

The generic adapter is the default and works across all agents.

## Choosing an Adapter

| Agent | Best For | Key Features |
|-------|----------|--------------|
| Claude Code | Complex implementations | Extended thinking, detailed steps |
| Cursor CLI | IDE-integrated work | Cursor rules, compact format |
| Generic MCP | Any MCP agent | Universal compatibility |
`,
  },
  {
    id: 'docs.tech.llm.verification',
    title: 'Implementation Verification',
    summary: 'Tiered verification of implementations against specifications.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/llm/verification',
    tags: ['llm', 'verify', 'validation', 'testing'],
    body: `# Implementation Verification

ContractSpec provides tiered verification to check if implementations comply with specs.

## Verification Tiers

### Tier 1: Structure (Fast)

Checks TypeScript structure against spec requirements:

| Check | What it validates |
|-------|------------------|
| Handler export | Function is properly exported |
| Contracts import | Imports from @lssm/lib.contracts |
| Schema import | Imports from @lssm/lib.schema |
| No \`any\` type | TypeScript strict compliance |
| Error handling | Error codes are referenced |
| Event emission | Event patterns exist |
| Input validation | Validation patterns used |
| Async patterns | Async/await for commands |

### Tier 2: Behavior (Comprehensive)

Checks implementation coverage of spec behaviors:

| Check | What it validates |
|-------|------------------|
| Scenario coverage | Acceptance scenarios implemented |
| Example coverage | Example I/O values referenced |
| Error cases | All error conditions handled |
| Event conditions | Events emitted correctly |
| Idempotency | Idempotent patterns (if required) |

### Tier 3: AI Review (Deep)

Uses LLM for semantic analysis:

- Does the implementation fulfill the spec's intent?
- Are edge cases properly handled?
- Is the code quality acceptable?
- Are there any subtle violations?

Requires AI API key configuration.

## Running Verification

\`\`\`typescript
const verifyService = createVerifyService({
  aiApiKey: process.env.ANTHROPIC_API_KEY, // Optional, for Tier 3
  aiProvider: 'anthropic',
});

const result = await verifyService.verify(spec, implementationCode, {
  tiers: ['structure', 'behavior'],
  failFast: false,
  includeSuggestions: true,
});

console.log(result.passed);  // true/false
console.log(result.score);   // 0-100
console.log(result.summary); // Human-readable summary
\`\`\`

## Verification Report

The report includes:

- **passed**: Overall compliance
- **score**: 0-100 score
- **issues**: Array of problems found
- **suggestions**: Recommended fixes
- **coverage**: Metrics on scenario/error/field coverage

Each issue has:
- **severity**: error, warning, or info
- **category**: type, export, import, scenario, error_handling, semantic
- **message**: Description of the issue
- **suggestion**: How to fix it
`,
  },
];

registerDocBlocks(tech_llm_integration_DocBlocks);
