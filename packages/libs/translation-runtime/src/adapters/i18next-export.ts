import type { TranslationSpec } from '@contractspec/lib.contracts-spec/translations';
import { getTextDirection } from '../direction';
import {
	buildSpecFallbackChain,
	canonicalLocale,
	deriveFallbackLng,
	namespaceForSpec,
	unique,
} from './i18next-helpers';
import type {
	ContractSpecI18nextDiagnostic,
	ContractSpecI18nextExport,
	ContractSpecI18nextExportOptions,
	ContractSpecI18nextMessageMetadataMap,
	ContractSpecI18nextNamespace,
	ContractSpecI18nextSourceSpec,
	I18nextResourceStore,
} from './i18next-types';

export function buildI18nextExport(
	sources: readonly ContractSpecI18nextSourceSpec[],
	options: ContractSpecI18nextExportOptions
): ContractSpecI18nextExport {
	const resources: I18nextResourceStore = {};
	const messages: ContractSpecI18nextMessageMetadataMap = {};
	const namespaceEntries: ContractSpecI18nextNamespace[] = [];
	const diagnostics: ContractSpecI18nextDiagnostic[] = [];
	const namespaceOwners = new Map<string, string>();

	for (const source of sources) {
		const { spec } = source;
		const locale = canonicalLocale(spec.locale, diagnostics, spec.meta.key);
		const defaultLocale =
			options.defaultLocale ?? spec.defaultLocale ?? spec.fallback ?? locale;
		const namespace = namespaceForSpec(spec, options.namespace);
		const syntax = spec.formatter?.syntax ?? 'icu';
		warnOnNamespaceCollision(namespaceOwners, namespace, spec, diagnostics);
		ensureResourceBuckets(resources, messages, locale, namespace);
		namespaceEntries.push({
			specKey: spec.meta.key,
			version: spec.meta.version,
			domain: spec.meta.domain,
			namespace,
			locale,
			direction: spec.direction ?? getTextDirection(locale),
			fallbackChain: buildSpecFallbackChain(spec, defaultLocale),
			syntax,
			owners: spec.meta.owners,
			tags: spec.meta.tags,
			source: source.source,
			scope: source.scope,
		});
		warnOnIcuExport(
			syntax,
			options,
			locale,
			namespace,
			spec.meta.key,
			diagnostics
		);
		copyMessages(resources, messages, locale, namespace, source, diagnostics);
	}

	return finalizeExport(
		resources,
		messages,
		namespaceEntries,
		options,
		diagnostics
	);
}

function warnOnNamespaceCollision(
	owners: Map<string, string>,
	namespace: string,
	spec: TranslationSpec,
	diagnostics: ContractSpecI18nextDiagnostic[]
): void {
	const previousOwner = owners.get(namespace);
	if (previousOwner && previousOwner !== spec.meta.key) {
		diagnostics.push({
			code: 'i18next_namespace_collision',
			level: 'warning',
			message: `Namespace ${namespace} is shared by ${previousOwner} and ${spec.meta.key}.`,
			namespace,
			specKey: spec.meta.key,
		});
	} else {
		owners.set(namespace, spec.meta.key);
	}
}

function warnOnIcuExport(
	syntax: 'plain' | 'icu',
	options: ContractSpecI18nextExportOptions,
	locale: string,
	namespace: string,
	specKey: string,
	diagnostics: ContractSpecI18nextDiagnostic[]
): void {
	if (syntax !== 'icu' || options.assumeIcuFormatter) return;
	diagnostics.push({
		code: 'i18next_icu_plugin_required',
		level: 'warning',
		message:
			'ContractSpec ICU message exported to i18next; use an ICU-capable i18next format plugin for runtime formatting parity.',
		locale,
		namespace,
		specKey,
	});
}

function ensureResourceBuckets(
	resources: I18nextResourceStore,
	messages: ContractSpecI18nextMessageMetadataMap,
	locale: string,
	namespace: string
): void {
	resources[locale] ??= {};
	resources[locale][namespace] ??= {};
	messages[locale] ??= {};
	messages[locale][namespace] ??= {};
}

function copyMessages(
	resources: I18nextResourceStore,
	messages: ContractSpecI18nextMessageMetadataMap,
	locale: string,
	namespace: string,
	source: ContractSpecI18nextSourceSpec,
	diagnostics: ContractSpecI18nextDiagnostic[]
): void {
	const { spec } = source;
	const resourceBucket = resources[locale]?.[namespace];
	const metadataBucket = messages[locale]?.[namespace];
	if (!resourceBucket || !metadataBucket) return;
	for (const [messageKey, message] of Object.entries(spec.messages)) {
		const existing = resourceBucket[messageKey];
		const existingMetadata = metadataBucket[messageKey];
		const existingDiffers =
			existing !== undefined &&
			(existing !== message.value ||
				existingMetadata?.version !== spec.meta.version ||
				existingMetadata?.source !== source.source ||
				existingMetadata?.scope !== source.scope);
		if (existingDiffers) {
			diagnostics.push({
				code: 'i18next_resource_collision',
				level: 'error',
				message: `Message ${messageKey} collides in ${locale}/${namespace}.`,
				locale,
				namespace,
				specKey: spec.meta.key,
				messageKey,
			});
			continue;
		}
		resourceBucket[messageKey] = message.value;
		metadataBucket[messageKey] = {
			specKey: spec.meta.key,
			version: spec.meta.version,
			locale,
			namespace,
			messageKey,
			description: message.description,
			context: message.context,
			placeholders: message.placeholders,
			variants: message.variants,
			maxLength: message.maxLength,
			tags: message.tags,
			pluralRules: spec.pluralRules,
			source: source.source,
			scope: source.scope,
		};
	}
}

function finalizeExport(
	resources: I18nextResourceStore,
	messages: ContractSpecI18nextMessageMetadataMap,
	namespaceEntries: ContractSpecI18nextNamespace[],
	options: ContractSpecI18nextExportOptions,
	diagnostics: ContractSpecI18nextDiagnostic[]
): ContractSpecI18nextExport {
	const locales = Object.keys(resources).sort();
	const ns = unique(namespaceEntries.map((entry) => entry.namespace)).sort();
	const fallbackLng = deriveFallbackLng(namespaceEntries, options, diagnostics);

	return {
		resources,
		manifest: {
			defaultLocale: options.defaultLocale
				? canonicalLocale(options.defaultLocale, diagnostics)
				: undefined,
			locales,
			namespaces: namespaceEntries,
			messages,
			diagnostics,
		},
		ns,
		lng: options.lng ? canonicalLocale(options.lng, diagnostics) : undefined,
		defaultNS: ns[0],
		fallbackLng,
	};
}
