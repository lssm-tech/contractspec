---
name: mcp-health-check
description: Verify ContractSpec MCP servers initialize correctly before release
---

Health-check all ContractSpec MCP endpoints shipped with this plugin.

Run:

1. Docs MCP initialize
   - `curl -s -o /dev/null -w "%{http_code}" -X POST "https://api.contractspec.io/api/mcp/docs" -H "content-type: application/json" -H "accept: application/json, text/event-stream" -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"cursor-plugin-check","version":"1.0.0"}}}'`
2. CLI MCP initialize
   - `curl -s -o /dev/null -w "%{http_code}" -X POST "https://api.contractspec.io/api/mcp/cli" -H "content-type: application/json" -H "accept: application/json, text/event-stream" -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"cursor-plugin-check","version":"1.0.0"}}}'`
3. Internal MCP initialize
   - `curl -s -o /dev/null -w "%{http_code}" -X POST "https://api.contractspec.io/api/mcp/internal" -H "content-type: application/json" -H "accept: application/json, text/event-stream" -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"cursor-plugin-check","version":"1.0.0"}}}'`

Expected result: all endpoints return HTTP `200`.

Output format:

```md
## MCP Health Check

- docs: 200|fail
- cli: 200|fail
- internal: 200|fail

Overall: PASS | FAIL
```
