import { describe, expect, it } from 'bun:test';
import {
	defineTranslation,
	TranslationRegistry,
} from '@contractspec/lib.contracts-spec/translations';
import { renderToStaticMarkup } from 'react-dom/server';
import {
	createTranslationResolver,
	DesignSystemTranslationProvider,
} from '../../i18n/translation';
import { VisualizationCard } from './VisualizationCard';

const visualizationSpec = {
	meta: {
		key: 'visitors.metric',
		version: '1.0.0',
		title: 'Visitors',
		description: 'Visitors description',
		goal: 'Track visitors',
		context: 'dashboard',
		domain: 'analytics',
		owners: ['@team.analytics'],
	},
	source: {
		primary: { key: 'visitors.query', version: '1.0.0' },
	},
	visualization: {
		kind: 'metric',
		measure: 'count',
		measures: [
			{
				key: 'count',
				label: 'Count',
				dataPath: 'count',
			},
		],
	},
} as const;

describe('VisualizationCard', () => {
	it('uses translated visualization title and description defaults', () => {
		const registry = new TranslationRegistry([
			defineTranslation({
				meta: {
					key: 'design-system.visualization',
					version: '1.0.0',
					domain: 'design-system',
					owners: ['@team.design'],
				},
				locale: 'fr',
				messages: {
					Visitors: { value: 'Visiteurs' },
					'Visitors description': { value: 'Description visiteurs' },
				},
			}),
		]);

		const html = renderToStaticMarkup(
			<DesignSystemTranslationProvider
				resolver={createTranslationResolver({
					registry,
					locale: 'fr',
					specKeys: ['design-system.visualization'],
				})}
			>
				<VisualizationCard
					spec={visualizationSpec}
					data={{ count: 42 }}
					height={160}
				/>
			</DesignSystemTranslationProvider>
		);

		expect(html).toContain('Visiteurs');
		expect(html).toContain('Description visiteurs');
	});
});
