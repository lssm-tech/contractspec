# @contractspec/lib.ui-kit-web

Website: https://contractspec.io/


Web-specific UI components and primitives for Next.js/React applications, built on top of Radix UI and Tailwind CSS.

## Purpose

To provide a comprehensive set of accessible, high-performance UI components specifically optimized for the modern web. While `@contractspec/lib.ui-kit` focuses on universal (native + web) compatibility, this library leverages web-only capabilities like portals, heavy data tables, and mapping libraries.

## Installation

```bash
npm install @contractspec/lib.ui-kit-web
# or
bun add @contractspec/lib.ui-kit-web
```

## Key Concepts

- **Radix UI Primitives**: Most components are unstyled accessible wrappers around Radix UI.
- **Shadcn UI Compatible**: Structure and styling closely follow the popular shadcn/ui patterns, making it easy to adopt and extend.
- **Web Optimizations**: Includes `SkipLink`, `VisuallyHidden`, and `LiveRegion` for WCAG compliance.
- **Mapping**: Integrated `maplibre-gl` components for geo-spatial visualizations.

## Exports

### Core UI

- Standard Radix wrappers: `accordion`, `dialog`, `dropdown-menu`, `popover`, `tabs`, etc.
- Forms: `input`, `select`, `checkbox`, `switch`, `slider`, `radio-group`.
- Feedback: `toast`, `alert`, `progress`, `skeleton`.

### Web Specifics

- `ui/map/*`: `MapBase`, `MapGeoJsonOverlay`, `MapHeatmapH3`, `MapMarkers`.
- `ui/resizable`: Resizable panel layouts.
- `ui/scroll-area`: Custom cross-browser scrollbars.
- `ui/sonner`: High-performance toast notifications.

### Accessibility

- `ui/skip-link`: For keyboard navigation users.
- `ui/visually-hidden`: For screen-reader only content.
- `ui/live-region`: Announce dynamic changes.
- `ui/route-announcer`: Announce page changes in SPAs.

## Usage

```tsx
import { Button } from '@contractspec/lib.ui-kit-web/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@contractspec/lib.ui-kit-web/ui/dialog';
import { Input } from '@contractspec/lib.ui-kit-web/ui/input';

export function LoginModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4 py-4">
          <Input id="email" placeholder="Email" />
          <Button type="submit">Sign in</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```


































