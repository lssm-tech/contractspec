---
name: adoption-resolve
description: Resolve the best ContractSpec adoption candidate before writing new code
---
Use the ContractSpec Adoption Engine before creating a new surface:

1. Run `contractspec connect adoption sync --json`.
2. Run `contractspec connect adoption resolve --family <ui|contracts|integrations|runtime|sharedLibs|solutions> --stdin --json`.
3. If the result is `rewrite`, reuse the recommended workspace or ContractSpec candidate instead of creating a duplicate.
