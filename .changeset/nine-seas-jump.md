---
'@contractspec/lib.contracts': major
'@contractspec/lib.ai-agent': major
'@contractspec/lib.schema': patch
'@contractspec/tool.bun': patch
---

perf: reduce import-time memory usage by slimming root barrels and moving heavy runtime surfaces to explicit subpath entrypoints.

Breaking changes:

- `@contractspec/lib.contracts` root exports are now intentionally minimal; workflow/tests/app-config/regenerator/telemetry/experiments and other heavy modules must be imported from their dedicated subpaths.
- `@contractspec/lib.ai-agent` root exports are reduced to lightweight surfaces; runtime agent APIs should be imported from package subpaths.

Additional optimizations:

- add schema-level memoization/caching for zod/json-schema conversion paths and scalar factory reuse in `@contractspec/lib.schema`.
- lower default build memory pressure in `@contractspec/tool.bun` by preferring bun-only dev targets and disabling declaration maps by default for type builds.
