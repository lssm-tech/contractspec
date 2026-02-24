---
targets:
  - '*'
root: false
description: Enforce design-system-first UI for marketing/web surfaces.
globs:
  - 'packages/apps/web-application/src/app/(app)/**'
  - 'packages/apps/web-marketing/**'
  - 'packages/bundles/**/src/presentation/**'
  - 'packages/libs/design-system/**'
  - 'packages/libs/ui-kit-web/**'
cursor:
  alwaysApply: false
  description: Enforce design-system-first UI for marketing/web surfaces.
  globs:
    - 'packages/apps/web-application/src/app/(app)/**'
    - 'packages/apps/web-marketing/**'
    - 'packages/bundles/**/src/presentation/**'
    - 'packages/libs/design-system/**'
    - 'packages/libs/ui-kit-web/**'
---

# Design System First (No Raw HTML in Apps/Bundles)

Priority order:

1. Use `@contractspec/lib.design-system` components (atoms/molecules/organisms, layouts).
2. If the required block/section is missing, add it inside `packages/libs/design-system` and export it there.
3. Only when DS truly lacks a primitive, use `@contractspec/lib.ui-kit-web` equivalents. Do not mix ui-kit and DS in the same component unless bridging to add the DS primitive.

Layout & structure:

- Prefer `HStack`/`VStack`/`Stack`/`Box`/`Grid` primitives over `div`/`section`/`main`/`header`/`footer` within app or bundle code.
- Use DS/kit containers (`MarketingLayout`, `AppLayout`, `PageHeaderResponsive`, `ListPage*`) before custom wrappers.
- Keep files under size limits (components ≤150 lines; split immediately if larger).

Typography:

- Use DS text/heading primitives or typography tokens from `@contractspec/lib.ui-kit-web/ui/typography`.
- Avoid raw `<p>/<h1>-<h6>/<span>` unless authoring a new DS atom.

Forms & controls:

- Use DS form atoms (`Button`, `ButtonLink`, `Input`, `Textarea`, `Stepper`, `EmptyState`, etc.).
- Do not use intrinsic `button/input/textarea/select/form/label` in app/bundle code; create or reuse DS atoms instead.

Icons & feedback:

- Use the shared icon set (e.g., lucide) but wrap them in DS/kit layout and typography components.
- Provide loading/empty/error states using DS patterns (`Loader*`, `EmptyState`, `ErrorState`).

Accessibility & UX:

- Honor ARIA, keyboard, focus, and `prefers-reduced-motion`; rely on DS components’ built-in behavior where possible.
- Maintain visible focus states; respect 4.5:1 contrast via tokens.

Dependency flow:

- Apps → bundles → modules → libs; never import bundles from apps or libs.
- Do not import `@contractspec/lib.ui-kit` (native) in web code.

When adding new DS primitives:

- Place new atoms/molecules/organisms under `packages/libs/design-system/src/components/**` with full typing and exports in `src/index.ts`.
- Keep them platform-neutral where possible; add `.mobile`/`.web` splits only if required.
- Document props and intended usage inline with JSDoc.

Tests/docs:

- Update relevant DocBlocks when behavior or exports change.
- Ensure ESLint `prefer-design-system` passes; do not suppress without approval.
