---
name: contracts-spec-impact
description: Analyze compatibility impact for @contractspec/lib.contracts-spec changes
---

Run contract-level impact before merge:

1. `contractspec impact --baseline main --format markdown`
2. If any breaking change appears: `contractspec impact --baseline main --fail-on-breaking`
3. Summarize affected keys, compatibility type, and required migration/version notes.
