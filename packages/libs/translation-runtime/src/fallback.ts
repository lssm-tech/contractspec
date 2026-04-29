import type { Locale } from '@contractspec/lib.contracts-spec/translations';
import { buildLocaleFallbackChain } from './locale';

export interface FallbackPolicy {
	defaultLocale: Locale;
	locales?: readonly Locale[];
}

export function resolveFallbackChain(
	locale: Locale,
	policy: FallbackPolicy
): Locale[] {
	return buildLocaleFallbackChain(
		locale,
		policy.defaultLocale,
		policy.locales ?? []
	);
}
