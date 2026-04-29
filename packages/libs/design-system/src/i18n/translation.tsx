'use client';

import type { TranslationRegistry } from '@contractspec/lib.contracts-spec/translations';
import type {
	RuntimeValues,
	TranslationRuntime,
} from '@contractspec/lib.translation-runtime';
import * as React from 'react';

export type DesignSystemTranslationResolver = (
	key: string,
	values?: RuntimeValues
) => string | undefined;

const TranslationContext = React.createContext<
	DesignSystemTranslationResolver | undefined
>(undefined);

export function DesignSystemTranslationProvider({
	children,
	resolver,
}: {
	children: React.ReactNode;
	resolver?: DesignSystemTranslationResolver;
}) {
	return (
		<TranslationContext.Provider value={resolver}>
			{children}
		</TranslationContext.Provider>
	);
}

export function useDesignSystemTranslation() {
	return React.useContext(TranslationContext);
}

export function resolveTranslationString(
	value: string | undefined,
	resolver?: DesignSystemTranslationResolver
) {
	if (!value) {
		return value;
	}
	return resolver?.(value) ?? value;
}

export function resolveTranslationNode(
	value: React.ReactNode,
	resolver?: DesignSystemTranslationResolver
) {
	return typeof value === 'string'
		? resolveTranslationString(value, resolver)
		: value;
}

export function createTranslationResolver({
	registry,
	locale,
	fallbackLocale,
	specKeys = [],
}: {
	registry: TranslationRegistry;
	locale: string;
	fallbackLocale?: string;
	specKeys?: string[];
}): DesignSystemTranslationResolver {
	return (key) => {
		const qualified = key.match(/^([^:]+)::(.+)$/);
		if (qualified?.[1] && qualified[2]) {
			const [, specKey, messageKey] = qualified;
			return registry.getWithFallback(
				specKey,
				messageKey,
				locale,
				fallbackLocale
			)?.message.value;
		}

		for (const specKey of specKeys) {
			const result = registry.getWithFallback(
				specKey,
				key,
				locale,
				fallbackLocale
			);
			if (result) {
				return result.message.value;
			}
		}

		return undefined;
	};
}

export function createRuntimeTranslationResolver({
	runtime,
	onMissing,
}: {
	runtime: TranslationRuntime;
	onMissing?: 'key' | 'empty' | 'throw';
}): DesignSystemTranslationResolver {
	return (key, values) => {
		const qualified = key.match(/^([^:]+)::(.+)$/);
		const specKey = qualified?.[1];
		const messageKey = qualified?.[2] ?? key;
		const value = runtime.tUnknown(messageKey, values, { onMissing, specKey });
		return value === messageKey && onMissing !== 'key' ? undefined : value;
	};
}
