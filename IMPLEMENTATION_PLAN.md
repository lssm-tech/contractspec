# ContractSpec Quick Fix Feature - Implementation Plan

## Overview

Implement a "quick fix" feature that allows users to rapidly resolve CI integrity issues (missing operations, events, presentations) through CLI, VSCode extension, and GitHub Action.

## User Requirements Summary

- **CLI**: New `contractspec fix` command
- **Fix strategies**: Remove reference, implement skeleton (`in_creation`), implement with AI (`experimental`)
- **Skeleton depth**: User chooses minimal or AI-assisted at fix time
- **VSCode**: Code actions (lightbulb) + command palette
- **GitHub Action**: All link types (CLI commands, VSCode deep links, GitHub issue links)

---

## Implementation Phases

### Phase 1: Core Fix Service (Bundle Layer)

**Files to create in `packages/bundles/workspace/src/services/fix/`:**

| File | Purpose |
|------|---------|
| `types.ts` | `FixableIssue`, `FixStrategy`, `FixResult`, `FixOptions`, `FixLink` types |
| `fix-service.ts` | Core orchestration: `fixIssue()`, `batchFix()`, `parseIssuesFromCIResult()` |
| `strategies/remove-reference.ts` | Remove broken ref from feature file |
| `strategies/implement-skeleton.ts` | Create minimal stub with `in_creation` stability |
| `strategies/implement-ai.ts` | AI-assisted implementation with `experimental` stability |
| `fix-applicator.ts` | Apply file changes, handle dry-run |
| `fix-link-formatter.ts` | Generate CLI/VSCode/GitHub issue links |
| `index.ts` | Service exports |

**Files to create in `packages/bundles/workspace/src/templates/fix/`:**

| File | Purpose |
|------|---------|
| `skeleton-operation.ts` | Minimal operation spec template |
| `skeleton-event.ts` | Minimal event spec template |
| `skeleton-presentation.ts` | Minimal presentation spec template |
| `index.ts` | Template exports |

**Key types:**

```typescript
export type FixStrategyType = 'remove-reference' | 'implement-skeleton' | 'implement-ai';

export interface FixableIssue {
  issue: IntegrityIssue;
  ref: RefInfo;
  specType: AnalyzedSpecType;
  featureFile: string;
  featureKey: string;
}

export interface FixResult {
  success: boolean;
  strategy: FixStrategyType;
  issue: FixableIssue;
  filesChanged: Array<{ path: string; action: 'created' | 'modified' | 'deleted' }>;
  error?: string;
}
```

### Phase 2: CLI Command

**Files to create in `packages/apps/cli-contractspec/src/commands/fix/`:**

| File | Purpose |
|------|---------|
| `index.ts` | Commander command definition |
| `types.ts` | CLI-specific types |
| `fix-command.ts` | Main command handler |
| `interactive.ts` | Interactive prompts for fix selection |
| `batch-fix.ts` | Batch fix from CI output |

**CLI Usage:**

```bash
# Interactive mode - analyze and prompt
contractspec fix

# Fix specific target
contractspec fix --target src/features/docs.feature.ts

# From CI results
contractspec fix --from-ci .contractspec-ci/results.json

# Specific strategy
contractspec fix --strategy implement-skeleton
contractspec fix --ai  # shortcut for --strategy implement-ai

# Dry run
contractspec fix --dry-run

# Non-interactive
contractspec fix -y --strategy remove-reference
```

**Register in `src/index.ts`:**

```typescript
import { fixCmd } from './commands/fix';
program.addCommand(fixCmd);
```

### Phase 3: VSCode Extension

**Files to create in `packages/apps/vscode-contractspec/src/code-actions/`:**

| File | Purpose |
|------|---------|
| `index.ts` | Registration function |
| `fix-provider.ts` | `CodeActionProvider` implementation |
| `fix-commands.ts` | Command handlers for each fix type |

**Code action provider pattern:**

```typescript
class FixCodeActionProvider implements vscode.CodeActionProvider {
  provideCodeActions(document, range, context): vscode.CodeAction[] {
    const actions: vscode.CodeAction[] = [];

    for (const diagnostic of context.diagnostics) {
      if (diagnostic.source !== 'ContractSpec Integrity') continue;

      if (diagnostic.code === 'unresolved-ref') {
        actions.push(
          this.createAction('Remove broken reference', 'contractspec.fix.removeReference', diagnostic),
          this.createAction('Create skeleton spec (in_creation)', 'contractspec.fix.implementSkeleton', diagnostic),
          this.createAction('Create with AI (experimental)', 'contractspec.fix.implementAi', diagnostic)
        );
      }
    }
    return actions;
  }
}
```

**Update `extension.ts`:**

```typescript
import { registerCodeActions } from './code-actions';
// In activate():
registerCodeActions(context);
```

**Update `package.json` contributes:**

```json
{
  "commands": [
    { "command": "contractspec.fix.removeReference", "title": "Remove Broken Reference", "category": "ContractSpec Fix" },
    { "command": "contractspec.fix.implementSkeleton", "title": "Create Skeleton Spec", "category": "ContractSpec Fix" },
    { "command": "contractspec.fix.implementAi", "title": "Create Spec with AI", "category": "ContractSpec Fix" },
    { "command": "contractspec.fix.batch", "title": "Fix All Integrity Issues", "category": "ContractSpec Fix" }
  ]
}
```

### Phase 4: GitHub Action Enhancement

