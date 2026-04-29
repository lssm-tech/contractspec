import type {
	Locale,
	TranslationSpec,
} from '@contractspec/lib.contracts-spec/translations';
import type { TranslationDiagnostic } from './diagnostics';
import type { OverrideScope } from './overrides';

export interface TranslationRuntimeSnapshotSource {
	scope: OverrideScope;
	source: string;
	spec: TranslationSpec;
	priority: number;
	sequence: number;
}

export interface TranslationRuntimeSnapshot {
	locale: Locale;
	defaultLocale: Locale;
	fallbackChain: Locale[];
	supportedLocales: Locale[];
	specs: TranslationSpec[];
	sources?: TranslationRuntimeSnapshotSource[];
	diagnostics?: TranslationDiagnostic[];
}

export function serializeTranslationSnapshot(
	snapshot: TranslationRuntimeSnapshot
): string {
	return JSON.stringify(snapshot);
}

export function parseTranslationSnapshot(
	serialized: string
): TranslationRuntimeSnapshot {
	return JSON.parse(serialized) as TranslationRuntimeSnapshot;
}
