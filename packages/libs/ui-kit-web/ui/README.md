# UI Kit Web — Accessibility Helpers

Website: https://contractspec.io/


This package exposes a11y-first utilities and components built on Radix + shadcn.

## Utilities & Components

- `SkipLink`: renders a focus-visible skip link. Default target is `#main`.
- `VisuallyHidden`: hides content visually while keeping it accessible to screen readers.
- `SRLiveRegionProvider` and `useSRLiveRegion()`: announce messages to polite or assertive regions.
- `RouteAnnouncer`: polite live region that announces page titles on change (pass `title`).
- `FocusOnRouteChange`: focuses the first `h1`/`[data-page-title]`/`#main` on mount/update.
- `useReducedMotion`: boolean hook for `prefers-reduced-motion`.

## Patterns

- Wrap your app root with `SRLiveRegionProvider` and include `SkipLink` near the top of `body`.
- Give the main content container an id of `main`.
- On navigation, render `RouteAnnouncer` with the current page title and include `FocusOnRouteChange`.

```tsx
<SRLiveRegionProvider>
  <SkipLink targetId="main" />
  <RouteAnnouncer title={document.title} />
  <main id="main">
    <FocusOnRouteChange />
    {children}
  </main>
</SRLiveRegionProvider>
```

## Layout Primitives

- VStack/HStack (ui/stack): Flex stacks with CVA variants
  - Props: `gap` (none|xs|sm|md|lg|xl|2xl), `align`, `justify`, `wrap` (HStack)
- Section (ui/section): Page section with standardized container, padding, tone, and base text size (defaults to text-lg)
  - Variants: `width` (container|narrow|wide|fluid), `px` (none|sm|md|lg), `py` (none|sm|md|lg|xl), `tone` (plain|tint|subtle), `text` (lg|base)

Example:

```tsx
import { Section } from '@contractspec/lib.ui-kit-web/ui/section';
import { VStack, HStack } from '@contractspec/lib.ui-kit-web/ui/stack';

<Section tone="tint">
  <VStack gap="lg">
    <h1 className="text-4xl font-semibold">Title</h1>
    <p className="text-muted-foreground text-lg">Body copy…</p>
    <HStack gap="md">
      <Button size="lg">Primary</Button>
      <Button variant="secondary" size="lg">
        Secondary
      </Button>
    </HStack>
  </VStack>
</Section>;
```

## CTA Component

- `Cta` wraps `Button` with touch-size defaults and optional analytics capture
- Props: all `Button` props plus `{ ctaName?: string, capture?: (name: string) => void }`

```tsx
import { Cta } from '@contractspec/lib.ui-kit-web/ui/cta';

<Cta
  ctaName="hero_primary"
  capture={(name) => posthog.capture('cta_click', { cta: name })}
>
  Join now
</Cta>;
```
