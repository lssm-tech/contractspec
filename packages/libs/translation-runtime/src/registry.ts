import type {
	Locale,
	MessageKey,
	TranslationMessage,
	TranslationSpec,
} from '@contractspec/lib.contracts-spec/translations';
import type { OverrideLayer, OverrideScope } from './overrides';
import { defaultOverridePriority, sortOverrideLayers } from './overrides';

export interface RuntimeTranslationSource {
	scope: OverrideScope;
	source: string;
	spec: TranslationSpec;
	priority: number;
	sequence: number;
}

export interface RuntimeTranslationResolution {
	spec: TranslationSpec;
	message: TranslationMessage;
	locale: Locale;
	fromFallback: boolean;
	source: string;
	scope: OverrideScope;
}

export class RuntimeTranslationRegistry {
	private readonly sources: RuntimeTranslationSource[] = [];
	private sequence = 0;

	constructor(specs: readonly TranslationSpec[] = []) {
		this.addSpecs(specs, { scope: 'base', source: 'base' });
	}

	addSpecs(
		specs: readonly TranslationSpec[],
		options: { scope: OverrideScope; source: string; priority?: number }
	): void {
		for (const spec of specs) {
			this.sources.push({
				...options,
				priority: options.priority ?? defaultOverridePriority(options.scope),
				sequence: this.sequence++,
				spec,
			});
		}
	}

	addOverrideLayers(layers: readonly OverrideLayer[]): void {
		for (const layer of sortOverrideLayers(layers)) {
			this.addSpecs(layer.specs, {
				scope: layer.scope,
				source: layer.source,
				priority: layer.priority,
			});
		}
	}

	listSpecs(): TranslationSpec[] {
		return this.sources.map((source) => source.spec);
	}

	listSources(): RuntimeTranslationSource[] {
		return this.sources.map((source) => ({ ...source }));
	}

	listLocales(specKey?: string): Locale[] {
		const locales = new Set<Locale>();
		for (const source of this.sources) {
			if (!specKey || source.spec.meta.key === specKey) {
				locales.add(source.spec.locale);
			}
		}
		return [...locales];
	}

	resolve({
		specKey,
		messageKey,
		fallbackChain,
		version,
	}: {
		specKey: string;
		messageKey: MessageKey;
		fallbackChain: readonly Locale[];
		version?: string;
	}): RuntimeTranslationResolution | undefined {
		const ordered = [...this.sources].sort(
			(left, right) =>
				right.priority - left.priority || right.sequence - left.sequence
		);
		const primaryLocale = fallbackChain[0];

		for (const locale of fallbackChain) {
			for (const source of ordered) {
				const { spec } = source;
				if (spec.meta.key !== specKey) continue;
				if (version && spec.meta.version !== version) continue;
				if (spec.locale !== locale) continue;

				const message = spec.messages[messageKey];
				if (message) {
					return {
						spec,
						message,
						locale,
						fromFallback: locale !== primaryLocale,
						source: source.source,
						scope: source.scope,
					};
				}
			}
		}

		return undefined;
	}
}
