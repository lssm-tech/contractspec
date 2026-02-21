---
'@contractspec/app.registry-packs': patch
'agentpacks': patch
'@contractspec/lib.support-bot': patch
'@contractspec/lib.video-gen': patch
'@contractspec/example.pocket-family-office': patch
---

fix: stabilize lint and tests after voice capability migration

- remove strict-lint violations across registry-packs, support-bot, video-gen, and agentpacks
- align voice provider tests and pocket-family-office blueprint with the `ai.voice.tts` capability key
- keep agentpacks package exports in sync by exposing `./utils/model-allowlist`
