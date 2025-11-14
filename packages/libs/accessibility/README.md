# @lssm/lib.accessibility

Stable exports of accessibility primitives for LSSM web apps.

- Install

```bash
npm install @lssm/lib.accessibility
# or
bun add @lssm/lib.accessibility
```

- Import with tree-shaken entry points. The `dist/` bundle is platform-aware and assumes you already installed `@lssm/lib.design-system`, `@lssm/lib.ui-kit`, and `@lssm/lib.ui-kit-web`.

- `SkipLink`
- `VisuallyHidden`
- `SRLiveRegionProvider`, `useSRLiveRegion`
- `RouteAnnouncer`
- `FocusOnRouteChange`
- `useReducedMotion`

These map directly to rules in `docs/accessibility_wcag_compliance_specs.md` (skip link, live regions, focus management, PRM).

