---
"@contractspec/biome-config": patch
"contractspec": patch
"@contractspec/lib.ui-kit": patch
"@contractspec/lib.ui-kit-web": patch
"@contractspec/lib.ui-kit-core": patch
"@contractspec/lib.design-system": patch
---

Improve the JSX primitive guardrails and fixer for shared presentation code.

The Biome presets continue to steer shared presentation surfaces away from raw HTML layout, list, and typography tags toward `HStack`, `VStack`, `Box`, `List`, `ListItem`, and themed typography components. The companion `jsx:fix-primitives` command is now more style-preserving: it keeps authored attributes and classes, infers safe list props from simple class strings, reuses compatible imports, and wraps text with block or inline-safe `Text` depending on the surrounding JSX context. Monorepo app packages remain excluded by default unless explicitly allowlisted.
