# ContractSpec Cursor Marketplace Catalog

This package is the canonical home for Cursor marketplace plugin assets in this repository.

## Plugins in this catalog

- `contractspec` - Product-level spec-first governance and release guardrails.
- `contractspec-contracts-spec` - Contract model authoring and compatibility discipline for `@contractspec/lib.contracts-spec`.
- `contractspec-contracts-integrations` - Provider and integration contract governance for `@contractspec/lib.contracts-integrations`.
- `contractspec-ai-agent` - Typed orchestration, approval, and MCP safety for `@contractspec/lib.ai-agent`.

## Layout

- `plugins/<plugin-name>/` - Cursor plugin sources (`.cursor-plugin/plugin.json`, rules, commands, agents, skills, `.mcp.json`).
- Root marketplace manifest (`/.cursor-plugin/marketplace.json`) references these plugin paths for submission.

## Validation

From repository root:

```bash
bun run plugin:contractspec:validate
```

Or from this package directory:

```bash
bun run validate
```
