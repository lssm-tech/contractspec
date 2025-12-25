# @lssm/bundle.contractspec-workspace

Website: https://contractspec.lssm.tech/


Reusable use-cases and services for ContractSpec workspace operations.

## Purpose

This bundle provides platform-agnostic services that can be used by:

- CLI tools (`@lssm/app.cli-contractspec`)
- Web applications
- VS Code extensions
- API servers

## Architecture

```
bundle.contractspec-workspace
├── services/          # Use-case implementations
│   ├── build.ts       # Build deterministic artifacts from specs (templates-first)
│   ├── validate.ts    # Validate spec structure (and, later, implementation checks)
│   ├── diff.ts        # Compare specs (semantic diff)
│   ├── deps.ts        # Analyze dependencies
│   ├── list.ts        # Discover specs by glob
│   └── config.ts      # Load + merge workspace config (.contractsrc.json)
│   ├── sync.ts        # Sync all specs (validate/build across a workspace)
│   ├── watch.ts       # Watch specs and trigger validate/build
│   ├── clean.ts       # Safe-by-default cleanup of generated artifacts
│   ├── test.ts        # Run TestSpec scenarios (pure runner wrapper)
│   └── regenerator.ts # Regenerator service wrapper (no module loading)
├── adapters/          # Runtime adapters (Node defaults)
│   ├── fs.ts          # Filesystem operations
│   ├── git.ts         # Git operations
│   ├── watcher.ts     # File watching
│   ├── ai.ts          # AI providers
│   └── logger.ts      # Logging/progress
└── ports/             # Adapter interfaces
    └── index.ts       # Port type definitions
```

## Design Principles

- **Adapter pattern**: All I/O goes through explicit ports/adapters
- **Testable**: Services can be tested with mock adapters
- **Reusable**: Same services work across CLI, web, and extensions
- **No CLI dependencies**: No `chalk`, `ora`, `commander`, or `inquirer`

## Usage

```typescript
import {
  createNodeAdapters,
  loadWorkspaceConfig,
  buildSpec,
} from '@lssm/bundle.contractspec-workspace';

// Create adapters for Node.js runtime
const adapters = createNodeAdapters();

// Load workspace config (or use defaults)
const config = await loadWorkspaceConfig(adapters.fs);

// Build deterministic artifacts from a spec (templates-first)
const result = await buildSpec(
  './my-spec.operation.ts',
  { fs: adapters.fs, logger: adapters.logger },
  config
);
```

## Notes

- `sync` / `watch` accept optional overrides so CLI (or an extension) can inject
  richer build/validate behavior while reusing the deterministic orchestration.
- `test` and `regenerator` deliberately avoid TypeScript module loading; callers
  pass already-loaded specs/contexts/rules/sinks.

