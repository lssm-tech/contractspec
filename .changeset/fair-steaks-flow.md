---
"@contractspec/lib.schema": patch
---

Reject invalid `Date` and `DateTime` scalar inputs during `parseValue()` so
runtime parsing stays aligned with the attached Zod schema.
