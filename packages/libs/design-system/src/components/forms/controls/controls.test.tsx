import { afterEach, beforeAll, describe, expect, it } from 'bun:test';
import {
	defineTranslation,
	TranslationRegistry,
} from '@contractspec/lib.contracts-spec/translations';
import Window from 'happy-dom/lib/window/Window.js';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import {
	createTranslationResolver,
	DesignSystemTranslationProvider,
} from '../../../i18n/translation';
import { Input } from '../../atoms/Input';
import { InputPassword } from '../../atoms/InputPassword';
import { Textarea } from '../../atoms/Textarea';
import { Autocomplete } from './Autocomplete';
import { DatePicker, DateTimePicker, TimePicker } from './DateTimeControls';
import { Select } from './Select';
import {
	selectGroupLabel,
	selectOptionGroups,
	selectOptionLabel,
} from './select-options';

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://design-system-controls.contractspec.local/tests',
	});
	Object.defineProperty(windowInstance, 'SyntaxError', {
		value: SyntaxError,
		configurable: true,
	});
	Object.assign(globalThis, {
		window: windowInstance,
		document: windowInstance.document,
		navigator: windowInstance.navigator,
		HTMLElement: windowInstance.HTMLElement,
		HTMLInputElement: windowInstance.HTMLInputElement,
		HTMLButtonElement: windowInstance.HTMLButtonElement,
		Node: windowInstance.Node,
		Event: windowInstance.Event,
		FocusEvent: windowInstance.FocusEvent,
		MouseEvent: windowInstance.MouseEvent,
		MutationObserver: windowInstance.MutationObserver,
		DocumentFragment: windowInstance.DocumentFragment,
		getComputedStyle: windowInstance.getComputedStyle.bind(windowInstance),
		requestAnimationFrame: (callback: FrameRequestCallback) =>
			setTimeout(() => callback(Date.now()), 0),
		cancelAnimationFrame: (id: number) => clearTimeout(id),
		IS_REACT_ACT_ENVIRONMENT: true,
	});
});

afterEach(() => {
	document.body.innerHTML = '';
});

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
			'password.placeholder': { value: 'Saisir le mot de passe' },
			'password.show': { value: 'Afficher' },
			'password.hide': { value: 'Masquer' },
			'textarea.placeholder': { value: 'Décrire la demande' },
			'select.placeholder': { value: 'Choisir un statut' },
			'select.group.lifecycle': { value: 'Cycle de vie' },
			'select.group.release': { value: 'Publication' },
			'option.draft': { value: 'Brouillon' },
			'option.published': { value: 'Publié' },
			'autocomplete.placeholder': { value: 'Rechercher' },
			'autocomplete.empty': { value: 'Aucun resultat' },
			'autocomplete.loading': { value: 'Chargement' },
			'autocomplete.error': { value: 'Recherche impossible' },
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

function renderControl(node: React.ReactNode) {
	const container = document.createElement('div');
	document.body.append(container);
	const root: Root = createRoot(container);
	act(() => {
		root.render(node);
	});
	return { container, root };
}

describe('design-system controls', () => {
	it('translates text input, textarea, select, and autocomplete copy', () => {
		const html = renderToStaticMarkup(
			<WithTranslations>
				<Input placeholderI18n="input.placeholder" />
				<InputPassword
					placeholderI18n="password.placeholder"
					showLabelI18n="password.show"
					hideLabelI18n="password.hide"
				/>
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
		expect(html).toContain('Saisir le mot de passe');
		expect(html).toContain('aria-label="Afficher"');
		expect(html).toContain('Décrire la demande');
		expect(html).toContain('Choisir un statut');
		expect(html).toContain('Rechercher');
	});

	it('translates autocomplete async state copy', () => {
		const { container, root } = renderControl(
			<WithTranslations>
				<Autocomplete
					id="translated-autocomplete"
					query=""
					options={[]}
					selectedOptions={[]}
					placeholderI18n="autocomplete.placeholder"
					emptyText="autocomplete.empty"
					loadingText="autocomplete.loading"
					errorText="autocomplete.error"
					loading
				/>
			</WithTranslations>
		);
		const input = container.querySelector('input[role="combobox"]');
		if (!(input instanceof HTMLInputElement)) {
			throw new Error('Expected translated autocomplete input.');
		}

		act(() => {
			input.focus();
		});
		expect(document.body.textContent).toContain('Chargement');

		act(() => {
			root.render(
				<WithTranslations>
					<Autocomplete
						id="translated-autocomplete"
						query=""
						options={[]}
						selectedOptions={[]}
						emptyText="autocomplete.empty"
						loadingText="autocomplete.loading"
						errorText="autocomplete.error"
						error="autocomplete.error"
					/>
				</WithTranslations>
			);
		});
		expect(document.body.textContent).toContain('Recherche impossible');

		act(() => {
			root.render(
				<WithTranslations>
					<Autocomplete
						id="translated-autocomplete"
						query=""
						options={[]}
						selectedOptions={[]}
						emptyText="autocomplete.empty"
					/>
				</WithTranslations>
			);
		});
		expect(document.body.textContent).toContain('Aucun resultat');

		act(() => {
			root.unmount();
		});
	});

	it('normalizes and translates grouped select options', () => {
		const translate = createTranslationResolver({
			registry: translations,
			locale: 'fr',
			specKeys: ['design-system.form'],
		});
		const groups = selectOptionGroups({
			options: [{ labelI18n: 'option.draft', value: 'draft' }],
			groups: [
				{
					labelI18n: 'select.group.lifecycle',
					options: [{ labelI18n: 'option.draft', value: 'draft' }],
				},
				{
					labelI18n: 'select.group.release',
					options: [{ labelI18n: 'option.published', value: 'published' }],
				},
			],
		});
		const fallbackGroups = selectOptionGroups({
			options: [{ labelI18n: 'option.draft', value: 'draft' }],
			groups: [],
		});

		expect(groups).toHaveLength(2);
		expect(groups.map((group) => selectGroupLabel(group, translate))).toEqual([
			'Cycle de vie',
			'Publication',
		]);
		expect(
			groups.flatMap((group) =>
				group.options.map((option) => selectOptionLabel(option, translate))
			)
		).toEqual(['Brouillon', 'Publié']);
		expect(fallbackGroups).toHaveLength(1);
		expect(fallbackGroups[0]?.options).toHaveLength(1);
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
