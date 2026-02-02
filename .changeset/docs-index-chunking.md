---
'@contractspec/app.web-landing': patch
'@contractspec/bundle.library': patch
'@contractspec/lib.design-system': patch
'@contractspec/tool.docs-generator': patch
'contractspec-example-opencode-cli': patch
---

Split the generated docs index into a manifest and chunked JSON files to reduce bundle size and load reference data lazily, updating reference pages and generator outputs accordingly.
