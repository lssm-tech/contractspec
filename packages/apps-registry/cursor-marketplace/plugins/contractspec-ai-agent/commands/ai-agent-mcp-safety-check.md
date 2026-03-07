---
name: ai-agent-mcp-safety-check
description: Check MCP endpoint health and namespace safety assumptions for @contractspec/lib.ai-agent
---

Run MCP safety checks:

1. Initialize docs, cli, and internal MCP endpoints.
2. Verify MCP tool prefixes avoid collisions with local tool names.
3. Verify approval policy applies to risky MCP-backed actions.
4. Report pass/fail with remediation steps.
