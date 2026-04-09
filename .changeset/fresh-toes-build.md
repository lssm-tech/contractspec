---
"@contractspec/tool.bun": patch
"@contractspec/bundle.marketing": patch
"@contractspec/lib.accessibility": patch
"@contractspec/lib.contracts-runtime-client-react": patch
"@contractspec/lib.design-system": patch
"@contractspec/lib.example-shared-ui": patch
"@contractspec/lib.presentation-runtime-react": patch
"@contractspec/lib.surface-runtime": patch
"@contractspec/lib.ui-kit": patch
"@contractspec/lib.ui-kit-web": patch
"@contractspec/lib.ui-link": patch
"@contractspec/lib.video-gen": patch
"@contractspec/module.builder-workbench": patch
"@contractspec/module.examples": patch
"@contractspec/module.execution-console": patch
"@contractspec/module.mobile-review": patch
---

Pass `--production` to Bun transpile/publish paths so released browser bundles stop emitting the development JSX runtime.

This updates `@contractspec/tool.bun` so non-watch transpile commands force Bun's production JSX mode, then refreshes the published React-facing packages whose built browser artifacts depended on that shared path.
