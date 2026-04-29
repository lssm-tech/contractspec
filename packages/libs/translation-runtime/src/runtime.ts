import type {
	Locale,
	MessageKey,
	TranslationSpec,
} from '@contractspec/lib.contracts-spec/translations';
import {
	type TranslationDiagnostic,
	type TranslationDiagnosticReporter,
	TranslationDiagnosticsCollector,
} from './diagnostics';
import type { MessageFormatter, RuntimeValues } from './formatter';
import { createIntlMessageFormatter } from './formatters/intl-messageformat';
import type { TranslationBundleLoader } from './loader';
import { type LocaleNegotiationResult, negotiateLocale } from './locale';
import type { OverrideLayer } from './overrides';
import { RuntimeTranslationRegistry } from './registry';
import {
	buildFallbackChainForSpec,
	collectSpecKeys,
	handleMissing,
	runtimeConfigFromSnapshot,
} from './runtime-helpers';
import type { TranslationRuntimeSnapshot } from './snapshot';

export type ParamsFor<
	Key extends string,
	ParamsByKey extends RuntimeParamsMap,
> = Key extends keyof ParamsByKey ? ParamsByKey[Key] : RuntimeValues;

export type RuntimeParamsMap = Partial<Record<string, RuntimeValues>>;

export interface TranslateOptions {
	specKey?: string;
	locale?: Locale;
	fallbackLocales?: readonly Locale[];
	version?: string;
	onMissing?: 'key' | 'empty' | 'throw';
}

export interface TranslationRuntimeConfig {
	defaultLocale: Locale;
	requestedLocales?: readonly Locale[];
	supportedLocales?: readonly Locale[];
	fallbackLocales?: readonly Locale[];
	specs?: readonly TranslationSpec[];
	overrides?: readonly OverrideLayer[];
	formatter?: MessageFormatter;
	loaders?: readonly TranslationBundleLoader[];
	onDiagnostic?: TranslationDiagnosticReporter;
}

export interface TranslationRuntime<
	K extends string = string,
	ParamsByKey extends RuntimeParamsMap = RuntimeParamsMap,
> {
	readonly locale: Locale;
	readonly negotiation: LocaleNegotiationResult;
	t<Key extends K>(
		key: Key,
		values?: ParamsFor<Key, ParamsByKey>,
		options?: TranslateOptions
	): string;
	tUnknown(
		key: string,
		values?: RuntimeValues,
		options?: TranslateOptions
	): string;
	resolve(
		key: MessageKey,
		options?: TranslateOptions
	): ReturnType<RuntimeTranslationRegistry['resolve']>;
	load(specKey?: string, locales?: readonly Locale[]): Promise<void>;
	snapshot(): TranslationRuntimeSnapshot;
	diagnostics(): TranslationDiagnostic[];
}

export function createTranslationRuntime<
	K extends string = string,
	ParamsByKey extends RuntimeParamsMap = RuntimeParamsMap,
