# @contractspec/lib.ui-kit-core

Website: https://contractspec.io/

**Core UI primitives and utilities.**

Provides the foundational `cn()` utility for merging Tailwind CSS classes, built on `clsx` and `tailwind-merge`. Used as the base layer for all ContractSpec UI packages.

## Installation

```bash
bun add @contractspec/lib.ui-kit-core
```

## Exports

- `.` -- Re-exports `./utils`
- `./utils` -- `cn()` class merging utility

## Usage

```tsx
import { cn } from "@contractspec/lib.ui-kit-core/utils";

function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn("rounded-md bg-blue-600 px-4 py-2 text-white", className)}
      {...props}
    />
  );
}
```
