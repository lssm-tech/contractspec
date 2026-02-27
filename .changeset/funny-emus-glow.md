---
'@contractspec/lib.contracts-spec': patch
---

Automate the `contracts-spec` README contract inventory section from package exports and `ContractSpecType`, so category/kind listings stay accurate as new contracts are added.

Add `bun run readme:inventory` and a generator script to refresh the inventory block with counts, per-category matrices, and fully enumerated contract artifact lists.
