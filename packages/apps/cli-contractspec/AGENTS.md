# AI Agent Guide — `@contractspec/app.cli-contractspec`

Scope: `packages/apps/cli-contractspec/*`

This is the ContractSpec CLI (`contractspec`).

## Architecture

The CLI is a **thin wrapper** around business logic in `@contractspec/bundle.workspace`. The separation is:

### CLI Layer (this package)

- **Commands** (`src/commands/`) - Thin wrappers that call bundle services
- **Prompts** (`src/commands/create/wizards/`) - Interactive UI using `@inquirer/prompts`
- **CLI setup** (`src/index.ts`, `src/cli.ts`) - Commander.js configuration
- **Types** (`src/types.ts`) - CLI-specific types

### Business Logic (bundle)

- **Services** (`@contractspec/bundle.workspace/services/`) - Core use-cases
  - `create.ts` - Spec creation logic
  - `build.ts` - Code generation from specs
  - `openapi.ts` - OpenAPI export
  - `registry.ts` - Registry client
  - `examples.ts` - Examples management
  - `validate.ts`, `diff.ts`, `deps.ts`, etc.
- **Templates** (`@contractspec/bundle.workspace/templates/`) - Spec templates
- **AI** (`@contractspec/bundle.workspace/ai/`) - AI agents and prompts
- **Adapters** (`@contractspec/bundle.workspace/adapters/`) - Infrastructure

## Build System

The CLI is bundled with `bun build`:

- Single executable output: `dist/cli.js`
- Target: `bun` runtime
- Minified for production
- Type declarations generated separately with `tsc`

## Test System

Tests use `bun:test` (not vitest):

- Run: `bun test`
- Watch: `bun test --watch`
- All test files import from `bun:test`

## Docs consumed by MCP

The CLI MCP server serves these markdown files by path:

- `packages/apps/cli-contractspec/QUICK_START.md`
- `packages/apps/cli-contractspec/QUICK_REFERENCE.md`
- `packages/apps/cli-contractspec/README.md`

If you rename/move them, update `packages/bundles/contractspec-studio/src/application/mcp/cliMcp.ts` (`CLI_DOC_PATHS`).

## Local commands

- **Dev/watch**: `bun run dev` - Watch mode, rebuilds on changes
- **Build**: `bun run build` - Bundles CLI + generates types
- **Test**: `bun test` - Run all tests
- **Lint**: `bun run lint` - Fix linting issues

## Prompt Library

The CLI uses `@inquirer/prompts` (not legacy `inquirer`):

- `select` - List selection
- `input` - Text input
- `confirm` - Yes/no confirmation
- `number` - Numeric input

## Adding a New Command

1. **Create service in bundle** (`@contractspec/bundle.workspace/services/`)
2. **Create CLI wrapper** (`src/commands/new-command.ts`)
3. **Add to index.ts** (`src/index.ts`)
4. **Add prompts if needed** (`src/commands/new-command/prompts.ts`)
5. **Write tests** (`src/commands/new-command/index.test.ts`)

Example CLI wrapper:

```typescript
import { Command } from 'commander';
import { myService } from '@contractspec/bundle.workspace';
import { createFsAdapter } from '@contractspec/bundle.workspace/adapters';

export const myCommand = new Command('my-command')
  .description('Do something')
  .action(async () => {
    const fs = createFsAdapter();
    const logger = createLoggerAdapter();

    await myService(
      {
        /* options */
      },
      { fs, logger }
    );
  });
```