>(config: TranslationRuntimeConfig): TranslationRuntime<K, ParamsByKey> {
	const formatter = config.formatter ?? createIntlMessageFormatter();
	const registry = new RuntimeTranslationRegistry(config.specs ?? []);
	registry.addOverrideLayers(config.overrides ?? []);
	const diagnostics = new TranslationDiagnosticsCollector();
	const report = (diagnostic: TranslationDiagnostic) => {
		diagnostics.report(diagnostic);
		config.onDiagnostic?.(diagnostic);
	};
	const supportedLocales = config.supportedLocales?.length
		? config.supportedLocales
		: [
				...new Set([
					...registry.listLocales(),
					...(config.requestedLocales ?? []),
					config.defaultLocale,
				]),
			];
	const negotiation = negotiateLocale({
		requestedLocales: config.requestedLocales,
		supportedLocales,
		defaultLocale: config.defaultLocale,
		fallbackLocales: config.fallbackLocales,
	});

	const runtime: TranslationRuntime<K, ParamsByKey> = {
		locale: negotiation.locale,
		negotiation,

		t<Key extends K>(
			key: Key,
			values?: ParamsFor<Key, ParamsByKey>,
			options?: TranslateOptions
		): string {
			return runtime.tUnknown(key, values, options);
		},

		tUnknown(
			key: string,
			values?: RuntimeValues,
			options?: TranslateOptions
		): string {
			const resolved = runtime.resolve(key, options);
			if (!resolved) {
				return handleMissing(key, options, report);
			}

			if (resolved.fromFallback) {
				report({
					code: 'fallback_used',
					level: 'info',
					message: `Translation fell back to ${resolved.locale}`,
					specKey: resolved.spec.meta.key,
					messageKey: key,
					locale: options?.locale ?? negotiation.locale,
					fallbackLocale: resolved.locale,
				});
			}

			if (resolved.scope !== 'base') {
				report({
					code: 'override_used',
					level: 'info',
					message: `Translation override used from ${resolved.source}`,
					specKey: resolved.spec.meta.key,
					messageKey: key,
					locale: resolved.locale,
					source: resolved.source,
				});
			}

			try {
				return formatter
					.compile({
						id: `${resolved.spec.meta.key}.${key}`,
						locale: resolved.locale,
						message: resolved.message.value,
					})
					.format(values);
			} catch (error) {
				report({
					code: 'formatter_error',
					level: 'error',
					message: error instanceof Error ? error.message : 'Formatter error',
					specKey: resolved.spec.meta.key,
					messageKey: key,
					locale: resolved.locale,
				});
				if (options?.onMissing === 'throw') throw error;
				return key;
			}
		},

		resolve(key: MessageKey, options?: TranslateOptions) {
			const locale = options?.locale ?? negotiation.locale;
			const fallbackChain = [
				...new Set([
					locale,
					...(options?.fallbackLocales ?? []),
					...negotiation.fallbackChain,
				]),
			];

			const specKeys = options?.specKey
				? [options.specKey]
				: collectSpecKeys(registry.listSpecs());

			for (const specKey of specKeys) {
				const resolved = registry.resolve({
					specKey,
					messageKey: key,
					fallbackChain: buildFallbackChainForSpec({
						specs: registry.listSpecs(),
						specKey,
						baseChain: fallbackChain,
						version: options?.version,
					}),
					version: options?.version,
				});
				if (resolved) return resolved;
			}
			return undefined;
		},

		async load(specKey?: string, locales?: readonly Locale[]): Promise<void> {
			const targetLocales = locales ?? negotiation.fallbackChain;
			for (const loader of config.loaders ?? []) {
				try {
					const specs = await loader.load({ specKey, locales: targetLocales });
					registry.addSpecs(specs, { scope: 'base', source: 'loader' });
				} catch (error) {
					report({
						code: 'loader_error',
						level: 'error',
						message: error instanceof Error ? error.message : 'Loader failed',
						context: { specKey, locales: targetLocales },
					});
				}
			}
		},

		snapshot(): TranslationRuntimeSnapshot {
			return {
				locale: negotiation.locale,
				defaultLocale: negotiation.defaultLocale,
				fallbackChain: negotiation.fallbackChain,
				supportedLocales: negotiation.supportedLocales,
				specs: registry.listSpecs(),
				sources: registry.listSources(),
				diagnostics: diagnostics.list(),
			};
		},

		diagnostics(): TranslationDiagnostic[] {
			return diagnostics.list();
		},
	};

	return runtime;
}

export function createTranslationRuntimeFromSnapshot<
	K extends string = string,
	ParamsByKey extends RuntimeParamsMap = RuntimeParamsMap,
>(snapshot: TranslationRuntimeSnapshot): TranslationRuntime<K, ParamsByKey> {
	return createTranslationRuntime<K, ParamsByKey>(
		runtimeConfigFromSnapshot(snapshot)
	);
}
