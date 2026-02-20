# i18n Contributor Guide

How to add, modify, or extend internationalization in ContractSpec packages.

## Overview

ContractSpec uses its own i18n infrastructure from `@contractspec/lib.contracts-spec/translations`. No third-party i18n libraries (react-i18next, etc.) are used.

- **Target locales**: `en` (default), `fr`, `es`
- **Interpolation**: Simple `{key}` replacement (not ICU MessageFormat)
- **Registry**: `TranslationRegistry` + `defineTranslation()` from contracts-spec
- **Pattern**: Each package owns its own `src/i18n/` module

## File Structure

Every i18n-instrumented package follows this exact structure:

```
src/i18n/
  keys.ts          # Typed message key constants (I18N_KEYS, MessageKey type)
  locale.ts        # resolveLocale() + DEFAULT_LOCALE
  messages.ts      # createXxxI18n() factory + interpolate()
  catalogs/
    en.ts          # English catalog (reference)
    fr.ts          # French catalog
    es.ts          # Spanish catalog
    index.ts       # Re-exports all catalogs
  index.ts         # Public re-exports
  i18n.test.ts     # Completeness tests
```

## Adding a New Key

1. **Add the key to `keys.ts`** in the appropriate section:

```typescript
export const ERROR_KEYS = {
  'error.newThing': 'error.newThing',
} as const;
```

2. **Add the English value to `catalogs/en.ts`**:

```typescript
'error.newThing': {
  value: 'Something went wrong with {name}',
  description: 'Error when newThing fails',
  placeholders: [{ name: 'name', type: 'string' }],
},
```

3. **Add translations to `catalogs/fr.ts` and `catalogs/es.ts`** with the same key.

4. **Use it in code**:

```typescript
import { createXxxI18n } from '../i18n';
const i18n = createXxxI18n(locale);
throw new Error(i18n.t('error.newThing', { name: 'foo' }));
```

5. **Run `bun run i18n:check`** to verify key parity.

## Adding a New Locale

1. Create `catalogs/{locale}.ts` copying the structure from `en.ts`
2. Translate all values
3. Import and register in `messages.ts` (add to the `TranslationRegistry` constructor)
4. Export from `catalogs/index.ts`
5. Add to the `i18n:check` script if needed

## Adding i18n to a New Package

Follow the reference implementation at `packages/libs/content-gen/src/i18n/`.

1. Create the `src/i18n/` directory with all files listed above
2. The `defineTranslation()` call uses:
   - `meta.key`: `"<package-name>.messages"` (e.g., `"content-gen.messages"`)
   - `meta.domain`: package name (e.g., `"content-gen"`)
3. Add `@contractspec/lib.contracts-spec` as a dependency if not already present
4. Add 9 export paths to `package.json` (`exports` + `publishConfig.exports`):
   - `./i18n`, `./i18n/index`, `./i18n/keys`, `./i18n/locale`, `./i18n/messages`
   - `./i18n/catalogs`, `./i18n/catalogs/en`, `./i18n/catalogs/fr`, `./i18n/catalogs/es`
5. Create completeness tests verifying all keys exist in all catalogs

## What Gets i18n'd (Section 4.3 Rules)

| Content Type                            | Treatment                            |
| --------------------------------------- | ------------------------------------ |
| Error messages shown to users           | i18n key                             |
| AI/LLM prompts                          | Append locale parameter              |
| Schema/entity descriptions              | Defer (not i18n'd)                   |
| Internal errors (import failures, etc.) | Keep hardcoded or use default locale |
| Log messages                            | Optional (use i18n if user-visible)  |

## Conventions

- `placeholders` in `defineTranslation` uses array format: `[{ name: 'key', type: 'string' }]`
- Always add `locale?: string` to the package's main options interface
- The `interpolate()` function uses simple `{key}` replacement
- Factory functions follow the pattern: `createXxxI18n(specLocale?, runtimeLocale?)`
- Locale resolution priority: `runtimeLocale > specLocale > DEFAULT_LOCALE ("en")`

## CI Checks

- **Key parity**: `bun run i18n:check` verifies en/fr/es catalogs have matching keys across all 10 packages
- **ESLint**: `i18next/no-literal-string` is set to `warn` for i18n-instrumented packages (JSX text only)

## Currently Instrumented Packages (10)

| Package                     | Keys | Notes                                                     |
| --------------------------- | ---- | --------------------------------------------------------- |
| `libs/ai-agent`             | 135  | All 55 call sites locale-aware                            |
| `libs/content-gen`          | 55   | Reference implementation                                  |
| `libs/video-gen`            | 24   | Generators are the i18n boundary, not Remotion components |
| `libs/support-bot`          | 37   | Includes locale-keyed classifier keyword dictionaries     |
| `libs/knowledge`            | 14   | Access guard + query service + gmail adapter              |
| `libs/lifecycle`            | 74   | `getLocalizedStageMeta(locale)` for stage metadata        |
| `modules/lifecycle-core`    | 29   | Milestone catalog + orchestrator                          |
| `modules/lifecycle-advisor` | 79   | Playbooks + library map + recommendations                 |
| `modules/notifications`     | 7    | Template content via `localeChannels`, not i18n registry  |
| `modules/learning-journey`  | 6    | XP source labels via `getXpSourceLabel()`                 |
