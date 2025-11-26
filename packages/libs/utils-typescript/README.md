# @lssm/lib.utils-typescript

A collection of essential TypeScript utility types and helper functions.

## Purpose

To provide a shared library of generic TypeScript types (e.g., `DeepPartial`, `Maybe`, `AwaitedResult`) to avoid redeclaring them in every package.

## Installation

```bash
npm install @lssm/lib.utils-typescript
# or
bun add @lssm/lib.utils-typescript
```

## Key Concepts

- **Utility Types**: Enhancements to standard TS library types.
- **Zero Dependencies**: Pure TS/JS helpers.

## Exports

- `DeepPartial`, `DeepRequired`
- `Maybe`, `Nullable`
- `AwaitedResult`
- `Json`, `JsonObject`

## Usage

```ts
import type { DeepPartial } from '@lssm/lib.utils-typescript';

type User = {
  profile: {
    name: string;
  };
};

const update: DeepPartial<User> = {
  profile: { name: 'Alice' }, // Valid
};
```


















