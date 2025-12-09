# Accessibility & WCAG Compliance — **specs.md**

> **Goal:** Ship interfaces that are usable by everyone, by default. This spec sets non‑negotiable rules, checklists, and CI gates to meet **WCAG 2.2 AA** (aim for AAA where low‑cost), align with **EN 301 549** (EU), and keep parity on **web (Next.js)** and **mobile (Expo/React Native)**.

---

## 0) Scope & Principles

- **Standards:** WCAG 2.2 AA (incl. new 2.2 SCs: Focus Not Obscured, Focus Appearance, Target Size, Dragging Movements, Accessible Authentication, Redundant Entry). EN 301 549 compliance by conformance to WCAG.
- **Principles:** Perceivable, Operable, Understandable, Robust (POUR).
- **Rule of ARIA:** “No ARIA is better than bad ARIA.” Prefer native elements.
- **Definition of Done (DoD):** No Critical/Major a11y issues in CI; keyboard complete; SR (screen reader) smoke test passed; contrasts pass; acceptance criteria below satisfied.
- **Repo Alignment:** Web apps use **Radix Primitives + shadcn** wrappers centralized in `packages/lssm/libs/ui-kit-web`. Prefer those components over per‑app duplicates (`packages/*/apps/*/src/components/ui`). When missing, add to `ui-kit-web` first, then adopt app‑side.

---

## 1) Design Requirements (Design System & Tokens)

**1.1 Color & Contrast**

- Body text, icons essential to meaning: **≥ 4.5:1**; large text (≥ 18.66px regular / 14px bold): **≥ 3:1**.
- Interactive states (default/hover/active/disabled/focus) must maintain contrast **≥ 3:1** against adjacent colors; text within components follows text ratios.
- Provide light & dark themes with tokens that guarantee minimums. **Never rely solely on color** to convey meaning; pair with text, shape, or icon.

**1.2 Focus Indicators (WCAG 2.4.11/12)**

- Every interactive element has a **visible focus** with clear offset; indicator contrast **≥ 3:1** vs adjacent colors and indicator **area ≥ 2 CSS px** thick.
- Focus **must not be obscured** by sticky headers/footers or scroll containers.

**1.3 Motion & Preferences**

- Respect `prefers-reduced-motion`: suppress large parallax, auto‑animations; provide instant alternatives.
- Avoid motion that could trigger vestibular issues; under PRM, use fade/scale under **150ms**.

**1.4 Target Size (2.5.8)**

- Hit areas **≥ 24×24 CSS px** (web) and **≥ 44×44 dp** (mobile) unless exempt.

**1.5 Typography & Layout**

- Support zoom to **400%** without loss of content/functionality; responsive reflow at **320 CSS px** width.
- Maintain clear heading hierarchy (h1…h6), one **h1** per view.

- Repository baseline (Web): default body text uses Tailwind `text-lg` (≈18px). As of 2025‑09‑20, the repository bumped all Tailwind typography scale usages by +1 step (e.g., `text-sm`→`text-base`, `text-base`→`text-lg`, …, `text-8xl`→`text-9xl`). For long‑form content, default to `prose-lg`.
- Do not use `text-xs` for body copy. Reserve `text-sm` only for non‑essential meta (timestamps, fine print) while ensuring contrast and touch targets remain compliant.
- When increasing font size, ensure line height supports readability. Prefer Tailwind defaults or `leading-relaxed`/`leading-7` for body text where dense blocks appear.

**1.6 Iconography & Imagery**

- Decorative images: `alt=""` or `aria-hidden="true"`.
- Informative images: concise, specific **alt**; complex charts require a **data table or long description**.

---

## 2) Content Requirements (UX Writing)

- Links say **what happens** (avoid “click here”).
- Buttons start with verbs; avoid ambiguous labels.
- Form labels are **visible**; placeholders are **not labels**.
- Error messages: human + programmatic association; avoid color‑only.
- Authentication: allow **copy/paste**, password managers, and avoid cognitive tests alone (**3.3.7/3.3.8/3.3.9**).
- Avoid CAPTCHAs that block users; if unavoidable, provide **multiple alternatives** (logic-free).

