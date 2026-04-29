# @contractspec/lib.translation-runtime

Framework-independent runtime for ContractSpec translation contracts.

`@contractspec/lib.contracts-spec` remains the canonical source of truth for `TranslationSpec` contracts, metadata, ownership, versions, locale variants, validation, fallback declarations, and override policy. This package consumes those specs at runtime to resolve, format, cache, load, diagnose, and serialize translations across server code, React, React Native, CLIs, and tests.

## Boundaries

- **Spec layer:** `@contractspec/lib.contracts-spec/translations`
- **Runtime layer:** this package
- **Formatter engine:** `MessageFormatter`, with `createIntlMessageFormatter()` backed by FormatJS/`intl-messageformat`
- **Adapters:** React/design-system/i18next integrations consume this runtime and are optional downstream layers

## Example

```ts
import { createTranslationRuntime } from "@contractspec/lib.translation-runtime";
import { enMessages, frMessages } from "./catalogs";

const runtime = createTranslationRuntime({
  defaultLocale: "en-US",
  requestedLocales: ["fr-FR", "en-US"],
  specs: [enMessages, frMessages],
});

runtime.t("cart.itemCount", { count: 3 });
```

## SSR and hydration

Create a runtime per request. Preload the catalogs needed by the server render, serialize `runtime.snapshot()`, and hydrate the client from `createTranslationRuntimeFromSnapshot(snapshot)`. Do not renegotiate locale during the first client render.

## React Native

The core runtime uses no DOM APIs. Locale detection is host-owned; pass device or user locales into `requestedLocales`. Ensure the host JS engine provides the required `Intl` APIs or install platform polyfills before using the default formatter.
