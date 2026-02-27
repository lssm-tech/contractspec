---
name: contract-impact
description: Analyze contract compatibility and release risk before merge
---

Run contract impact analysis and convert results into release decisions.

1. Run impact analysis:
   - `contractspec impact --baseline main --format markdown`
2. If any change is potentially breaking, rerun with strict mode:
   - `contractspec impact --baseline main --fail-on-breaking`
3. Summarize:
   - Breaking vs non-breaking deltas
   - Affected contract keys
   - Required migration/version notes

Output format:

```md
## Contract Impact

Risk: LOW | MEDIUM | HIGH
Breaking changes: <count>
Non-breaking changes: <count>

### Affected contracts

1. <contract.key>.v<version> - <impact>

### Release action

1. <versioning recommendation>
2. <migration note>
```
