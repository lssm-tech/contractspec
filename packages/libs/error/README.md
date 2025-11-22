# @lssm/lib.error

Standardized error handling primitives for LSSM applications.

## Purpose

To provide a consistent error model across the monorepo, enabling predictable error handling, serialization, and mapping to HTTP status codes and GraphQL errors.

## Installation

```bash
npm install @lssm/lib.error
# or
bun add @lssm/lib.error
```

## Key Concepts

- **AppError**: Base class for all application errors, carrying a `code` and optional `meta` data.
- **Error Codes**: Centralized enum/registry of error codes (e.g., `NOT_FOUND`, `UNAUTHORIZED`).
- **HTTP Mapping**: Utilities to map error codes to HTTP status codes (e.g., `NOT_FOUND` -> 404).

## Exports

- `AppError`: The base error class.
- `codes`: Error code definitions.
- `http`: HTTP status code helpers.

## Usage

```ts
import { AppError, ErrorCode } from '@lssm/lib.error';

// Throwing a known error
throw new AppError(ErrorCode.NOT_FOUND, 'User not found', { userId: 123 });

// Catching and handling
try {
  // ...
} catch (err) {
  if (err instanceof AppError) {
    console.log(err.code); // 'NOT_FOUND'
    console.log(err.meta); // { userId: 123 }
  }
}
```







