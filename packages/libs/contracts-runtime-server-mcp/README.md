# @contractspec/lib.contracts-runtime-server-mcp

MCP runtime adapters for projecting ContractSpec registries into an MCP server.

Website: https://contractspec.io/

## Why this package exists

This package is the MCP-specific runtime layer split from `@contractspec/lib.contracts`.

It converts contract registries into MCP capabilities:

- command operations -> MCP tools
- resource templates -> MCP resources
- prompt specs -> MCP prompts
- presentation specs -> MCP resources (optional)

## Package boundary (important)

Use this package for:

- Registering ContractSpec operations/resources/prompts/presentations on an MCP server.
- Reusing standardized MCP naming and registration behavior.

Do not use this package for:

- Defining operation/event specs (use `@contractspec/lib.contracts-spec`).
- Owning server transport lifecycle (stdio/http wiring stays in your app using MCP SDK).

## Installation

```bash
npm install @contractspec/lib.contracts-runtime-server-mcp @contractspec/lib.contracts-spec @modelcontextprotocol/sdk
# or
bun add @contractspec/lib.contracts-runtime-server-mcp @contractspec/lib.contracts-spec @modelcontextprotocol/sdk
```

## Export map

- Main orchestration:
  - `createMcpServer`
- Context typing:
  - `McpCtxFactories`
- Fine-grained registration:
  - `registerMcpTools`
  - `registerMcpResources`
  - `registerMcpPrompts`
  - `registerMcpPresentations`
- Compatibility alias:
  - `provider-mcp` (re-exports `createMcpServer`)

## Quick start

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  OperationSpecRegistry,
  PromptRegistry,
  ResourceRegistry,
} from "@contractspec/lib.contracts-spec";
import { Logger } from "@contractspec/lib.logger";
import {
  createMcpServer,
  type McpCtxFactories,
} from "@contractspec/lib.contracts-runtime-server-mcp";

const server = new McpServer({ name: "contractspec", version: "1.0.0" });

const operations = new OperationSpecRegistry();
const resources = new ResourceRegistry();
const prompts = new PromptRegistry();
const logger = new Logger();

const ctxFactories: McpCtxFactories = {
  logger,
  toolCtx: () => ({ actor: "agent", channel: "agent" }),
  promptCtx: () => ({ locale: "en" }),
  resourceCtx: () => ({ locale: "en" }),
};

createMcpServer(server, operations, resources, prompts, ctxFactories);
```

## Behavior details

- Only command operations are registered as MCP tools.
- Resource resolvers support both text and binary payloads (binary is returned as base64 blobs).
- Prompt args are converted to MCP args schema via Zod compatibility helpers.
- Presentations are optional: if no presentation registry is passed or it is empty, no presentation resources are registered.

## AI assistant guidance

When generating code:

- Use this package after operation/resource/prompt specs already exist in `@contractspec/lib.contracts-spec`.
- Start with `createMcpServer` for complete wiring, then drop to `registerMcp*` helpers only for custom registration logic.

When debugging:

- If tools are missing, verify operations are commands (`meta.kind === "command"`).
- If resources are missing, verify `ResourceRegistry` contains templates and URI templates are valid.

## Split migration from deprecated monolith

- `@contractspec/lib.contracts/server/provider-mcp` -> `@contractspec/lib.contracts-runtime-server-mcp/provider-mcp`
- `@contractspec/lib.contracts/server/mcp/*` -> `@contractspec/lib.contracts-runtime-server-mcp/mcp/*`
