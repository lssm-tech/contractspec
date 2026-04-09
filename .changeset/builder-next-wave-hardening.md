---
"@contractspec/lib.builder-spec": minor
"@contractspec/lib.builder-runtime": minor
"@contractspec/lib.mobile-control": minor
"@contractspec/lib.provider-runtime": minor
"@contractspec/module.builder-workbench": minor
"@contractspec/module.mobile-review": minor
"@contractspec/integration.runtime.local": minor
"@contractspec/integration.provider.gemini": minor
"@contractspec/app.cli-contractspec": minor
"@contractspec/bundle.library": patch
---

Harden the Builder rollout with canonical bootstrap presets, channel-heavy mobile review flows, local-daemon runtime registration, and richer operator status surfaces.

This release extends `builder.workspace.bootstrap` with managed, local-daemon, and hybrid preset support, adds `builder.runtimeTarget.registerLocalDaemon` and `builder.mobileReviewCard.resolve`, and exposes matching CLI/operator status flows for bootstrap, mobile parity, local daemon, and comparison posture. It also upgrades Builder mobile review contracts and readiness reporting to surface channel-native versus deep-link actions, local runtime trust and lease details, and policy-driven high-risk comparison coverage while keeping `builder.workspace.snapshot` as the single read model.
