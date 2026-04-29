import {
	type MessageFormatElement,
	parse,
	TYPE,
} from '@formatjs/icu-messageformat-parser';
import IntlMessageFormat from 'intl-messageformat';
import type {
	CompiledMessage,
	CompileMessageOptions,
	MessageFormatter,
	MessageFormatValidationResult,
	RuntimeValues,
} from '../formatter';

export interface IntlMessageFormatterOptions {
	cache?: Map<string, CompiledMessage>;
}

export function createIntlMessageFormatter(
	options: IntlMessageFormatterOptions = {}
): MessageFormatter {
	const cache = options.cache ?? new Map<string, CompiledMessage>();

	return {
		compile({ id, locale, message }: CompileMessageOptions): CompiledMessage {
			const cacheKey = `${locale}\u0000${id}\u0000${message}`;
			const cached = cache.get(cacheKey);
			if (cached) return cached;

			const compiled = new IntlMessageFormat(message, locale);
			const wrapped: CompiledMessage = {
				format(values?: RuntimeValues): string {
					const formatted = compiled.format(values);
					return Array.isArray(formatted)
						? formatted.join('')
						: String(formatted);
				},
			};
			cache.set(cacheKey, wrapped);
			return wrapped;
		},

		validate(message: string): MessageFormatValidationResult {
			try {
				const ast = parse(message);
				return collectAstMetadata(ast);
			} catch (error) {
				return {
					valid: false,
					error: error instanceof Error ? error.message : 'Invalid ICU message',
					arguments: [],
					plurals: [],
					selects: [],
					selectOrdinals: [],
				};
			}
		},
	};
}

function collectAstMetadata(
	ast: MessageFormatElement[]
): MessageFormatValidationResult {
	const args = new Set<string>();
	const plurals = new Set<string>();
	const selects = new Set<string>();
	const ordinals = new Set<string>();

	const visit = (elements: MessageFormatElement[]) => {
		for (const element of elements) {
			const value = 'value' in element ? String(element.value) : undefined;
			if (value && isArgumentElement(element.type)) {
				args.add(value);
			}
			if (value && element.type === TYPE.select) selects.add(value);
			if (value && element.type === TYPE.plural) {
				args.add(value);
				if ('pluralType' in element && element.pluralType === 'ordinal') {
					ordinals.add(value);
				} else {
					plurals.add(value);
				}
			}
			if ('options' in element) {
				for (const option of Object.values(element.options)) {
					visit(option.value);
				}
			}
		}
	};

	visit(ast);
	return {
		valid: true,
		arguments: [...args],
		plurals: [...plurals],
		selects: [...selects],
		selectOrdinals: [...ordinals],
	};
}

function isArgumentElement(type: number | undefined): boolean {
	return (
		type === TYPE.argument ||
		type === TYPE.number ||
		type === TYPE.date ||
		type === TYPE.time ||
		type === TYPE.select ||
		type === TYPE.plural ||
		type === TYPE.pound ||
		type === TYPE.tag
	);
}
