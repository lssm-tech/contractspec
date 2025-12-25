# @lssm/lib.logger

Website: https://contractspec.lssm.tech/


High-performance logging library optimized for Bun, with native ElysiaJS integration.

## Purpose

To provide structured, performant logging with support for request tracing, timing, and varied output formats (JSON/Pretty). It includes a plugin for ElysiaJS to automatically log HTTP requests.

## Installation

```bash
npm install @lssm/lib.logger
# or
bun add @lssm/lib.logger
```

## Key Concepts

- **Structured Logging**: Logs are JSON objects by default for easy parsing.
- **Context Awareness**: Supports AsyncLocalStorage for request-scoped context (Trace IDs).
- **Elysia Plugin**: Drop-in middleware for Elysia apps.

## Exports

- `logger`: The main logger instance.
- `elysiaPlugin`: Middleware for Elysia.
- `timer`: Utilities for measuring execution time.
- `tracer`: Request tracing utilities.

## Usage

### Basic Logging

```ts
import { logger } from '@lssm/lib.logger';

logger.info('Server started', { port: 3000 });
logger.error('Database connection failed', { error: err });
```

### With Elysia

```ts
import { Elysia } from 'elysia';
import { elysiaLogger } from '@lssm/lib.logger/elysia-plugin';

new Elysia()
  .use(elysiaLogger())
  .get('/', () => 'Hello World')
  .listen(3000);
```