---

## 3) Engineering Requirements (Web — Next.js/React)

> Use and extend `packages/lssm/libs/ui-kit-web` as the default UI surface. It wraps **Radix** primitives with sensible a11y defaults (focus rings, roles, keyboard, ARIA binding). When a gap exists, add it to `ui-kit-web` first.

**3.1 Semantics & Landmarks**

- Use native elements: `<button>`, `<a href>`, `<label for>`, `<fieldset>`, `<legend>`, `<table>`, etc.
- Landmarks per page: `header`, `nav`, `main`, `aside`, `footer`. Provide a **Skip to main content** link.
- Provide a **Route Announcer** (`aria-live="polite"`) and move focus to page **h1** after navigation.

**3.2 Keyboard**

- All functionality available with keyboard alone. Tab order follows DOM/visual order; **no keyboard traps**.
- Common bindings:
  - Space/Enter → activate button; Enter on link;
  - Esc closes dialogs/menus;
  - Arrow keys for lists/menus/tablists with **roving tabindex**.

**3.3 Focus Management**

- On route change (Next.js), move focus to the page `<h1>` or container and announce via a live region.
- Dialogs/menus: **trap focus** inside; return focus to invoking control on close.
- Don’t steal focus except after explicit user action.

**3.4 Forms**

- Each input has a `<label>` or `aria-label`. Group related inputs with `<fieldset><legend>`.
- Associate errors via `aria-describedby` or inline IDs; announce with `role="alert"` (assertive only for critical).
- Provide **autocomplete** tokens for known fields; show **inline validation** and do not block on **onBlur** alone.

**3.5 ARIA Usage**

- Only when needed; match patterns (dialog, menu, combobox, tablist, listbox) per ARIA Authoring Practices.
- Ensure **name/role/value** are programmatically determinable.

**3.6 Media**

- Videos: **captions**; provide **transcripts** for audio; audio descriptions for essential visual info.
- No auto‑playing audio. Auto‑playing video must be muted and pausable; provide controls.

**3.7 Tables & Data**

- Use `<th scope>` for headers; captions via `<caption>`; announce sorting via `aria-sort`.
- Provide CSV/JSON export where charts are primary.

**3.8 Performance & Robustness**

- Avoid content shifts that move focus; reserve space or use skeletons.
- Maintain accessible names through hydration/SSR; avoid `dangerouslySetInnerHTML` where possible.

**3.9 Next.js specifics**

- Use `next/link` for navigation; ensure links are **links**, not buttons.
- `next/image` must include **alt** (empty if decorative).
- Announce route changes with a **global live region** and shift focus to the new view.

**3.10 Accessibility library integration**

- Import `@lssm/lib.accessibility` at app root. It auto-imports its `styles.css` via the package entry; ensure bundlers keep CSS side effects. If your app tree-shakes CSS, explicitly import the stylesheet once in your root layout:

```tsx
// app/layout.tsx
import '@lssm/lib.accessibility'; // includes tokens and provider exports
// or if needed: import '@lssm/lib.accessibility/src/styles.css';
```

- Wrap the app with `AccessibilityProvider` and include an element with `id="main"` for the skip link target.

---

## 3b) lssm/ui-kit-web — Component Patterns & Defaults

> Source: `packages/lssm/libs/ui-kit-web/ui/*`

- **Button/Input/Textarea**: Built‑in `focus-visible` rings; ensure visible labels via `FormLabel` or `aria-label`.
- **Form** (`form.tsx`): `FormControl` wires `aria-invalid` and `aria-describedby` to `FormMessage` and `FormDescription`. Prefer `FormMessage` for inline errors. Add `role="alert"` only for critical.
- **Dialog/Sheet/Dropdown**: Use Radix wrappers for focus‑trap and return‑focus. Provide `DialogTitle` + `DialogDescription` for name/description.
- **Select/Combobox**: Prefer `SelectTrigger` with visible label; for icon‑only triggers, supply `aria-label`. Document examples in each app.
- **Tabs**: Use `TabsList`, `TabsTrigger`, `TabsContent`; names are programmatically determinable.
- **Toast/Toaster**: Prefer non‑blocking announcements; map critical to assertive region; include action buttons with clear labels.
- **Table**: Use `TableCaption`; ensure `TableHead` cells use proper `scope`. Provide `aria-sort` on sortable headers.
- **Utilities to add (repo action)**:
  - `SkipLink` component and pattern in layouts.
  - `RouteAnnouncer` (`aria-live="polite"`) and **FocusOnRouteChange** helper.
  - `VisuallyHidden` wrapper (Radix visually-hidden or minimal utility).
  - `useReducedMotion` helper; honor in animated components.
  - Touch‑size variants (≥44×44) for interactive atoms.

