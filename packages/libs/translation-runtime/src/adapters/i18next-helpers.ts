import type { TranslationSpec } from '@contractspec/lib.contracts-spec/translations';
import { buildLocaleFallbackChain, canonicalizeLocale } from '../locale';
import type {
	ContractSpecI18nextDiagnostic,
	ContractSpecI18nextExportOptions,
	ContractSpecI18nextFallbackLng,
	ContractSpecI18nextNamespace,
	ContractSpecI18nextNamespaceStrategy,
} from './i18next-types';

export function namespaceForSpec(
	spec: TranslationSpec,
	strategy: ContractSpecI18nextNamespaceStrategy = 'specKey'
): string {
	if (typeof strategy === 'function') return strategy(spec);
	return strategy === 'domain' ? spec.meta.domain : spec.meta.key;
}

export function buildSpecFallbackChain(
	spec: TranslationSpec,
	defaultLocale: string
): string[] {
	const explicitFallbacks =
		spec.fallbacks ?? (spec.fallback ? [spec.fallback] : []);
	return buildLocaleFallbackChain(
		spec.locale,
		defaultLocale,
		explicitFallbacks
	);
}

export function canonicalLocale(
	locale: string,
	diagnostics: ContractSpecI18nextDiagnostic[],
	specKey?: string
): string {
	const result = canonicalizeLocale(locale);
	if (result.locale) return result.locale;
	diagnostics.push({
		code: 'i18next_invalid_locale',
		level: 'warning',
		message: result.error ?? `Invalid locale ${locale}`,
		locale,
		specKey,
	});
	return locale;
}

export function deriveFallbackLng(
	namespaces: readonly ContractSpecI18nextNamespace[],
	options: ContractSpecI18nextExportOptions,
	diagnostics: ContractSpecI18nextDiagnostic[]
): ContractSpecI18nextFallbackLng | undefined {
	if (options.fallbackLng !== undefined) return options.fallbackLng;
	if (options.includeFallbackLng === false) return undefined;
	if (!namespaces.length) return undefined;

	const chainsByLocale = new Map<string, string[]>();
	for (const entry of namespaces) {
		const fallbackOnly = entry.fallbackChain.filter(
			(candidate) => candidate !== entry.locale
		);
		const existing = chainsByLocale.get(entry.locale);
		if (existing && existing.join('\u0000') !== fallbackOnly.join('\u0000')) {
			diagnostics.push({
				code: 'i18next_fallback_projection_lossy',
				level: 'warning',
				message: `Multiple fallback chains exist for locale ${entry.locale}; keeping authoritative chains in the ContractSpec manifest.`,
				locale: entry.locale,
				namespace: entry.namespace,
				specKey: entry.specKey,
			});
			return undefined;
		}
		chainsByLocale.set(entry.locale, fallbackOnly);
	}

	const fallbackMap = Object.fromEntries(
		[...chainsByLocale.entries()].filter(([, chain]) => chain.length > 0)
	);
	if (!Object.keys(fallbackMap).length) return undefined;
	return fallbackMap;
}

export function hasIncompatibleFallbackChains(
	namespaces: readonly ContractSpecI18nextNamespace[]
): boolean {
	const chainsByLocale = new Map<string, string>();
	for (const entry of namespaces) {
		const fallbackOnly = entry.fallbackChain
			.filter((candidate) => candidate !== entry.locale)
			.join('\u0000');
		const existing = chainsByLocale.get(entry.locale);
		if (existing && existing !== fallbackOnly) return true;
		chainsByLocale.set(entry.locale, fallbackOnly);
	}
	return false;
}

export function unique(values: readonly string[]): string[] {
	return [...new Set(values)];
}
