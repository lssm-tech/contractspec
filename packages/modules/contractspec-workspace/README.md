# @lssm/module.contractspec-workspace

Website: https://contractspec.lssm.tech/


Pure, deterministic domain logic and static analysis utilities for ContractSpec workspace operations.

## Purpose

This module contains platform-agnostic logic used by ContractSpec tooling:

- **Types**: Shared type definitions for specs, templates, and analysis results
- **Analysis**: Static code analysis (spec scanning, dependency graphs, semantic diff)
- **Templates**: Code generation templates for specs and handlers
- **AI Prompts**: Prompt builders for AI-assisted spec creation and code generation

## Design Principles

- **No side effects**: All functions are pure and deterministic
- **No CLI dependencies**: No `chalk`, `ora`, `commander`, or `inquirer`
- **No filesystem access**: Operations take code/data as input, return results
- **Reusable**: Can be used by CLI, web apps, VS Code extensions, etc.

## Usage

```typescript
import {
  scanSpecSource,
  computeSemanticDiff,
  buildDependencyGraph,
  validateSpecStructure,
  generateOperationSpec,
} from '@lssm/module.contractspec-workspace';
```

## Exports

- `analysis/` - Static analysis utilities
- `templates/` - Code generation templates
- `ai/` - AI prompt builders
- `types/` - Shared type definitions









