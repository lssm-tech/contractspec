---
"@contractspec/lib.contracts-spec": patch
"@contractspec/lib.builder-spec": minor
"@contractspec/lib.provider-spec": minor
"@contractspec/lib.builder-runtime": minor
"@contractspec/lib.mobile-control": minor
"@contractspec/lib.provider-runtime": minor
"@contractspec/module.builder-workbench": minor
"@contractspec/module.mobile-review": minor
"@contractspec/integration.runtime": minor
"@contractspec/integration.runtime.managed": minor
"@contractspec/integration.runtime.local": minor
"@contractspec/integration.runtime.hybrid": minor
"@contractspec/integration.builder-telegram": minor
"@contractspec/integration.builder-voice": minor
"@contractspec/integration.builder-whatsapp": minor
"@contractspec/integration.provider.codex": minor
"@contractspec/integration.provider.claude-code": minor
"@contractspec/integration.provider.gemini": minor
"@contractspec/integration.provider.copilot": minor
"@contractspec/integration.provider.stt": minor
"@contractspec/integration.provider.local-model": minor
---

Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.

This rollout adds the Builder contracts, runtime, provider/mobile compatibility surfaces, runtime-mode wrappers,
Telegram and WhatsApp control-channel integrations, dedicated Builder operate and mobile-review web surfaces,
and the supporting spec-pack evidence for provider routing, readiness gating, and export orchestration.
