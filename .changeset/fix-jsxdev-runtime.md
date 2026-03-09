---
"@contractspec/module.ai-chat": patch
"@contractspec/tool.bun": patch
---

Fix jsxDEV runtime error in ai-chat module

- Add bunfig.toml to ai-chat with `jsx = "react-jsx"` to work around Bun v1.3+ regression (oven-sh/bun#23959)
- Pass NODE_ENV=production when spawning bun build in runTranspile for monorepo-wide safeguard
