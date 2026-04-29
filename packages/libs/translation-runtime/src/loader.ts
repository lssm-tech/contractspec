import type {
	Locale,
	TranslationSpec,
} from '@contractspec/lib.contracts-spec/translations';

export interface TranslationBundleLoadRequest {
	specKey?: string;
	locales: readonly Locale[];
}

export interface TranslationBundleLoader {
	load(
		request: TranslationBundleLoadRequest
	): Promise<readonly TranslationSpec[]>;
}

export function createStaticBundleLoader(
	specs: readonly TranslationSpec[]
): TranslationBundleLoader {
	return {
		async load(
			request: TranslationBundleLoadRequest
		): Promise<TranslationSpec[]> {
			return specs.filter((spec) => {
				const keyMatches =
					!request.specKey || spec.meta.key === request.specKey;
				return keyMatches && request.locales.includes(spec.locale);
			});
		},
	};
}
