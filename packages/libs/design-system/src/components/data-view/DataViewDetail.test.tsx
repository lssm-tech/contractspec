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
import { DataViewDetail } from './DataViewDetail';

const detailSpec = {
	meta: {
		key: 'residents.detail',
		version: '1.0.0',
		title: 'Resident detail',
		description: 'Resident detail description',
		domain: 'residents',
		entity: 'resident',
		owners: ['@team.ops'],
	},
	source: {
		primary: { key: 'resident.list', version: '1.0.0' },
	},
	view: {
		kind: 'detail',
		fields: [
			{
				key: 'status',
				label: 'Status',
				dataPath: 'status',
			},
		],
		sections: [
			{
				title: 'Overview',
				description: 'Overview description',
				fields: ['status'],
			},
		],
	},
} as const;

describe('DataViewDetail', () => {
	it('renders translated data-view labels and descriptions', () => {
		const registry = new TranslationRegistry([
			defineTranslation({
				meta: {
					key: 'design-system.data-view',
					version: '1.0.0',
					domain: 'design-system',
					owners: ['@team.design'],
				},
				locale: 'fr',
				messages: {
					'Resident detail': { value: 'Détail résident' },
					'Resident detail description': { value: 'Description résident' },
					Overview: { value: 'Vue d’ensemble' },
					'Overview description': { value: 'Description de la section' },
					Status: { value: 'Statut' },
				},
			}),
		]);

		const html = renderToStaticMarkup(
			<DesignSystemTranslationProvider
				resolver={createTranslationResolver({
					registry,
					locale: 'fr',
					specKeys: ['design-system.data-view'],
				})}
			>
				<DataViewDetail spec={detailSpec} item={{ status: 'draft' }} />
			</DesignSystemTranslationProvider>
		);

		expect(html).toContain('Détail résident');
		expect(html).toContain('Vue d’ensemble');
		expect(html).toContain('Statut');
	});
});
