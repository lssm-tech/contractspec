---
'@contractspec/app.cli-database': patch
'@contractspec/app.cli-contractspec': major
'@contractspec/biome-config': minor
'@contractspec/bundle.workspace': major
'@contractspec/lib.contracts-spec': major
'@contractspec/module.workspace': major
'@contractspec/tool.create-contractspec-plugin': minor
---

Adopt Biome as the default formatter and linter across the monorepo and generated ContractSpec workspaces.

Remove the legacy ESLint and Prettier toolchain, including formatter selection support for `prettier` and `eslint` in ContractSpec workspace config, CLI options, and formatter services.

Add the `@contractspec/biome-config` package with typed policy manifests, generated repo and consumer Biome presets, bundled Grit diagnostics, and AI-facing policy docs.

Add Biome-aware workspace setup through `contractspec init --targets biome-config` and introduce the `policy` CI check category for contract-first architectural enforcement.

Enable Biome-based Tailwind class sorting and duplicate detection, normalize package-local lint scripts to run against `.` for monorepo and per-package usage, and route Prisma formatting through the package-local Prisma 7 configuration so the root fix flow stays green.
