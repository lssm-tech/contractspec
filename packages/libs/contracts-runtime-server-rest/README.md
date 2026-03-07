# @contractspec/lib.contracts-runtime-server-rest

REST runtime adapters for exposing ContractSpec operations over HTTP.

Website: https://contractspec.io/

## Why this package exists

This package is the REST adapter layer extracted from `@contractspec/lib.contracts`.

It lets you take an `OperationSpecRegistry` and expose it in multiple server environments with consistent behavior:

- framework-agnostic fetch handler
- Express adapter
- Elysia adapter
- Next.js App Router adapter
- Next.js Pages Router adapter

## Package boundary (important)

Use this package for:

- HTTP transport projection of operation specs.
- Shared REST concerns (route derivation, input parsing, CORS, error mapping).
- Helper utilities reused by GraphQL runtime (`contracts-adapter-input`, `contracts-adapter-hydration`).

Do not use this package for:

- Defining operation contracts (use `@contractspec/lib.contracts-spec`).
- Building GraphQL schema (use `@contractspec/lib.contracts-runtime-server-graphql`).

## Installation

```bash
npm install @contractspec/lib.contracts-runtime-server-rest @contractspec/lib.contracts-spec
# or
bun add @contractspec/lib.contracts-runtime-server-rest @contractspec/lib.contracts-spec
```

Install whichever peer framework you use (`express`, `elysia`, `next`).

## Export map

- Generic handler:
  - `createFetchHandler`
  - `RestOptions`
- Framework adapters:
  - `expressRouter`
  - `elysiaPlugin`
  - `makeNextAppHandler`
  - `makeNextPagesHandler`
- Shared adapter internals:
  - `createInputTypeBuilder`
  - `hydrateResourceIfNeeded`
  - `parseReturns`

## Quick start (framework-agnostic)

```ts
import { createFetchHandler } from "@contractspec/lib.contracts-runtime-server-rest";
import type { HandlerCtx } from "@contractspec/lib.contracts-spec";
import type { OperationSpecRegistry } from "@contractspec/lib.contracts-spec/operations/registry";

declare const operations: OperationSpecRegistry;

const handler = createFetchHandler(
  operations,
  (request): HandlerCtx => ({
    actor: "user",
    channel: "web",
    traceId: request.headers.get("x-trace-id") ?? undefined,
  }),
  {
    basePath: "/api/contracts",
    cors: true,
    prettyJson: 2,
  }
);

const response = await handler(
  new Request("https://example.com/api/contracts/workspace/get/v1.0.0")
);
console.log(response.status);
```

## Framework examples

### Express

```ts
import express from "express";
import { expressRouter } from "@contractspec/lib.contracts-runtime-server-rest/rest-express";

declare const operations: import("@contractspec/lib.contracts-spec/operations/registry").OperationSpecRegistry;

const app = express();
app.use(express.json());

app.use(
  expressRouter(
    express,
    operations,
    () => ({ actor: "user", channel: "web" }),
    { basePath: "/api/contracts", cors: true }
  )
);
```

### Next.js App Router

```ts
import { makeNextAppHandler } from "@contractspec/lib.contracts-runtime-server-rest/rest-next-app";

declare const operations: import("@contractspec/lib.contracts-spec/operations/registry").OperationSpecRegistry;

const handler = makeNextAppHandler(
  operations,
  () => ({ actor: "user", channel: "web" }),
  { basePath: "/api/contracts" }
);

export const GET = handler;
export const POST = handler;
export const OPTIONS = handler;
```

## Runtime behavior details

- Default method mapping:
  - query -> `GET`
  - command -> `POST`
- Default path mapping:
  - `/<operation.key with dots replaced by slashes>/v<version>`
- GET input parsing:
  - if `input` query param exists, parse it as JSON
  - otherwise use query params as flat object
- POST input parsing:
  - supports `application/json` and `application/x-www-form-urlencoded`
- Error mapping defaults:
  - validation errors -> `400`
  - `PolicyDenied*` errors -> `403`
  - unknown errors -> `500`
  - unsupported content type -> `415`

You can override error serialization using `RestOptions.onError`.

## AI assistant guidance

When generating code:

- Define operation specs first in `@contractspec/lib.contracts-spec`.
- Start with `createFetchHandler` for deterministic behavior, then choose framework wrappers.
- Keep `basePath` explicit to avoid route ambiguity in generated handlers.

When debugging:

- If a route is 404, verify operation key/version and derived path.
- If input parsing fails on GET, check whether caller sends `input=` JSON vs plain query params.

## Split migration from deprecated monolith

- `@contractspec/lib.contracts/server/rest-generic` -> `@contractspec/lib.contracts-runtime-server-rest/rest-generic`
- `@contractspec/lib.contracts/server/rest-express` -> `@contractspec/lib.contracts-runtime-server-rest/rest-express`
- `@contractspec/lib.contracts/server/rest-elysia` -> `@contractspec/lib.contracts-runtime-server-rest/rest-elysia`
- `@contractspec/lib.contracts/server/rest-next-app` -> `@contractspec/lib.contracts-runtime-server-rest/rest-next-app`
- `@contractspec/lib.contracts/server/rest-next-pages` -> `@contractspec/lib.contracts-runtime-server-rest/rest-next-pages`
