import type {
	Locale,
	MessageVariant,
	PlaceholderDef,
	PluralRuleSet,
	TranslationSpec,
} from '@contractspec/lib.contracts-spec/translations';
import type { TextDirection } from '../direction';
import type { OverrideScope } from '../overrides';

export type I18nextResourceStore = Record<
	string,
	Record<string, Record<string, string>>
>;

export type ContractSpecI18nextNamespaceStrategy =
	| 'domain'
	| 'specKey'
	| ((spec: TranslationSpec) => string);

export type ContractSpecI18nextFallbackLng =
	| false
	| string
	| string[]
	| Record<string, string[]>;

export interface ContractSpecI18nextExportOptions {
	namespace?: ContractSpecI18nextNamespaceStrategy;
	defaultLocale?: Locale;
	lng?: Locale;
	fallbackLng?: ContractSpecI18nextFallbackLng;
	assumeIcuFormatter?: boolean;
	includeFallbackLng?: boolean;
}

export interface ContractSpecI18nextInitOptions {
	lng?: Locale;
	fallbackLng?: ContractSpecI18nextFallbackLng;
	partialBundledLanguages?: boolean;
	keySeparator?: false | string;
	defaultNS?: string;
}

export interface ContractSpecI18nextInstallOptions {
	deep?: boolean;
	overwrite?: boolean;
}

export interface I18nextResourceWriter {
	addResourceBundle(
		lng: string,
		ns: string,
		resources: Record<string, string>,
		deep?: boolean,
		overwrite?: boolean
	): unknown;
}

export interface ContractSpecI18nextNamespace {
	specKey: string;
	version: string;
	domain: string;
	namespace: string;
	locale: string;
	direction: TextDirection;
	fallbackChain: string[];
	syntax: 'plain' | 'icu';
	owners?: TranslationSpec['meta']['owners'];
	tags?: TranslationSpec['meta']['tags'];
	source?: string;
	scope?: OverrideScope;
}

export interface ContractSpecI18nextMessageMetadata {
	specKey: string;
	version: string;
	locale: string;
	namespace: string;
	messageKey: string;
	description?: string;
	context?: string;
	placeholders?: PlaceholderDef[];
	variants?: MessageVariant[];
	maxLength?: number;
	tags?: string[];
	pluralRules?: PluralRuleSet[];
	source?: string;
	scope?: OverrideScope;
}

export type ContractSpecI18nextMessageMetadataMap = Record<
	string,
	Record<string, Record<string, ContractSpecI18nextMessageMetadata>>
>;

export type ContractSpecI18nextDiagnosticCode =
	| 'i18next_fallback_projection_lossy'
	| 'i18next_icu_plugin_required'
	| 'i18next_invalid_locale'
	| 'i18next_metadata_omitted'
	| 'i18next_namespace_collision'
	| 'i18next_resource_collision';

export interface ContractSpecI18nextDiagnostic {
	code: ContractSpecI18nextDiagnosticCode;
	level: 'info' | 'warning' | 'error';
	message: string;
	locale?: string;
	namespace?: string;
	specKey?: string;
	messageKey?: string;
}

export interface ContractSpecI18nextManifest {
	defaultLocale?: string;
	locales: string[];
	namespaces: ContractSpecI18nextNamespace[];
	messages: ContractSpecI18nextMessageMetadataMap;
	diagnostics: ContractSpecI18nextDiagnostic[];
}

export interface ContractSpecI18nextExport {
	resources: I18nextResourceStore;
	manifest: ContractSpecI18nextManifest;
	ns: string[];
	lng?: string;
	defaultNS?: string;
	fallbackLng?: ContractSpecI18nextFallbackLng;
}

export interface ContractSpecI18nextInitOptionsResult {
	options: Record<string, unknown>;
	diagnostics: ContractSpecI18nextDiagnostic[];
}

export interface ContractSpecI18nextSourceSpec {
	spec: TranslationSpec;
	source?: string;
	scope?: OverrideScope;
}
