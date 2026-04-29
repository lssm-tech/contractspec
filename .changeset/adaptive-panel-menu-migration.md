---
"@contractspec/lib.design-system": patch
---

Route design-system mobile menu overlays through the shared AdaptivePanel primitive.

Header and marketing header mobile menus now use the same adaptive overlay
boundary as object references, keeping direct sheet/drawer composition confined
to the AdaptivePanel adapter.
