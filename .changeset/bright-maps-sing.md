---
"@contractspec/bundle.library": patch
---

Normalize MCP POST Accept headers for JSON-only clients so MCP prompt and tool calls do not fail with a 406 when the client omits `text/event-stream`.
