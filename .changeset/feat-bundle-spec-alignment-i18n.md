---
"@contractspec/lib.surface-runtime": patch
"@contractspec/lib.personalization": patch
"@contractspec/lib.contracts-spec": patch
"@contractspec/lib.ai-agent": patch
"@contractspec/module.ai-chat": patch
---

Bundle spec alignment and i18n support

**surface-runtime**
- Add i18n for OverlayConflictResolver and PatchProposalCard (en, fr, es)
- Add locale to ResolvedSurfacePlan; pass through from BundleContext
- Export ./i18n with createSurfaceI18n, SURFACE_KEYS

**personalization**
- Add PreferenceDimensions, BundlePreferenceAdapter, ResolvedPreferenceProfile
- Align with specs/contractspec_modules_bundle_spec_2026-03-08 (05_personalization_model)
- Export ./preference-dimensions

**contracts-spec**
- Add validateBundleRequires for ModuleBundleSpec.requires validation
- Document bundle requires alignment in README and AGENTS.md

**ai-agent**
- Document surface-runtime planner tools integration in README
- Add optional peer @contractspec/lib.surface-runtime

**module.ai-chat**
- Add UseChatToolDef and optional tools to UseChatOptions (reserved for planner)
- Document bundle spec alignment; add optional peer @contractspec/lib.surface-runtime
