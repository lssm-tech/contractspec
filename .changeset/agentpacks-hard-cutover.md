---
'agentpacks': patch
---

Hard-cut over ContractSpec workspace agent configuration management to `agentpacks`.

- add CI checks for pack validation and generated-config drift (`agentpacks:validate`, `agentpacks:diff`)
- remove legacy `.rulesync/` and `rulesync.jsonc` sources from the repository
- remove legacy `packs/default` fallback after successful soft-cutover validation
- simplify root scripts to use `agentpacks:*` directly
