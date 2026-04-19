# ContractSpec Consumer Policy Rules

Generated from the typed Biome policy manifest.

## consumer/no-native-html-components
- Engine: biome-native
- Severity: error
- Message: Consumer applications should use ContractSpec design-system and ui-kit components instead of native HTML primitives.
- Docs source: packs/workspace-specific/rules/design-system-usage.md

## consumer/prefer-contractspec-design-system-imports
- Engine: biome-grit
- Severity: error
- Message: Consumer applications should import controls from @contractspec/lib.design-system before reaching for ui-kit-web leaf imports.
- Docs source: packs/workspace-specific/rules/design-system-usage.md

## consumer/require-contract-first
- Engine: contractspec-ci
- Severity: error
- Message: Handlers, routes, and implementation entrypoints must import or reference a ContractSpec contract before shipping behavior.
- Docs source: packs/contractspec-rules/rules/contracts-first.md

## consumer/no-deprecated-contracts-monolith
- Engine: biome-native
- Severity: error
- Message: Use split ContractSpec packages instead of the deprecated monolith.
- Docs source: packs/contractspec-rules/rules/contracts-first.md

## consumer/prefer-contractspec-runtime-entrypoints
- Engine: biome-grit
- Severity: error
- Message: Prefer package-level ContractSpec runtime entrypoints before using deeper runtime leaf imports.
- Docs source: packs/workspace-specific/rules/package-architecture.md

