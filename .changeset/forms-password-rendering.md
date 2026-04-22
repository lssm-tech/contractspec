---
"@contractspec/lib.contracts-spec": minor
"@contractspec/lib.contracts-runtime-client-react": minor
"@contractspec/lib.design-system": minor
"@contractspec/lib.ui-kit-web": minor
"@contractspec/lib.ui-kit": minor
"@contractspec/lib.ui-kit-core": patch
---

Add password-aware FormSpec rendering for current and new password fields.

Text FormSpec fields can now declare `password` metadata, including current/new password purpose and visibility-toggle labels. The React FormSpec renderer detects explicit password metadata, keyboard/autocomplete hints, and legacy `uiProps.type = "password"` fields, then renders masked inputs with `current-password` or `new-password` autocomplete hints.

The design-system, web UI kit, and native UI kit now expose shared `InputPassword` controls with right-side visibility toggles. Custom FormSpec drivers can opt into the new `PasswordInput` slot; existing drivers fall back to a regular masked input.
