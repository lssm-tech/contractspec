---
name: release-readiness
description: Run a release gate for contract compatibility, drift checks, and orchestration safety
---

Run a strict release gate for the ContractSpec plugin workflow.

1. Validate contracts and workspace integrity:
   - `contractspec validate`
   - `contractspec ci --check-drift`
2. Assess compatibility impact:
   - `contractspec impact --baseline main --format markdown`
   - `contractspec version analyze --baseline main`
3. Validate plugin package:
   - `bun run plugin:contractspec:validate`
4. Summarize blockers and required follow-up before publish.

Output format:

```md
## Release Readiness

Status: READY | BLOCKED

Checks:

- validate: pass|fail
- ci-drift: pass|fail
- impact: pass|fail
- version-analysis: pass|fail
- plugin-validation: pass|fail

Blockers:

1. ...
```