---

## 4) Engineering Requirements (Mobile — Expo/React Native)

- Set `accessibilityLabel`, `accessibilityHint`, and `accessibilityRole` on touchables.
- Ensure **hit slop** / min size **≥ 44×44 dp**.
- Support Dynamic Type / font scaling; no clipped text at **200%**.
- Respect **Invert Colors** and **Reduce Motion**; avoid flashing.
- Group related items with `accessibilityElements` ordering; hide decoration with `accessible={false}` or `importantForAccessibility="no-hide-descendants"` when appropriate.
- Test with **VoiceOver (iOS)** and **TalkBack (Android)**.

---

## 5) Component Patterns (Acceptance Rules)

**Buttons & Links**

- Use `<button>` for actions, `<a href>` for navigation. Provide disabled states that are perceivable beyond color.

**Navigation**

- Provide **Skip link**. One primary nav landmark. Indicate current page (`aria-current="page"`).

**Menus/Combobox/Autocomplete**

- Follow ARIA patterns: focus moves into list; `aria-expanded`, `aria-controls`, `aria-activedescendant` when applicable; Esc closes; typing filters.

**Modals/Dialogs**

- `role="dialog"` or `alertdialog` with **label**; focus trapped; background inert; Esc closes; return focus to trigger.

**Tabs**

- `role="tablist"`; tabs are in the tab order; arrow keys switch focus; content is `role="tabpanel"` with `aria-labelledby`.

**Toasts/Notifications**

- Non-critical: `aria-live="polite"`; critical: `role="alert"` sparingly.

**Infinite Scroll / “Load More”**

- Provide **Load more** control; announce new content to SR; preserve keyboard position.

**Drag & Drop (2.5.7)**

- Provide **non‑drag** alternative (e.g., move up/down buttons).

**Charts & Maps**

- Provide **table alternative** or textual summary; keyboard access to datapoints where interactive.

---

## 6) Testing & CI (Blocking Gates)

**Static & Unit**

- `eslint-plugin-jsx-a11y` — error on violations.
- `jest-axe` — unit tests for components.

**Automated Integration**

- `axe-core` via Playwright or Cypress on critical flows.
- `pa11y-ci` on key routes; threshold: **0 Critical / 0 Serious** to merge.
- Lighthouse CI a11y score **≥ 95** on target pages.

**Manual QA (per release)**

- **Keyboard patrol:** navigate primary flows without mouse.
- **Screen reader smoke:** NVDA (Windows) or VoiceOver (macOS/iOS) across login, navigation, forms, dialogs.
- **Zoom & Reflow:** 200–400% & 320 px width.
- **Color/Contrast check:** tokens in both themes.

**Reporting**

- A11y issues labeled: `a11y-blocker`, `a11y-bug`, `a11y-enhancement` with WCAG ref.

---

## 7) Repository‑Specific Adoption Plan

- Centralize UI usage on `packages/lssm/libs/ui-kit-web` and de‑duplicate per‑app `components/ui` where feasible.
- Introduce `SkipLink`, `RouteAnnouncer`, `FocusOnRouteChange`, and `VisuallyHidden` in `ui-kit-web`. Adopt in app layouts (`app/layout.tsx`) first.
- Add `useReducedMotion` and wire into animated components (e.g., `drawer`, `tooltip`, `carousel`).
- Add touch‑size variants to `Button`, `IconButton`, `TabsTrigger`, toggles.
- Document Select label patterns and error association in Forms.

---

