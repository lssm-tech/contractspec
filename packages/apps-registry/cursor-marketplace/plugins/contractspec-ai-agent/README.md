# contractspec-ai-agent Cursor Plugin

Focused plugin for `@contractspec/lib.ai-agent` orchestration governance.

This plugin enforces:

- Typed `AgentSpec` definitions and bounded execution.
- Approval gates and escalation paths for risky tool usage.
- MCP/tool namespace safety and trace telemetry completeness.

## Included workflows

- `ai-agent-guardrail-audit`
- `ai-agent-mcp-safety-check`

## Included MCP servers

- `contractspec-docs` -> `https://api.contractspec.io/api/mcp/docs`
- `contractspec-cli` -> `https://api.contractspec.io/api/mcp/cli`
- `contractspec-internal` -> `https://api.contractspec.io/api/mcp/internal`
