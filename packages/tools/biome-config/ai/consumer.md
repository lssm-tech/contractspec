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

