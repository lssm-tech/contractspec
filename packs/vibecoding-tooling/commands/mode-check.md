---
description: 'Audit mode and preference governance compliance across Guided / Pro / Autopilot and PreferenceDimensions'
targets: ['*']
---

Invoke the `mode-auditor` subagent to audit the codebase for interaction governance compliance (mode boundaries + preference adaptation).

1. Check whether a recent mode/preference audit already exists for the same scope and whether relevant files changed.
2. If no relevant files changed, summarize prior findings and skip a full re-audit.
3. If relevant files changed, run the `mode-auditor` against the current codebase or changed files only.
4. The auditor checks mode and preference dimensions: capability matrix, preference contract integrity, resolution/constraints, bridge consistency, API/audit coverage, entitlements/flags, safety invariants, type consistency, and UI/UX behavior.
5. Present the Mode + Preference Compliance Report with severity levels, remediation priorities, and a clear `full` or `delta` label.

If `$ARGUMENTS` specifies a file or directory path, scope the audit to that path only.
Otherwise, scan the full mode/preference governance surface:

- `packages/apps/web-application/src/app/api/` (API routes)
- `packages/apps/web-application/src/app/(app)/` (UI components)
- `packages/bundles/example-product/src/modules/mode/` (mode business logic)
- `packages/bundles/example-product/src/modules/autopilot/` (autopilot business logic)
- `packages/bundles/example-product/src/modules/preferences/` (preference business logic)
- `packages/bundles/example-product/src/presentation/components/mode/providers/mode-provider/` (mode/preference bridge)
- `packages/bundles/example-product/src/presentation/components/preferences/` (preference UI providers/hooks)
- `packages/libs/contracts-contractspec-studio/src/mode/` (mode contracts)
- `packages/libs/contracts-contractspec-studio/src/preferences/` (preference contracts)
