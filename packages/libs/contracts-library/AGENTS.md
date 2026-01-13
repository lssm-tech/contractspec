# lib.contracts-library

Contract definitions for library templates and local runtime.

## Quick Context

- **Type**: Library (contracts)
- **Consumers**: `bundle.library`

## Exports

- `./templates` — Template contracts
- `./templates/recipes` — Recipe specs
- `./templates/todos` — Todo specs

## Usage

```typescript
import { RecipeSpec } from '@contractspec/lib.contracts-library/templates/recipes';
```

## Commands

```bash
bun build       # Build library
bun build:types # Type check
bun lint        # Lint code
```
