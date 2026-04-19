import { createCatalogEntry as entry } from './catalog-entry';
import type { AdoptionCatalogEntry } from './types';

export const UI_CATALOG_ENTRIES: AdoptionCatalogEntry[] = [
	entry(
		'ui.design-system',
		'@contractspec/lib.design-system',
		'ui',
		'primitive',
		100,
		['ui', 'design-system', 'layout', 'forms', 'marketing'],
		['app surfaces', 'shared composed controls', 'web and native theming'],
		'Higher-level ContractSpec design system for composed UI surfaces.',
		{
			platforms: ['web', 'native'],
			avoidWhen: ['Need a lower-level platform leaf primitive only.'],
			replacementImportHints: [
				{
					from: '@contractspec/lib.ui-kit-web/ui/button',
					to: '@contractspec/lib.design-system',
					note: 'Prefer the composed design-system control in app code.',
				},
			],
		}
	),
	entry(
		'ui.ui-kit-web',
		'@contractspec/lib.ui-kit-web',
		'ui',
		'primitive',
		80,
		['ui', 'web', 'radix', 'next', 'components'],
		['web-only primitives', 'lower-level browser controls'],
		'Web-first ContractSpec UI kit for React and Next.js surfaces.',
		{ platforms: ['web'] }
	),
	entry(
		'ui.ui-kit-native',
		'@contractspec/lib.ui-kit',
		'ui',
		'primitive',
		80,
		['ui', 'native', 'expo', 'react-native', 'components'],
		['native primitives', 'expo components', 'react-native controls'],
		'Native-first ContractSpec UI kit for Expo and React Native.',
		{ platforms: ['native'] }
	),
];
