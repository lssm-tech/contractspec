---
"@contractspec/lib.design-system": major
"@contractspec/lib.presentation-runtime-core": patch
"@contractspec/bundle.library": patch
---

Migrate design-system platform implementations from `.mobile` source and export suffixes to Metro-supported `.native` suffixes.

Direct design-system subpath imports ending in `.mobile` are removed. Use the canonical unsuffixed design-system exports for cross-platform code, or use `.native` subpaths when a native-only implementation must be imported directly.
