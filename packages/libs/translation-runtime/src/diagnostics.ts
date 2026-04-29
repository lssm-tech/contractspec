import type {
	Locale,
	MessageKey,
} from '@contractspec/lib.contracts-spec/translations';

export type TranslationDiagnosticLevel = 'info' | 'warning' | 'error';

export type TranslationDiagnosticCode =
	| 'fallback_used'
	| 'formatter_error'
	| 'invalid_locale'
	| 'loader_error'
	| 'missing_message'
	| 'missing_spec'
	| 'override_used';

export interface TranslationDiagnostic {
	code: TranslationDiagnosticCode;
	level: TranslationDiagnosticLevel;
	message: string;
	specKey?: string;
	messageKey?: MessageKey;
	locale?: Locale;
	fallbackLocale?: Locale;
	source?: string;
	context?: Record<string, unknown>;
}

export type TranslationDiagnosticReporter = (
	diagnostic: TranslationDiagnostic
) => void;

export class TranslationDiagnosticsCollector {
	private readonly items: TranslationDiagnostic[] = [];

	report(diagnostic: TranslationDiagnostic): void {
		this.items.push(diagnostic);
	}

	list(): TranslationDiagnostic[] {
		return [...this.items];
	}

	clear(): void {
		this.items.length = 0;
	}
}
