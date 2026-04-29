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

## Optional i18next adapter

i18next is an optional downstream adapter, not the canonical ContractSpec model. Import it through the dedicated subpath so core runtime consumers do not load i18next:

```ts
import { createInstance } from "i18next";
import {
  createI18nextInitOptions,
  exportTranslationSnapshotToI18next,
} from "@contractspec/lib.translation-runtime/i18next";

const exported = exportTranslationSnapshotToI18next(runtime.snapshot(), {
  assumeIcuFormatter: true,
});
const { options, diagnostics } = createI18nextInitOptions(exported);
const i18next = createInstance();

await i18next.init(options);
```

The adapter exports resources as `{ [locale]: { [namespace]: { [messageKey]: string } } }`. `TranslationSpec.locale` becomes the i18next language, while the namespace defaults to the stable `TranslationSpec.meta.key`. Flat ContractSpec keys such as `"cart.items"` remain flat because generated init options set `keySeparator: false`.

ContractSpec ICU messages are exported intact. i18next does not use ICU as its default JSON format, so apps that call `i18next.t()` for ICU plural/select/selectordinal messages must install and configure an ICU-capable i18next format plugin such as `i18next-icu`. The adapter reports `i18next_icu_plugin_required` unless you explicitly acknowledge that formatting layer.

For SSR, export from the same runtime snapshot used by the server render and reuse those resources/options on the client. Do not let client-only language detection renegotiate the first hydrated render. For React Native, pass the host-selected locale explicitly; the adapter does not use DOM APIs or browser storage.

## React Native

The core runtime uses no DOM APIs. Locale detection is host-owned; pass device or user locales into `requestedLocales`. Ensure the host JS engine provides the required `Intl` APIs or install platform polyfills before using the default formatter.
