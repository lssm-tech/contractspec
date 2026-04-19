---
"@contractspec/integration.builder-telegram": patch
"@contractspec/integration.builder-voice": patch
"@contractspec/integration.builder-whatsapp": patch
"@contractspec/integration.provider.claude-code": patch
"@contractspec/integration.provider.codex": patch
"@contractspec/integration.provider.copilot": patch
"@contractspec/integration.provider.gemini": patch
"@contractspec/integration.provider.local-model": patch
"@contractspec/integration.provider.stt": patch
"@contractspec/integration.runtime.hybrid": patch
"@contractspec/integration.runtime.local": patch
"@contractspec/integration.runtime.managed": patch
---

Restore provenance-safe publishing for the public integration packages by adding the missing repository metadata and failing release discovery before npm publish when a publishable manifest omits `repository.url`.
