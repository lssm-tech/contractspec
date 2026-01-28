# LLM Integration

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
| CLI | `contractspec llm export`, `guide`, `verify`, `copy` |
| MCP | `llm.export`, `llm.guide`, `llm.verify` tools |
| VSCode | Export to LLM, Generate Guide, Verify, Copy commands |

## Quick Start

### CLI Usage

```bash
# Export spec as markdown
contractspec llm export path/to/my.spec.ts --format full

# Generate implementation guide
contractspec llm guide path/to/my.spec.ts --agent claude-code

# Verify implementation
contractspec llm verify path/to/my.spec.ts path/to/impl.ts --tier 2

# Copy spec to clipboard
contractspec llm copy path/to/my.spec.ts --format context
```

### MCP Usage

```
# Export spec
llm.export { specPath: "path/to/my.spec.ts", format: "full" }

# Generate guide
llm.guide { specPath: "path/to/my.spec.ts", agent: "cursor-cli" }

# Verify implementation
llm.verify { specPath: "path/to/my.spec.ts", implementationPath: "path/to/impl.ts", tier: "2" }
```

### Programmatic Usage

```typescript
import { operationSpecToFullMarkdown, operationSpecToAgentPrompt } from '@contractspec/lib.contracts/llm';
import { createAgentGuideService, createVerifyService } from '@contractspec/bundle.workspace';

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
```
