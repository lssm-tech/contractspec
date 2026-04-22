---
"@contractspec/lib.design-system": minor
"@contractspec/example.agent-console": patch
"@contractspec/example.crm-pipeline": patch
"@contractspec/example.data-grid-showcase": patch
"@contractspec/module.builder-workbench": patch
"@contractspec/module.execution-console": patch
---

Add a unified design-system `Tabs` primitive backed by the web and native UI kits.

The new design-system tabs surface normalizes controlled and uncontrolled tab usage across web and native, so consumers can use one API without handling the native `value` and `onValueChange` requirements directly. Existing local tab consumers now import the design-system tabs instead of reaching into `ui-kit-web` tab leaves.
