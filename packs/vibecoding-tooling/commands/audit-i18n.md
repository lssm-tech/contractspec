---
description: 'Audit codebase for i18n compliance, missing translations, and hardcoded strings'
targets: ['*']
---

scope = $ARGUMENTS

Run an i18n compliance audit to identify translation gaps, hardcoded strings, and pattern violations:

1. **Determine scope**:
   - If `scope` provided: restrict scan to that directory
   - If empty: scan `packages/apps/` (UI code) and `packages/libs/contracts-contractspec-studio/src/i18n/` (translations)

2. **Scan for missing translations**:
   - Read `packages/libs/contracts-contractspec-studio/src/i18n/messages.ts`
   - Compare keys present in `appMessagesEn` vs `appMessagesFr` vs `appMessagesEs`
   - Flag keys that exist in English but are missing from French or Spanish
   - Report total coverage percentage per locale

3. **Scan for incomplete copy files**:
   - Find all `*-copy.ts` files in `packages/libs/contracts-contractspec-studio/src/i18n/`
   - For each file, check that `Record<AppLocale, ...>` constants include all 3 locales (`en`, `fr`, `es`)
   - Flag copy constants using `Record<string, ...>` instead of `Record<AppLocale, ...>`
   - Check that every copy constant has a corresponding `get*Copy(locale)` getter function with English fallback

4. **Scan for hardcoded strings**:
   - Scan `.tsx` files in:
     - `packages/apps/web-application/src/app/(app)/`
     - `packages/apps/web-application/src/app/(auth)/`
     - `packages/apps/web-marketing/src/app/`
     - `packages/bundles/*/src/presentation/`
   - Detect literal English strings in JSX text content (between `>` and `<`)
   - Detect literal strings in common props: `title=`, `placeholder=`, `label=`, `message=`, `description=`
   - Exclude: `className`, `data-*`, `aria-*`, `id`, `href`, `src`, `role`, `key`, `type`, `name` attributes
   - Exclude: single characters, numbers, punctuation, technical strings

5. **Scan for pattern violations**:
   - Copy files without a TypeScript interface for the copy shape
   - Copy getter functions missing the `?? COPY.en` fallback pattern
   - Copy getters not exported from `packages/libs/contracts-contractspec-studio/src/i18n/index.ts`
   - Components importing translations directly instead of using `useAppI18n()` or `getCopy(locale)`

6. **Scan for locale resolution issues**:
   - Check that `useAppI18n()` or `useMarketingI18n()` is used (not raw `document.documentElement.lang`)
   - Verify no raw string comparisons against locale values (`if (locale === 'fr')`)

7. **Generate report**:

```
## i18n Audit Report

**Scope**: [scanned path]
**Overall compliance**: [X]% ([translated]/[total] strings covered)

### Translation Coverage (Key-Based)

| Locale | Keys present | Keys missing | Coverage |
|--------|-------------|-------------|----------|
| en     | [count]     | 0           | 100%     |
| fr     | [count]     | [count]     | [X]%     |
| es     | [count]     | [count]     | [X]%     |

**Missing keys (fr)**: [list with key names]
**Missing keys (es)**: [list with key names]

### Copy File Compliance

| Status | File | Issue |
|--------|------|-------|
| INCOMPLETE | [file] | Missing `es` locale entry |
| UNTYPED | [file] | Uses Record<string, ...> instead of Record<AppLocale, ...> |
| NO_FALLBACK | [file] | Getter function missing ?? COPY.en fallback |
| NOT_EXPORTED | [file] | Getter not re-exported from index.ts |
| OK | [file] | Fully compliant |

### Hardcoded Strings

| Severity | File | Line | String | Suggestion |
|----------|------|------|--------|------------|
| HIGH | [file] | [line] | "Save changes" | Use t(APP_MESSAGE_KEYS.SAVE) |
| HIGH | [file] | [line] | "Something went wrong" | Add to feature copy file |
| MEDIUM | [file] | [line] | "Loading..." | Use t(APP_MESSAGE_KEYS.LOADING) |

**Total hardcoded strings**: [count] in [count] files

### Pattern Violations

| File | Issue | Fix |
|------|-------|-----|
| [file] | Copy not typed with interface | Add TypeScript interface |
| [file] | Direct locale string comparison | Use isAppLocale() or getCopy() |

### Remediation Priority
1. [Highest impact: e.g., "Add missing FR/ES translations for 12 keys"]
2. [Next: e.g., "Extract hardcoded strings in auth pages to copy files"]
3. [Next: e.g., "Fix 3 copy files missing es locale"]
4. ...

### Suggested Commands
- Use the `add-i18n-copy` skill to scaffold new copy files
- Run `/fix` to auto-fix lint issues after adding translations
- Run `/audit-i18n [path]` on specific directories for focused checks
```
