---
"@contractspec/lib.support-bot": major
---

Harden support-bot runtime validation, align responder prompts with i18n, and replace the overloaded support-bot threshold config with explicit semantics.

- replace `defineSupportBot`'s overloaded `autoEscalateThreshold` field with an explicit `thresholds` object and pass `review` through directly
- validate `createSupportTools` inputs and classifier LLM JSON more defensively instead of relying on ad hoc casts and unchecked merges
- align responder prompt placeholders with the actual runtime interpolation path and cover the support-bot runtime surface with focused unit tests
