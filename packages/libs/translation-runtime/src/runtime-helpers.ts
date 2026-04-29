import type {
	Locale,
	TranslationSpec,
} from '@contractspec/lib.contracts-spec/translations';
import type { TranslationDiagnosticReporter } from './diagnostics';
import type { TranslateOptions, TranslationRuntimeConfig } from './runtime';
import type { TranslationRuntimeSnapshot } from './snapshot';

export function collectSpecKeys(specs: readonly TranslationSpec[]): string[] {
	return [...new Set(specs.map((spec) => spec.meta.key))];
}

export function buildFallbackChainForSpec({
	specs,
	specKey,
	baseChain,
	version,
}: {
	specs: readonly TranslationSpec[];
	specKey: string;
	baseChain: readonly Locale[];
	version?: string;
}): Locale[] {
	const chain = new Set<Locale>(baseChain);
	const matchingSpecs = specs.filter(
		(spec) =>
			spec.meta.key === specKey && (!version || spec.meta.version === version)
	);

	for (const locale of baseChain) {
		for (const spec of matchingSpecs) {
			if (spec.locale === locale) {
				addSpecFallbacks(chain, spec);
			}
		}
	}
	for (const spec of matchingSpecs) {
		addSpecFallbacks(chain, spec);
	}

	return [...chain];
}

function addSpecFallbacks(chain: Set<Locale>, spec: TranslationSpec): void {
	if (spec.fallback) chain.add(spec.fallback);
	for (const fallback of spec.fallbacks ?? []) {
		chain.add(fallback);
	}
	if (spec.defaultLocale) chain.add(spec.defaultLocale);
}

export function handleMissing(
	key: string,
	options: TranslateOptions | undefined,
	report: TranslationDiagnosticReporter
): string {
	report({
		code: 'missing_message',
		level: 'warning',
		message: `Missing translation for ${key}`,
		messageKey: key,
		locale: options?.locale,
	});

	if (options?.onMissing === 'throw') {
		throw new Error(`Missing translation for ${key}`);
	}
	if (options?.onMissing === 'empty') return '';
	return key;
}

export function runtimeConfigFromSnapshot(
	snapshot: TranslationRuntimeSnapshot
): TranslationRuntimeConfig {
	const baseConfig = {
		defaultLocale: snapshot.defaultLocale,
		requestedLocales: [snapshot.locale],
		supportedLocales: snapshot.supportedLocales,
		fallbackLocales: snapshot.fallbackChain,
	};
	if (!snapshot.sources?.length) {
		return { ...baseConfig, specs: snapshot.specs };
	}

	const sources = [...snapshot.sources].sort(
		(left, right) => left.sequence - right.sequence
	);
	return {
		...baseConfig,
		specs: sources
			.filter((source) => source.scope === 'base')
			.map((source) => source.spec),
		overrides: sources
			.filter((source) => source.scope !== 'base')
			.map((source) => ({
				scope: source.scope,
				source: source.source,
				priority: source.priority,
				specs: [source.spec],
			})),
	};
}
