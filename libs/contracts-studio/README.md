# @contractspec/lib.contracts-studio

Contract definitions for ContractSpec Studio operations including integrations, lifecycle, and presentation.

## Overview

This library provides contract specs for Studio functionality:
- Integration management
- User interactions (commands, queries)
- Lifecycle stage management
- Presentation layer contracts
- Template definitions

## Installation

```bash
bun add @contractspec/lib.contracts-studio
```

## Exports

- `./integrations` — Integration binding contracts
- `./interactions` — User interaction specs
- `./interactions/commands` — Command definitions
- `./interactions/queries` — Query definitions
- `./lifecycle` — Lifecycle stage contracts
- `./presentation` — Presentation layer contracts
- `./studio` — Core studio contracts
- `./templates/*` — Template contracts (messaging, recipes, todos)

## Usage

```typescript
import { CreateProjectCommand } from '@contractspec/lib.contracts-studio/interactions/commands';
import { GetProjectQuery } from '@contractspec/lib.contracts-studio/interactions/queries';
import { LifecycleStage } from '@contractspec/lib.contracts-studio/lifecycle';
```

## Dependencies

- `@contractspec/lib.contracts` — Core contract primitives
- `@contractspec/lib.schema` — Schema utilities

## Related Packages

- [`@contractspec/bundle.studio`](../../bundles/studio/README.md) — Implementation
- [`@contractspec/lib.contracts-library`](../contracts-library/README.md) — Library contracts
- [`@contractspec/lib.database-studio`](../database-studio/README.md) — Database layer
