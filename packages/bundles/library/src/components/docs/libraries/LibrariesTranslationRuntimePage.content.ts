export const translationRuntimeInstall = [
	'@contractspec/lib.contracts-spec',
	'@contractspec/lib.translation-runtime',
];

export const translationRuntimeExample = `import { createTranslationRuntime } from '@contractspec/lib.translation-runtime';
import { checkoutMessages } from './translations/checkout.messages';

const runtime = createTranslationRuntime({
  catalogs: [checkoutMessages],
  locale: 'fr-FR',
  fallbackLocales: ['fr', 'en-US'],
  onDiagnostic: (diagnostic) => reportTranslationIssue(diagnostic),
});

const label = runtime.t('checkout.pay', {
  amount: 4200,
  currency: 'EUR',
});`;

export const i18nextAdapterExample = `import { createInstance } from 'i18next';
import {
  createI18nextInitOptions,
  exportContractSpecToI18next,
} from '@contractspec/lib.translation-runtime/i18next';

const exported = exportContractSpecToI18next([checkoutMessages], {
  locale: 'en-US',
  assumeIcuFormatter: true,
});
const { options, diagnostics } = createI18nextInitOptions(exported, {
  lng: 'en-US',
});

const i18next = createInstance();
await i18next.init(options);
reportAdapterDiagnostics(diagnostics);`;

export const ssrHydrationExample = `// Server: negotiate once, preload catalogs, and serialize the runtime snapshot.
const runtime = createTranslationRuntime({
  catalogs,
  locale: negotiatedLocale,
  fallbackLocales,
});
const snapshot = runtime.createSnapshot();

// Client: hydrate from the same snapshot so locale, resources, and fallback state match.
const hydratedRuntime = createTranslationRuntime({ snapshot });`;

export const translationRuntimeChecks = [
	'Keep TranslationSpec as the source of truth; do not flatten metadata into i18next JSON as the canonical model.',
	'Keep stable bundle identity in TranslationSpec.meta.key and keep BCP 47 language tags in TranslationSpec.locale.',
	'Use ICU messages for plural, select, selectordinal, number, date, currency, list, and relative-time formatting.',
	'Create one runtime per SSR request when tenant, project, or user overrides are involved.',
	'Serialize the same runtime snapshot or exported adapter resources used by the server for hydration.',
	'Configure an ICU-capable i18next formatter plugin when rendering ContractSpec ICU messages through i18next.',
	'Treat adapter diagnostics as release blockers in production pipelines instead of silently rendering raw keys.',
];

export const translationRuntimePrompt = `You are integrating ContractSpec translations into a production app.
Use @contractspec/lib.contracts-spec/translations as the canonical contract layer and @contractspec/lib.translation-runtime as the runtime layer.
Keep locale variants separate from stable bundle keys, support BCP 47 tags, preserve ICU plural/select/selectordinal messages, and use request-scoped runtime instances for SSR.
If the app already uses i18next, use @contractspec/lib.translation-runtime/i18next only as a downstream adapter. Do not make i18next the canonical translation model. Include diagnostics, fallback behavior, tenant/user override isolation, and hydration snapshot handling in the implementation and tests.`;

export const translationRuntimeLayers = [
	{
		title: 'Spec layer',
		body: 'TranslationSpec owns keys, locales, domains, versions, owners, fallback declarations, direction, and validation metadata.',
	},
	{
		title: 'Runtime layer',
		body: 'Runtime instances negotiate locales, apply fallback chains, resolve overrides, cache compiled messages, report diagnostics, and serialize SSR snapshots.',
	},
	{
		title: 'Adapter layer',
		body: 'The i18next adapter projects ContractSpec specs or snapshots to resources and manifests for caller-owned i18next instances.',
	},
];
