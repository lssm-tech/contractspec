---
"@contractspec/lib.ai-providers": patch
"@contractspec/lib.contracts-spec": patch
"@contractspec/lib.ai-agent": patch
"@contractspec/bundle.workspace": patch
"@contractspec/app.cli-contractspec": patch
"@contractspec/bundle.library": patch
"@contractspec/app.provider-ranking-mcp": patch
"agentpacks": patch
"@contractspec/example.agent-console": patch
---

feat(ai-models): add latest models and align defaults

- Add claude-opus-4-6, claude-sonnet-4-6, claude-haiku-4-5, gpt-5.4, gpt-5-mini
- Add mistral-large-2512, mistral-medium-2508, mistral-small-2506, devstral-2512
- Add gemini-3.1-pro-preview, gemini-3.1-flash-lite-preview, gemini-3-flash-preview
- Fix GPT-5.4 cost and context window; update default models to claude-sonnet-4-6
- Enrich provider-ranking MCP with cost from ai-providers when store has none
- Update model allowlist for gpt-5 and gemini 3.x; align agentpacks templates