## 8) Code Snippets

**Skip Link**

```html
<a
  class="sr-only focus:not-sr-only focus-visible:outline focus-visible:ring-4 focus-visible:ring-offset-2"
  href="#main"
  >Skip to main content</a
>
<main id="main">…</main>
```

**Dialog (Radix + shadcn/ui) — essentials**

```tsx
// Ensure label, description, focus trap, and return focus on close remain intact
<Dialog>
  <DialogTrigger asChild>
    <button aria-haspopup="dialog">Open settings</button>
  </DialogTrigger>
  <DialogContent aria-describedby="settings-desc">
    <DialogTitle>Settings</DialogTitle>
    <p id="settings-desc">Update your preferences.</p>
    <DialogClose asChild>
      <button>Close</button>
    </DialogClose>
  </DialogContent>
</Dialog>
```

**Form error association**

```tsx
<label htmlFor="email">Email</label>
<input id="email" name="email" type="email" aria-describedby="email-err" />
<p id="email-err" role="alert">Enter a valid email.</p>
```

**Route change announcement (Next.js)**

```tsx
// Add once at app root
<div
  aria-live="polite"
  aria-atomic="true"
  id="route-announcer"
  className="sr-only"
/>
```

---

## 9) Exceptions & Waivers

- If a criterion cannot be met, file an issue with: context, attempted alternatives, WCAG reference, impact assessment, and a remediation date. **Temporary waivers only.**

---

## 10) Ownership

- **Design:** maintains token contrast, component specs.
- **Engineering:** enforces CI gates, implements patterns.
- **QA:** runs manual checks per release.
- **PM:** blocks release if AA not met on user‑visible flows.

---

## 11) References (internalize; no external dependency at runtime)

- WCAG 2.2 (AA), EN 301 549. ARIA Authoring Practices. Platform HIG (Apple, Material).
- `packages/lssm/libs/ui-kit-web` as the canonical UI source for web.

> **Bottom line:** Shipping means **accessible by default**. We don’t trade a11y for speed; we bake it into speed.

---

## 12) Adoption Status (2025-09-23)

- web-artisan: AccessibilityProvider integrated; sr-only/forced-colors applied; 44x44 targets; forms announce errors; jest-axe and cypress-axe in place.
- web-strit: AccessibilityProvider integrated; forced-colors, sr-only; forms announce errors; 44x44 targets; contrast tokens and text-scale wired; jest-axe and cypress-axe in place.
- web-coliving: AccessibilityProvider integrated; forced-colors and focus visibility added; text-scale wired; landing pages converted to `Section`/stacks with text-lg defaults; CTA capture standardized; ESLint guard for text-xs in main content; jest-axe and cypress-axe in place. Next: audit icon-only controls and ensure 44x44 targets; add role="alert" where critical.

> CI gates: run eslint a11y, jest-axe on components, and cypress-axe on critical flows per app.

---

## 13) CI Hardening & Visual QA

- Linting: Run eslint with jsx-a11y rules across all web apps; block on violations.
- Unit: Run jest-axe for ui-kit-web and app-level components.
- Integration: cypress-axe on key flows (auth, forms, dialogs, tables).
- Synthetic scans: pa11y-ci on critical pages (0 Critical/Serious policy).
- Performance/A11y audit: Lighthouse CI with a11y score >= 95 on target routes.
- Artifacts: Upload pa11y and Lighthouse reports per PR; annotate failures.

### Recent additions (2025-09-26)

- AutocompleteInput (groceries): Upgraded to ARIA combobox pattern with `aria-controls`, `aria-activedescendant`, `Escape`/`Tab` handling, and labelled listbox.
- Cypress a11y tests added for furniture and incidents modules on `/modules` and operators flows; checks run axe with critical/serious impacts.

## 14) Accessibility Telemetry (PostHog)

- Events (anonymized): a11y_pref_changed (text_scale, contrast_mode, reduce_motion), a11y_panel_opened.
- Properties: app, route, previous_value, new_value, timestamp.
- Dashboards: Adoption over time, per app/route; correlation with reduced bounce on forms.
- Privacy: No PII; aggregate only.
