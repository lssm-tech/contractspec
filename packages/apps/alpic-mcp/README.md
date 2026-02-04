# @contractspec/app.alpic-mcp

Minimal MCP server and ChatGPT App asset host for Alpic.

## Alpic settings

- Build command: `npm run build`
- Output directory: `dist`
- MCP endpoints: `/` (SSE + Streamable HTTP) and `/mcp` (Streamable HTTP)
- Assets: `/assets`

## Notes

- Place static UI files in `assets/` at the project root.
- Alpic merges `assets/` and `dist/assets/` on deploy.
- If assets are cached in ChatGPT, use the in-app refresh option.
