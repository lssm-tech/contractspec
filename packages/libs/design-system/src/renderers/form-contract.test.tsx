import { describe, expect, it } from 'bun:test';
import { RichFieldsShowcaseForm } from '@contractspec/lib.contracts-spec/forms';
import {
	defineTranslation,
	TranslationRegistry,
} from '@contractspec/lib.contracts-spec/translations';
import { renderToStaticMarkup } from 'react-dom/server';
import {
	createTranslationResolver,
	DesignSystemTranslationProvider,
} from '../i18n/translation';
import { formRenderer } from './form-contract';
import { formRenderer as rendererFromBarrel } from './index';

describe('design-system form renderer', () => {
	it('renders the shared rich field showcase without dropping field kinds', () => {
		const html = renderToStaticMarkup(
			formRenderer.render(RichFieldsShowcaseForm, {
				defaultValues: {
					recordId: 'rec_1',
					status: 'draft',
					reviewer: {
						id: 'usr_1',
						name: 'Alice Martin',
						email: 'alice@example.com',
					},
					address: {
						line1: '1 Main Street',
						city: 'Paris',
						countryCode: 'FR',
					},
					phone: {
						countryCode: '+33',
						nationalNumber: '612345678',
						e164: '+33612345678',
					},
					startDate: new Date('2026-04-10T00:00:00.000Z'),
					startTime: '09:30',
					publishedAt: new Date('2026-04-10T09:30:00.000Z'),
					contacts: [{ label: 'Support', value: 'support@example.com' }],
				},
			})
		);

		expect(html).toContain('Record ID');
		expect(html).toContain('Alice Martin');
		expect(html).toContain('1 Main Street');
		expect(html).toContain('+33');
		expect(html).toContain('Support');
	});

	it('exports the shared form renderer from the renderers barrel', () => {
		const html = renderToStaticMarkup(
			rendererFromBarrel.render(RichFieldsShowcaseForm, {
				defaultValues: {
					recordId: 'rec_1',
				},
			})
		);

		expect(html).toContain('Record ID');
	});

	it('resolves translated form labels through the design-system provider', () => {
		const registry = new TranslationRegistry([
			defineTranslation({
				meta: {
					key: 'design-system.form',
					version: '1.0.0',
					domain: 'design-system',
					owners: ['@team.design'],
				},
				locale: 'fr',
				messages: {
					'Record ID': { value: 'Identifiant' },
					'Search a reviewer': { value: 'Rechercher un reviewer' },
					'Address line 1': { value: 'Adresse ligne 1' },
					'No results found.': { value: 'Aucun résultat' },
				},
			}),
		]);

		const html = renderToStaticMarkup(
			<DesignSystemTranslationProvider
				resolver={createTranslationResolver({
					registry,
					locale: 'fr',
					specKeys: ['design-system.form'],
				})}
			>
				{formRenderer.render(RichFieldsShowcaseForm, {
					defaultValues: {
						recordId: 'rec_1',
					},
				})}
			</DesignSystemTranslationProvider>
		);

		expect(html).toContain('Identifiant');
		expect(html).toContain('Rechercher un reviewer');
		expect(html).toContain('Adresse ligne 1');
		expect(html).toContain('Aucun résultat');
	});
});
