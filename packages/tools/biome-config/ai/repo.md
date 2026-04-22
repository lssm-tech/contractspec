# ContractSpec Repo Policy Rules

Generated from the typed Biome policy manifest.

## repo/no-native-ui-kit-in-web-surfaces
- Engine: biome-native
- Severity: error
- Message: Web surfaces must not import the native ui-kit directly.
- Docs source: packs/workspace-specific/rules/design-system-usage.md

## repo/no-web-ui-kit-in-native-surfaces
- Engine: biome-native
- Severity: error
- Message: Native surfaces must not import the web ui-kit directly.
- Docs source: packs/workspace-specific/rules/design-system-usage.md

## repo/no-raw-html-in-app-surfaces
- Engine: biome-native
- Severity: error
- Message: Use ContractSpec design-system primitives instead of raw HTML in application surfaces.
- Docs source: packs/workspace-specific/rules/design-system-usage.md

## repo/no-raw-jsx-text-outside-typography
- Engine: biome-grit
- Severity: error
- Message: Wrap visible JSX text with Text or another approved typography component for React and React Native compatibility.
- Docs source: packs/workspace-specific/rules/design-system-usage.md

## repo/prefer-design-system-imports
- Engine: biome-grit
- Severity: error
- Message: Prefer @contractspec/lib.design-system over leaf ui-kit-web control imports in application surfaces.
- Docs source: packs/workspace-specific/rules/design-system-usage.md

## repo/no-deprecated-contracts-monolith
- Engine: biome-native
- Severity: error
- Message: Use split ContractSpec packages instead of the deprecated monolith.
- Docs source: packs/contractspec-rules/rules/contracts-first.md

## repo/prefer-runtime-package-entrypoints
- Engine: biome-grit
- Severity: error
- Message: Prefer package-level ContractSpec runtime entrypoints over leaf runtime imports when the root package already exposes the needed surface.
- Docs source: packs/workspace-specific/rules/package-architecture.md

