'use client';

import type { TranslationRegistry } from '@contractspec/lib.contracts-spec/translations';
import * as React from 'react';

export type DesignSystemTranslationResolver = (
	key: string
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
