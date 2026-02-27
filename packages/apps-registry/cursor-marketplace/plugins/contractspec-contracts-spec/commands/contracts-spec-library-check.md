---
name: contracts-spec-library-check
description: Validate and type-check @contractspec/lib.contracts-spec before release
---

Run a strict library release gate:

1. `contractspec validate`
2. `turbo run typecheck --filter=@contractspec/lib.contracts-spec`
3. `turbo run test --filter=@contractspec/lib.contracts-spec`
4. Report blockers with impacted contracts and required fixes.
