---
"@contractspec/biome-config": patch
"contractspec": patch
"@contractspec/lib.ui-kit": patch
"@contractspec/lib.ui-kit-web": patch
"@contractspec/lib.ui-kit-core": patch
"@contractspec/lib.design-system": patch
---

Add cross-platform JSX guardrails to the ContractSpec Biome policy presets.

Repository and consumer presets now steer shared presentation surfaces away from raw HTML layout tags toward `HStack`, `VStack`, `Box`, `List`, `ListItem`, and themed typography components, and the generated Grit plugins flag visible JSX text outside `Text` or approved typography components. Monorepo app packages are excluded by default and can be opted in through the policy allowlist. The UI kits now expose cross-platform list primitives, the design-system now exposes themed typography and list wrappers, and a conservative `jsx:fix-primitives` command applies deterministic replacements.
