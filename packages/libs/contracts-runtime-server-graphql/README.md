# @contractspec/lib.contracts-runtime-server-graphql

GraphQL runtime adapter for projecting ContractSpec operations onto a Pothos schema builder.

Website: https://contractspec.io/

## Why this package exists

This package is the GraphQL adapter layer split from `@contractspec/lib.contracts`.

It converts operation contracts into GraphQL fields while preserving contract semantics:

- query specs -> GraphQL queries
- command specs -> GraphQL mutations
- schema-model input/output mapping
- optional resource hydration when outputs represent resource refs

## Package boundary (important)

Use this package for:

- Registering operation contracts on a Pothos builder (`registerContractsOnBuilder`).
- Bridging ContractSpec I/O schemas into GraphQL input/output fields.

Do not use this package for:

- Defining operation contracts (use `@contractspec/lib.contracts-spec`).
- HTTP transport or REST concerns (use REST runtime package).

## Installation

```bash
npm install @contractspec/lib.contracts-runtime-server-graphql @contractspec/lib.contracts-spec @pothos/core @pothos/plugin-relay
# or
bun add @contractspec/lib.contracts-runtime-server-graphql @contractspec/lib.contracts-spec @pothos/core @pothos/plugin-relay
```

## Export map

- Main entrypoint:
  - `registerContractsOnBuilder`
- Subpath compatibility:
  - `graphql-pothos`

## Quick start

```ts
import SchemaBuilder from "@pothos/core";
import { registerContractsOnBuilder } from "@contractspec/lib.contracts-runtime-server-graphql";
import type { EventPublisher } from "@contractspec/lib.contracts-spec";
import type { OperationSpecRegistry } from "@contractspec/lib.contracts-spec/operations/registry";
import type { ResourceRegistry } from "@contractspec/lib.contracts-spec/resources";

declare const operations: OperationSpecRegistry;
declare const resources: ResourceRegistry;

const builder = new SchemaBuilder<{
  Context: {
    user?: { id: string };
    session?: { activeOrganizationId?: string };
    logger?: { getTraceId?: () => string };
    eventPublisher: EventPublisher;
  };
}>({});

registerContractsOnBuilder(builder, operations, resources);

export const schema = builder.toSchema({});
```

## Behavior details

- Field naming defaults to `defaultGqlField(meta.key, meta.version)`.
- You can override GraphQL field names via `transport.gql.field` in operation specs.
- Input args are generated from schema models using a dedicated adapter builder.
- Output typing strategy:
  - schema model outputs map to object types when possible
  - explicit returns hints (`transport.gql.returns`) are respected
  - fallback is JSON-like output
- Authorization context is read from GraphQL context (`ctx.user`, session/org, trace).

If your schema relies on JSON fallback outputs, ensure your Pothos setup includes an appropriate JSON scalar.

## Resource hydration support

When operation outputs are resource references, this adapter can hydrate them through `ResourceRegistry` before returning GraphQL responses.

This is useful when contracts return IDs but GraphQL clients expect expanded object data.

## AI assistant guidance

When generating code:

- Use this package only after operation contracts and handler bindings exist.
- Keep GraphQL field naming explicit in specs when stable API shape is required.
- Pass a fully-typed GraphQL context that includes `eventPublisher`.

When debugging:

- Missing GraphQL field usually means operation not registered in `OperationSpecRegistry`.
- Wrong query vs mutation placement usually means `meta.kind` mismatch in operation spec.

## Split migration from deprecated monolith

- `@contractspec/lib.contracts/server/graphql-pothos` -> `@contractspec/lib.contracts-runtime-server-graphql/graphql-pothos`
