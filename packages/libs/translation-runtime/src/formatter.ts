import type { Locale } from '@contractspec/lib.contracts-spec/translations';

export type RuntimePrimitive =
	| string
	| number
	| boolean
	| Date
	| null
	| undefined;
export type RuntimeValue = RuntimePrimitive | ((chunks: string[]) => string);
export type RuntimeValues = Record<string, RuntimeValue>;

export interface CompiledMessage {
	format(values?: RuntimeValues): string;
}

export interface MessageFormatValidationResult {
	valid: boolean;
	error?: string;
	arguments: string[];
	plurals: string[];
	selects: string[];
	selectOrdinals: string[];
}

export interface CompileMessageOptions {
	id: string;
	locale: Locale;
	message: string;
}

export interface MessageFormatter {
	compile(options: CompileMessageOptions): CompiledMessage;
	validate(message: string): MessageFormatValidationResult;
}
