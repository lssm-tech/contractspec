import type { TranslationSpec } from '@contractspec/lib.contracts-spec/translations';
import type { TranslationRuntimeSnapshot } from '../snapshot';
import { buildI18nextExport } from './i18next-export';
import { hasIncompatibleFallbackChains } from './i18next-helpers';
import type {
	ContractSpecI18nextDiagnostic,
	ContractSpecI18nextExport,
	ContractSpecI18nextExportOptions,
	ContractSpecI18nextInitOptions,
	ContractSpecI18nextInitOptionsResult,
	ContractSpecI18nextInstallOptions,
	I18nextResourceWriter,
} from './i18next-types';

export type * from './i18next-types';

export function exportContractSpecToI18next(
	specs: readonly TranslationSpec[],
	options: ContractSpecI18nextExportOptions = {}
): ContractSpecI18nextExport {
	return buildI18nextExport(
		specs.map((spec) => ({ spec })),
		options
	);
}

export function exportTranslationSnapshotToI18next(
	snapshot: TranslationRuntimeSnapshot,
	options: ContractSpecI18nextExportOptions = {}
): ContractSpecI18nextExport {
	const sources = snapshot.sources?.length
		? snapshot.sources.map(({ scope, source, spec }) => ({
				scope,
				source,
				spec,
			}))
		: snapshot.specs.map((spec) => ({ spec }));
	return buildI18nextExport(sources, {
		defaultLocale: snapshot.defaultLocale,
		lng: snapshot.locale,
		fallbackLng: snapshot.fallbackChain,
		...options,
	});
}

export function createI18nextInitOptions(
	exported: ContractSpecI18nextExport,
	options: ContractSpecI18nextInitOptions = {}
): ContractSpecI18nextInitOptionsResult {
	const diagnostics: ContractSpecI18nextDiagnostic[] = [];
	const fallbackLng = options.fallbackLng ?? exported.fallbackLng;
	if (
		!fallbackLng &&
		hasIncompatibleFallbackChains(exported.manifest.namespaces)
	) {
		diagnostics.push({
			code: 'i18next_fallback_projection_lossy',
			level: 'warning',
			message:
				'ContractSpec has per-bundle fallback chains that cannot be represented as one i18next fallbackLng value.',
		});
	}

	const initOptions: Record<string, unknown> = {
		resources: exported.resources,
		ns: exported.ns,
		keySeparator: options.keySeparator ?? false,
	};
	const defaultNS = options.defaultNS ?? exported.defaultNS;
	if (defaultNS) initOptions.defaultNS = defaultNS;
	const lng = options.lng ?? exported.lng ?? exported.manifest.defaultLocale;
	if (lng) initOptions.lng = lng;
	if (fallbackLng) initOptions.fallbackLng = fallbackLng;
	if (options.partialBundledLanguages !== undefined) {
		initOptions.partialBundledLanguages = options.partialBundledLanguages;
	}

	return { options: initOptions, diagnostics };
}

export function addContractSpecResourceBundles(
	instance: I18nextResourceWriter,
	exported: ContractSpecI18nextExport,
	options: ContractSpecI18nextInstallOptions = {}
): void {
	const deep = options.deep ?? true;
	const overwrite = options.overwrite ?? true;
	for (const [locale, namespaces] of Object.entries(exported.resources)) {
		for (const [namespace, resources] of Object.entries(namespaces)) {
			instance.addResourceBundle(locale, namespace, resources, deep, overwrite);
		}
	}
}
