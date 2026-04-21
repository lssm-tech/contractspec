---
"@contractspec/module.examples": major
"@contractspec/app.cli-contractspec": minor
"@contractspec/bundle.marketing": patch
"@contractspec/bundle.library": patch
---

Split the examples module into a catalog-first root export and optional runtime subpath so CLI-style consumers no longer install or bundle every `@contractspec/example.*` package. The CLI now adds `contractspec examples download <key>` for fetching full example source through git sparse checkout when needed.
