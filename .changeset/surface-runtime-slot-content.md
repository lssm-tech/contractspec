---
"@contractspec/lib.surface-runtime": patch
---

feat(surface-runtime): add slotContent prop to BundleRenderer

- Allow override content for any slot via slotContent partial record
- Render slotContent[slotId] when provided instead of SlotRenderer
