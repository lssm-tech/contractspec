# @contractspec/lib.contracts-library

Contract definitions for the ContractSpec library experience including templates and local runtime.

## Overview

This library provides contract specs for:
- Template definitions (todos, recipes)
- Local runtime operations
- Library-specific queries and commands

## Installation

```bash
bun add @contractspec/lib.contracts-library
```

## Exports

- `./templates` — Template contract definitions
- `./templates/recipes` — Recipe template specs
- `./templates/todos` — Todo template specs

## Usage

```typescript
import { RecipeSpec } from '@contractspec/lib.contracts-library/templates/recipes';
import { TodoSpec } from '@contractspec/lib.contracts-library/templates/todos';
```

## Dependencies

- `@contractspec/lib.contracts-spec` — Core contract primitives
- `@contractspec/lib.schema` — Schema utilities

## Related Packages

- [`@contractspec/bundle.library`](../../bundles/library/README.md) — Implementation
- [`@contractspec/lib.contracts-studio`](../contracts-studio/README.md) — Studio contracts
