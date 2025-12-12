# @lssm/bundle.contractspec-workspace

Reusable use-cases and services for ContractSpec workspace operations.

## Purpose

This bundle provides platform-agnostic services that can be used by:

- CLI tools (`@lssm/app.cli-contracts`)
- Web applications
- VS Code extensions
- API servers

## Architecture

```
bundle.contractspec-workspace
├── services/          # Use-case implementations
│   ├── build.ts       # Build artifacts from specs
│   ├── create.ts      # Create new specs
│   ├── validate.ts    # Validate specs and implementations
│   ├── diff.ts        # Compare specs
│   ├── deps.ts        # Analyze dependencies
│   ├── sync.ts        # Sync all specs
│   ├── watch.ts       # Watch for changes
│   ├── clean.ts       # Clean generated files
│   ├── test.ts        # Run test specs
│   └── regenerator.ts # Regenerator daemon
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
  BuildService,
  ValidateService,
  DepsService,
  createNodeAdapters,
} from '@lssm/bundle.contractspec-workspace';

// Create adapters for Node.js runtime
const adapters = createNodeAdapters();

// Use services
const buildService = new BuildService(adapters);
const result = await buildService.buildSpec('./my-spec.contracts.ts');
```

