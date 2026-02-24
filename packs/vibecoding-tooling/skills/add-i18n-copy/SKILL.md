---
name: add-i18n-copy
description: 'Scaffold a new i18n copy file following established translation patterns'
targets: ['*']
claudecode:
  allowed-tools:
    - 'Bash'
    - 'Read'
    - 'Write'
    - 'Edit'
    - 'Glob'
    - 'Grep'
---

# Add i18n Copy Skill

This skill scaffolds new i18n copy files following the project's established `Record<AppLocale, CopyType>` + getter pattern.

## Usage

Invoke when:

- A new feature needs user-facing strings translated
- Existing hardcoded strings need to be extracted into a copy file
- A new domain/module requires its own copy file

## Process

### Step 1: Gather Requirements

Ask for:

- **Feature/domain name** (kebab-case, e.g., `billing`, `focus-card`, `user-profile`)
- **Copy shape**: What strings are needed? List them with descriptions.
  - Example: `title`, `description`, `emptyState`, `errorMessage`, `submitButton`
- **Pattern**: Single file or per-locale split? (Single for <250 lines, split for larger copy sets)
- **Location**: Where should the copy file live?
  - Shared/cross-feature: `packages/libs/contracts-contractspec-studio/src/i18n/`
  - Marketing page: co-located with the page
  - Bundle-specific: in the bundle

### Step 2: Determine Copy Pattern

Based on the number of strings and their expected length:

| Strings count                | Pattern                                         |
| ---------------------------- | ----------------------------------------------- |
| 1-20 short strings           | Single file (`<feature>-copy.ts`)               |
| 20+ strings or long content  | Per-locale split (`<feature>-copy.en.ts`, etc.) |
| Marketing page with sections | Per-locale split with shared types file         |

### Step 3: Read Existing Patterns

Before generating, read 1-2 existing copy files to match the exact coding style:

- Check import style for `AppLocale` type
- Check how existing getters handle the fallback
- Check naming conventions for the current domain

### Step 4: Generate Single-File Copy

For smaller copy sets, generate a single file:

```typescript
/**
 * i18n copy for <Feature>.
 *
 * @module i18n/<feature>-copy
 */

import type { AppLocale } from "./types";

export interface <Feature>Copy {
  title: string;
  description: string;
  emptyState: string;
  errorMessage: string;
  // ... all fields with JSDoc if non-obvious
}

const <FEATURE>_COPY: Record<AppLocale, <Feature>Copy> = {
  en: {
    title: "Feature Title",
    description: "Feature description goes here.",
    emptyState: "No items yet.",
    errorMessage: "Failed to load feature.",
  },
  fr: {
    title: "Titre de la fonctionnalite",
    description: "La description de la fonctionnalite.",
    emptyState: "Aucun element pour le moment.",
    errorMessage: "Echec du chargement de la fonctionnalite.",
  },
  es: {
    title: "Titulo de la funcionalidad",
    description: "La descripcion de la funcionalidad.",
    emptyState: "No hay elementos todavia.",
    errorMessage: "Error al cargar la funcionalidad.",
  },
};

export function get<Feature>Copy(locale: AppLocale): <Feature>Copy {
  return <FEATURE>_COPY[locale] ?? <FEATURE>_COPY.en;
}
```

### Step 5: Generate Per-Locale Split (if needed)

For larger copy sets:

**Types file** (`<feature>-copy.types.ts`):

```typescript
export interface <Feature>Copy {
  hero: { title: string; subtitle: string; cta: string };
  features: { title: string; items: { name: string; description: string }[] };
  // ... structured shape
}
```

**Per-locale files** (`<feature>-copy.en.ts`, etc.):

```typescript
import type { <Feature>Copy } from "./<feature>-copy.types";

export const <FEATURE>_COPY_EN: <Feature>Copy = {
  hero: { title: "...", subtitle: "...", cta: "..." },
  features: { title: "...", items: [...] },
};
```

**Assembler** (`<feature>-copy.ts`):

```typescript
import type { AppLocale } from "../types";
import type { <Feature>Copy } from "./<feature>-copy.types";
import { <FEATURE>_COPY_EN } from "./<feature>-copy.en";
import { <FEATURE>_COPY_FR } from "./<feature>-copy.fr";
import { <FEATURE>_COPY_ES } from "./<feature>-copy.es";

export type { <Feature>Copy } from "./<feature>-copy.types";

const <FEATURE>_COPY = {
  en: <FEATURE>_COPY_EN,
  fr: <FEATURE>_COPY_FR,
  es: <FEATURE>_COPY_ES,
} as const satisfies Record<AppLocale, <Feature>Copy>;

export function get<Feature>Copy(locale: AppLocale): <Feature>Copy {
  return <FEATURE>_COPY[locale] ?? <FEATURE>_COPY.en;
}
```

### Step 6: Add Barrel Exports

Add exports to `packages/libs/contracts-contractspec-studio/src/i18n/index.ts`:

```typescript
// <Feature> Copy
export { get<Feature>Copy } from "./<feature>-copy";
export type { <Feature>Copy } from "./<feature>-copy";
```

### Step 7: Generate Consumer Stub

Show how to use the new copy in a component:

```tsx
import { get<Feature>Copy } from "@contractspec/lib.contracts-contractspec-studio";
import { useAppI18n } from "../hooks/use-app-i18n";

export const <Feature> = () => {
  const { locale } = useAppI18n();
  const copy = get<Feature>Copy(locale);

  return (
    <div>
      <Heading>{copy.title}</Heading>
      <Text>{copy.description}</Text>
    </div>
  );
};
```

### Step 8: Verify

- [ ] TypeScript compiles (`turbo build:types`)
- [ ] All 3 locales populated (en, fr, es)
- [ ] Getter function has English fallback (`?? COPY.en`)
- [ ] Copy typed with explicit interface
- [ ] Barrel export added to `index.ts`
- [ ] File under 250 lines (split if needed)
- [ ] No hardcoded strings remain in consuming component

## Output

After completion, report:

- **Files created**: List of new copy files
- **Interface**: The copy shape with field names
- **Locales**: Coverage status per locale
- **Exports**: Barrel export additions
- **Consumer example**: How to use in a component
- **Next steps**: Any translations that need human review (especially FR/ES)
