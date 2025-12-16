# @lssm/eslint-plugin-design-system

Design-system enforcement rules for LSSM apps. Ships:

- `prefer-design-system`: auto-rewrites known `@lssm/lib.ui-kit-web` form/control imports to `@lssm/lib.design-system` and flags intrinsic layout/form elements
- `no-intrinsic-typography`: flag raw headings/paragraph/spans; use DS typography primitives
- `design-import-boundary`: block forbidden design imports (default: native ui-kit in web)
- `localAllowPatterns` option (prefer-design-system): allow local/relative imports (shadcn-style) to bypass DS replacement so teams can copy/paste components.

`configs.recommended` enables all of the above.

Usage:

```js
import dsPlugin from '@lssm/eslint-plugin-design-system';

export default [
  dsPlugin.configs.recommended,
  // or customize
  // {
  //   plugins: { 'design-system': dsPlugin },
  //   rules: {
  //     'design-system/prefer-design-system': [
  //       'error',
  //       {
  //         intrinsicDisallowList: ['div', 'button'],
  //         localAllowPatterns: ['^\\./components', '^@/components'],
  //       },
  //     ],
  //     'design-system/no-intrinsic-typography': 'error',
  //     'design-system/design-import-boundary': 'error',
  //   },
  // },
];
```




