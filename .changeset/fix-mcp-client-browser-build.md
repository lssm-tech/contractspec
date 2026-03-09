---
"@contractspec/lib.ai-agent": patch
"@contractspec/module.ai-chat": patch
---

fix: use browser-safe MCP client stub in client bundles

Next.js Turbopack was resolving to the Node mcp-client (which uses
node:child_process) when bundling for the browser, causing build failures.
Now useChat explicitly imports mcp-client.browser, and lib.ai-agent exports
include an explicit browser condition for tools/mcp-client.
