---
"@contractspec/lib.design-system": minor
---

Promote object-reference detail panels to a reusable adaptive sheet/drawer surface.

`AdaptivePanel` now centralizes the desktop-sheet/mobile-drawer behavior for web
surfaces, while `ObjectReferenceHandler` keeps same-page detail panels as the
default and can opt into new-page opening. Rich object references can render
nested properties and sections in the same panel so references such as users can
show email, phone, and address details together.
