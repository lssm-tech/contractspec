---
"contractspec": patch
"@contractspec/app.web-landing": patch
"@contractspec/bundle.library": patch
"@contractspec/lib.contracts-spec": patch
"@contractspec/tool.bun": patch
"@contractspec/tool.docs-generator": patch
"@contractspec/biome-config": patch
---

Stabilize local Turbo build caching by modeling generated artifacts explicitly, removing volatile generated timestamps, and avoiding no-op rewrites in build generators.
