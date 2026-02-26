# contractspec Cursor Plugin

ContractSpec is a focused Cursor plugin for one deep job:

**Keep AI-built software coherent by making contracts the source of truth, then enforcing governed agent orchestration around those contracts.**

This plugin is intentionally narrow. It targets:

- Spec-first contract design and compatibility discipline.
- Agent orchestration guardrails (approval, escalation, tool safety).
- End-to-end traceability with explicit telemetry and audit-friendly decisions.

## What is included

- **Rules** for contract-first implementation, orchestration safety, and release impact.
- **Commands** for contract impact analysis, orchestration audits, MCP health checks, and release readiness.
- **Agents** specialized for contract governance and orchestration guardrail review.
- **Skills** for authoring robust contracts and hardening agent workflows.
- **MCP servers** for ContractSpec docs, CLI guidance, and internal endpoint discovery.

## Quick start

1. Install the plugin from the Cursor marketplace (or load from this repository source).
2. Ask the agent to define or update behavior contracts first.
3. Run these plugin commands before merge:
   - `contract-impact`
   - `orchestration-audit`
   - `mcp-health-check`
   - `release-readiness`
4. Fix blockers until the release gate is `READY`.

## Scope boundaries

This plugin is intentionally focused on ContractSpec's product moat. It does **not** try to be a generic coding-style or language best-practices bundle.

## Included MCP Servers

- `contractspec-docs` -> `https://api.contractspec.io/api/mcp/docs`
- `contractspec-cli` -> `https://api.contractspec.io/api/mcp/cli`
- `contractspec-internal` -> `https://api.contractspec.io/api/mcp/internal`

## Core workflows

1. Define or change contracts in `@contractspec/lib.contracts-spec` before implementation.
2. Run `contract-impact` to classify compatibility risk.
3. Audit orchestration policy and tool safety with `orchestration-audit`.
4. Run `mcp-health-check` and `release-readiness` before publishing.

## Local validation

From repository root:

```bash
bun run plugin:contractspec:validate
```

This validates plugin structure, manifest/frontmatter hygiene, and MCP endpoint initialization.

If you need offline validation, skip network checks:

```bash
SKIP_PLUGIN_NETWORK_CHECK=1 bun run plugin:contractspec:validate
```
