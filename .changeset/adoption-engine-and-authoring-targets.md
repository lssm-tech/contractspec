---
"@contractspec/lib.contracts-spec": minor
"@contractspec/module.workspace": minor
"@contractspec/bundle.workspace": minor
"@contractspec/bundle.library": minor
"@contractspec/app.cli-contractspec": minor
"vscode-contractspec": minor
"contractspec": patch
"@contractspec/lib.knowledge": patch
"@contractspec/biome-config": patch
"@contractspec/app.cursor-marketplace": patch
---

Expand ContractSpec reuse and authoring coverage across the CLI, Connect, workspace services, MCP, VS Code, and consumer setup surfaces.

- add a ContractSpec Adoption Engine with a local-first OSS catalog, family-aware resolution, Connect gating, CLI commands, MCP tools/resources, setup wiring, and marketplace plugin assets
- extend shared authoring-target discovery and the CLI/VS Code create flows to cover additional contract families with consistent file placement and helper scaffolding
- refresh bundled workspace-config schemas, Biome policy artifacts, and smaller package exports so downstream consumers see the new config, runtime-entrypoint guidance, and knowledge payload surface