**Files to modify:**

| File | Change |
|------|--------|
| `packages/bundles/workspace/src/services/ci-check/types.ts` | Add `fixLinks?: FixLink[]` to `CIIssue` |
| `packages/bundles/workspace/src/formatters/sarif.ts` | Add `helpUri` to rules |
| `packages/apps/action-validation/action.yml` | Add fix links section in PR comment |

**PR Comment format enhancement (action.yml lines ~340):**

```javascript
// For each issue with fix links:
if (issue.fixLinks?.length) {
  body += `\n  **Quick fixes:**\n`;
  for (const link of issue.fixLinks) {
    if (link.type === 'cli') {
      body += `  - \`${link.value}\`\n`;
    } else if (link.type === 'vscode') {
      body += `  - [Open in VS Code](${link.value})\n`;
    } else if (link.type === 'github-issue') {
      body += `  - [Create Issue](${link.value})\n`;
    }
  }
}
```

---

## Critical Files Reference

### Files to Read/Understand

| File | Purpose |
|------|---------|
| `packages/bundles/workspace/src/services/integrity.ts` | `IntegrityIssue` type, `analyzeIntegrity()` |
| `packages/apps/cli-contractspec/src/commands/create/create-command.ts` | Command pattern to follow |
| `packages/apps/cli-contractspec/src/commands/create/wizards/` | Wizard patterns |
| `packages/bundles/workspace/src/templates/operation.template.ts` | Template pattern |
| `packages/apps/vscode-contractspec/src/diagnostics/index.ts` | Diagnostic codes to hook |
| `packages/apps/action-validation/action.yml` | PR comment generation |
| `packages/libs/contracts/src/ownership.ts` | `StabilityEnum` values |

### Files to Create (Summary)

```
packages/bundles/workspace/src/
  services/fix/
    index.ts
    types.ts
    fix-service.ts
    fix-applicator.ts
    fix-link-formatter.ts
    strategies/
      index.ts
      remove-reference.ts
      implement-skeleton.ts
      implement-ai.ts
  templates/fix/
    index.ts
    skeleton-operation.ts
    skeleton-event.ts
    skeleton-presentation.ts

packages/apps/cli-contractspec/src/
  commands/fix/
    index.ts
    types.ts
    fix-command.ts
    interactive.ts
    batch-fix.ts

packages/apps/vscode-contractspec/src/
  code-actions/
    index.ts
    fix-provider.ts
    fix-commands.ts
```

### Files to Modify

```
packages/apps/cli-contractspec/src/index.ts              # Register fix command
packages/apps/vscode-contractspec/src/extension.ts       # Register code actions
packages/apps/vscode-contractspec/package.json           # Add commands
packages/bundles/workspace/src/services/ci-check/types.ts # Add fixLinks
packages/bundles/workspace/src/formatters/sarif.ts       # Add helpUri
packages/apps/action-validation/action.yml               # Add fix links to PR comment
packages/bundles/workspace/src/index.ts                  # Export fix service
```

---

## Implementation Order

1. **Phase 1.1**: Create `types.ts` with all fix-related types
2. **Phase 1.2**: Create skeleton templates (operation, event, presentation)
3. **Phase 1.3**: Implement `remove-reference` strategy
4. **Phase 1.4**: Implement `implement-skeleton` strategy
5. **Phase 1.5**: Implement `implement-ai` strategy (reuse existing AIGenerator)
6. **Phase 1.6**: Create `fix-service.ts` orchestration
7. **Phase 1.7**: Create `fix-link-formatter.ts`
8. **Phase 2.1**: Create CLI `fix` command structure
9. **Phase 2.2**: Implement interactive mode
10. **Phase 2.3**: Implement batch mode
11. **Phase 2.4**: Register command in main index
12. **Phase 3.1**: Create VSCode code action provider
13. **Phase 3.2**: Register commands in extension
14. **Phase 3.3**: Update package.json
15. **Phase 4.1**: Add fixLinks to CI issue types
16. **Phase 4.2**: Update action.yml PR comment

---

## Skeleton Template Example

```typescript
// templates/fix/skeleton-operation.ts
export function generateSkeletonOperation(ctx: SpecGenerationContext): string {
  return `import { defineCommand } from '@contractspec/lib.contracts';
import { z } from 'zod';

// TODO: Define input schema
const Input = z.object({});

// TODO: Define output schema
const Output = z.object({});

export const ${toPascalCase(ctx.key)}Spec = defineCommand({
  meta: {
    key: '${ctx.key}',
    version: '${ctx.version}',
    stability: 'in_creation',
    owners: ${JSON.stringify(ctx.enrichment?.owners || ['@team'])},
    tags: ${JSON.stringify(ctx.enrichment?.tags || [])},
    description: '${ctx.description || 'TODO: Add description'}',
    goal: '${ctx.enrichment?.goal || 'TODO: Add goal'}',
  },
  io: {
    input: Input,
    output: Output,
  },
});
`;
}
```

---

## Testing Strategy

- **Unit tests**: Strategy implementations with mocked file system
- **Integration tests**: Full fix flow with real files
- **VSCode tests**: Command execution via test harness

---

## Notes

- Reuse existing `AIGenerator` from `services/create/ai-generator.ts`
- Follow hexagonal architecture: domain logic in bundle, adapters in apps
- Keep files under 200 lines (split strategies into separate files)
- Use explicit TypeScript types throughout (no `any`)