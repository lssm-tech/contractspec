# @contractspec/lib.accessibility

Website: https://contractspec.io/


Stable exports of accessibility primitives for LSSM web apps, ensuring WCAG compliance and inclusive design.

## Purpose

To provide a standardized set of accessibility components and hooks that handle focus management, screen reader announcements, and motion preferences across Next.js and React applications.

## Installation

```bash
npm install @contractspec/lib.accessibility
# or
bun add @contractspec/lib.accessibility
```

## Key Concepts

- **Focus Management**: Automatically handle focus transitions on route changes.
- **Live Regions**: reliably announce dynamic content updates to screen readers.
- **Reduced Motion**: Respect user system preferences for animation.
- **Hidden Content**: Visually hide content while keeping it available for assistive technology.

## Exports

- `SkipLink`: A link to skip navigation, visible on focus.
- `VisuallyHidden`: Component to hide content from sighted users but keep it for screen readers.
- `SRLiveRegionProvider`, `useSRLiveRegion`: Context and hook for managing live region announcements.
- `RouteAnnouncer`: Component that announces page title/path changes on navigation.
- `FocusOnRouteChange`: Component that resets focus to body or main content on navigation.
- `useReducedMotion`: Hook to detect if the user prefers reduced motion.

## Usage

### App Setup

Wrap your application (e.g., in `layout.tsx` or `_app.tsx`) with the necessary providers and components:

```tsx
import {
  SRLiveRegionProvider,
  RouteAnnouncer,
  SkipLink,
} from '@contractspec/lib.accessibility';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SRLiveRegionProvider>
          <SkipLink />
          <RouteAnnouncer />
          <main id="main-content">{children}</main>
        </SRLiveRegionProvider>
      </body>
    </html>
  );
}
```

### Announcing Dynamic Changes

```tsx
import { useSRLiveRegion } from '@contractspec/lib.accessibility';

export function TodoList() {
  const { announce } = useSRLiveRegion();

  const addTodo = () => {
    // ... add logic
    announce('Todo added successfully', 'polite');
  };

  return <button onClick={addTodo}>Add Todo</button>;
}
```
