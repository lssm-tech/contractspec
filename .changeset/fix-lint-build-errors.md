---
'@contractspec/lib.contracts-integrations': patch
'@contractspec/lib.contracts-spec': patch
'@contractspec/lib.ai-providers': patch
'@contractspec/lib.provider-ranking': patch
'@contractspec/lib.design-system': patch
'@contractspec/lib.ui-kit': patch
'@contractspec/integration.providers-impls': patch
'@contractspec/integration.runtime': patch
'@contractspec/app.provider-ranking-mcp': patch
---

Fix lint and build errors across nine packages: remove unused imports and type imports from integration provider files, replace forbidden non-null assertions with proper type narrowing, and resolve TypeScript indexing error for `ColorSchemeName` in the Switch component.
