---
root: true
targets:
  - claudecode
  - codexcli
description: Contracts-spec work must remain spec-first, compatibility-aware, and Connect-gated
---

# Contracts Spec Governance

Treat `@contractspec/lib.contracts-spec` as a compatibility surface, not an implementation detail.

Every meaningful change must:

1. update the contract source first
2. classify compatibility intent
3. pass through ContractSpec Connect before risky edits or shell execution
4. preserve policy/workflow integrity
5. leave behind review and replay evidence when escalation is required
6. keep package docs, website docs, and release capsules aligned when the public contract surface or workflow changes
