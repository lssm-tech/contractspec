---
"@contractspec/lib.ui-kit": patch
---

Harden native Pagination layout around shared stack primitives.

The native Pagination atom now uses `HStack` and `VStack` for layout, removes render-time logging, normalizes pagination display math for invalid inputs, uses typed ellipsis markers instead of sentinel numbers, and adds accessible labels to page controls.
