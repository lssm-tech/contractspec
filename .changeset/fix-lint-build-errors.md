---
"@contractspec/bundle.workspace": patch
"@contractspec/lib.contracts-integrations": patch
---

Fix lint and build errors: replace forbidden non-null assertion with safe flatMap guard in changelog formatter, and ensure required Record fields survive Partial spread in integration test helpers
