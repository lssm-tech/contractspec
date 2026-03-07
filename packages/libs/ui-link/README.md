# @contractspec/lib.ui-link

Website: https://contractspec.io/

**Deep linking utilities for navigation.**

Provides a styled React `Link` component wrapping the native `<a>` element with `cn()` class merging from `@contractspec/lib.ui-kit-core`.

## Installation

```bash
bun add @contractspec/lib.ui-link
```

## Exports

- `.` -- Default `Link` component
- `./ui/link` -- Same `Link` component (explicit subpath)

## Usage

```tsx
import Link from "@contractspec/lib.ui-link";

function Nav() {
  return (
    <nav>
      <Link href="/docs" className="text-blue-600 hover:underline">
        Documentation
      </Link>
      <Link href="/studio">
        Studio
      </Link>
    </nav>
  );
}
```
