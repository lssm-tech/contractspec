import { describe, expect, it } from 'bun:test';
import {
	defineTranslation,
	TranslationRegistry,
} from '@contractspec/lib.contracts-spec/translations';
import { renderToStaticMarkup } from 'react-dom/server';
import {
	createTranslationResolver,
	DesignSystemTranslationProvider,
} from '../../../i18n/translation';
import { Input } from '../../atoms/Input';
import { Textarea } from '../../atoms/Textarea';
import { Autocomplete } from './Autocomplete';
import { DatePicker, DateTimePicker, TimePicker } from './DateTimeControls';
import { Select } from './Select';

const translations = new TranslationRegistry([
	defineTranslation({
		meta: {
			key: 'design-system.form',
			version: '1.0.0',
			domain: 'design-system',
			owners: ['platform.design'],
		},
		locale: 'fr',
		messages: {
			'input.placeholder': { value: 'Saisir une valeur' },
			'textarea.placeholder': { value: 'Décrire la demande' },
			'select.placeholder': { value: 'Choisir un statut' },
			'option.draft': { value: 'Brouillon' },
			'autocomplete.placeholder': { value: 'Rechercher' },
			'date.placeholder': { value: 'Choisir une date' },
			'time.placeholder': { value: 'Choisir une heure' },
		},
	}),
]);

function WithTranslations({ children }: { children: React.ReactNode }) {
	return (
		<DesignSystemTranslationProvider
			resolver={createTranslationResolver({
				registry: translations,
				locale: 'fr',
				specKeys: ['design-system.form'],
			})}
		>
			{children}
		</DesignSystemTranslationProvider>
	);
}

describe('design-system controls', () => {
	it('translates text input, textarea, select, and autocomplete copy', () => {
		const html = renderToStaticMarkup(
			<WithTranslations>
				<Input placeholderI18n="input.placeholder" />
				<Textarea placeholderI18n="textarea.placeholder" />
				<Select
					placeholderI18n="select.placeholder"
					options={[{ labelI18n: 'option.draft', value: 'draft' }]}
				/>
				<Autocomplete
					query=""
					options={[{ labelI18n: 'option.draft', value: 'draft' }]}
					selectedOptions={[]}
					placeholderI18n="autocomplete.placeholder"
				/>
			</WithTranslations>
		);

		expect(html).toContain('Saisir une valeur');
		expect(html).toContain('Décrire la demande');
		expect(html).toContain('Choisir un statut');
		expect(html).toContain('Rechercher');
	});

	it('translates date, time, and datetime placeholders', () => {
		const html = renderToStaticMarkup(
			<WithTranslations>
				<DatePicker
					value={null}
					onChange={() => undefined}
					placeholderI18n="date.placeholder"
				/>
				<TimePicker
					value={null}
					onChange={() => undefined}
					placeholderI18n="time.placeholder"
				/>
				<DateTimePicker
					value={null}
					onChange={() => undefined}
					datePlaceholderI18n="date.placeholder"
					timePlaceholderI18n="time.placeholder"
				/>
			</WithTranslations>
		);

		expect(html).toContain('Choisir une date');
		expect(html).toContain('Choisir une heure');
	});
});
