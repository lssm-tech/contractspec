---
"@contractspec/lib.ui-kit": patch
---

Add native UI-kit subpaths for Metro's `ui-kit-web` alias surface.

Expo builds that import shared design-system controls through `@contractspec/lib.ui-kit-web/ui/*` now resolve the native `@contractspec/lib.ui-kit/ui/*` targets for combobox, input-group, input-otp, and native-select. The new native shims reuse existing UI-kit primitives so design-system callers can keep one import path while Metro maps it to native implementations.
