---
"@contractspec/module.learning-journey": major
"@contractspec/module.examples": patch
"@contractspec/example.learning-journey-ambient-coach": major
"@contractspec/example.learning-journey-crm-onboarding": major
"@contractspec/example.learning-journey-duo-drills": major
"@contractspec/example.learning-journey-platform-tour": major
"@contractspec/example.learning-journey-quest-challenges": major
"@contractspec/example.learning-journey-registry": major
"@contractspec/example.learning-journey-studio-onboarding": major
"@contractspec/example.learning-journey-ui-coaching": major
"@contractspec/example.learning-journey-ui-gamified": major
"@contractspec/example.learning-journey-ui-onboarding": major
"@contractspec/example.learning-journey-ui-shared": major
"@contractspec/example.learning-patterns": major
---

Redesign the learning system around a canonical adaptive journey runtime and align all learning examples with it.

Major learning-package changes:

- replace the onboarding-centric journey surface with `learning.journey.*` contracts, adaptive step conditions, prerequisites, branching, and projected progress snapshots
- move canonical journey evaluation/runtime behavior into `@contractspec/module.learning-journey` and update the learning registry, shared UI hook, and learning examples to consume it
- rewrite the learning example tracks and tests to use the new branch-aware runtime model and shared registry wiring

Sandbox/runtime fix:

- wire all `learning-journey-*` templates in `@contractspec/module.examples` to the shared learning registry presentations so `/sandbox?template=learning-journey-*` resolves `learning.journey.track_list`, `learning.journey.track_detail`, and `learning.journey.progress_widget` correctly
