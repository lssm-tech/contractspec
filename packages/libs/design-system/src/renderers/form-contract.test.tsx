import { afterEach, beforeAll, describe, expect, it } from 'bun:test';
import {
	defineFormSpec,
	RichFieldsShowcaseForm,
} from '@contractspec/lib.contracts-spec/forms';
import {
	defineTranslation,
	TranslationRegistry,
} from '@contractspec/lib.contracts-spec/translations';
import { fromZod } from '@contractspec/lib.schema';
import Window from 'happy-dom/lib/window/Window.js';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { z } from 'zod';
import {
	createTranslationResolver,
	DesignSystemTranslationProvider,
} from '../i18n/translation';
import { formRenderer } from './form-contract';
import { formRenderer as rendererFromBarrel } from './index';

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://design-system.contractspec.local/tests',
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
		MouseEvent: windowInstance.MouseEvent,
		IS_REACT_ACT_ENVIRONMENT: true,
	});
});

afterEach(() => {
	document.body.innerHTML = '';
});

function click(element: Element | null) {
	if (!element) throw new Error('Expected element to exist.');
	act(() => {
		element.dispatchEvent(
			new window.MouseEvent('click', { bubbles: true, cancelable: true })
		);
	});
}

const DesignSystemStepFlowForm = defineFormSpec({
	meta: {
		key: 'design-system.form.step-flow',
		version: '1.0.0',
		title: 'Step Flow Form',
		description: 'Exercises design-system step flow rendering.',
		domain: 'design-system',
		owners: ['@team.design'],
		tags: ['test'],
		stability: 'experimental',
	},
	model: fromZod(
		z.object({
			firstName: z.string().optional(),
			lastName: z.string().optional(),
		}),
		{ name: 'DesignSystemStepFlowModel' }
	),
	layout: {
		flow: {
			kind: 'steps',
			sections: [
				{
					key: 'profile',
					titleI18n: 'Profile',
					fieldNames: ['firstName'],
				},
				{
					key: 'contact',
					titleI18n: 'Contact',
					fieldNames: ['lastName'],
				},
			],
		},
	},
	fields: [
		{ kind: 'text', name: 'firstName', labelI18n: 'First name' },
		{ kind: 'text', name: 'lastName', labelI18n: 'Last name' },
	],
	actions: [{ key: 'submit', labelI18n: 'Submit' }],
});

const DesignSystemPasswordVisibilityForm = defineFormSpec({
	meta: {
		key: 'design-system.form.password-visibility',
		version: '1.0.0',
		title: 'Password Visibility Form',
		description: 'Exercises FormSpec password visibility rendering.',
		domain: 'design-system',
		owners: ['@team.design'],
		tags: ['test'],
		stability: 'experimental',
	},
	model: fromZod(
		z.object({
			currentPassword: z.string().optional(),
		}),
		{ name: 'DesignSystemPasswordVisibilityModel' }
	),
	fields: [
		{
			kind: 'text',
			name: 'currentPassword',
			labelI18n: 'Current password',
			password: { purpose: 'current' },
			uiProps: { type: 'password' },
		},
	],
});

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
					contactEmail: 'support@example.com',
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
					currentPassword: 'old-secret',
					newPassword: 'new-secret',
					startDate: new Date('2026-04-10T00:00:00.000Z'),
					startTime: '09:30',
					publishedAt: new Date('2026-04-10T09:30:00.000Z'),
					budget: 1250,
					completionRatio: 0.42,
					allocation: 999.95,
					estimatedDuration: 90,
					contacts: [{ label: 'Support', value: 'support@example.com' }],
				},
			})
		);

		expect(html).toContain('Record ID');
		expect(html).toContain('Alice Martin');
		expect(html).toContain('Contact email');
		expect(html).toContain('type="email"');
		expect(html).toContain('autoComplete="email"');
		expect(html).toContain('1 Main Street');
		expect(html).toContain('+33');
		expect(html).toContain('🇫🇷');
		expect(html).toContain('id="phone"');
		expect(html).toContain('name="phone"');
		expect(html).toContain('id="phone-country"');
		expect(html).toContain('Support');
		expect(html).toContain('Current password');
		expect(html).toContain('autoComplete="current-password"');
		expect(html).toContain('New password');
		expect(html).toContain('autoComplete="new-password"');
		expect(html).toContain('aria-label="Show new password"');
		expect(html).toContain('<fieldset');
		expect(html).toContain('Publication details');
		expect(html).toContain('Budget units');
		expect(html).toContain('Completion');
		expect(html).toContain('value="42"');
		expect(html).toContain('Allocation');
		expect(html).toContain('Estimated duration');
		expect(html).toContain('data-slot="input-group"');
		expect(html).toContain('data-slot="input-group-addon"');
		expect(html).toContain('md:grid-cols-2');
		expect(html).toContain('flex w-full min-w-0 gap-2');
		expect(html).toContain('relative w-full min-w-0 flex-1 shrink');
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

	it('renders progressive step flow through design-system controls', () => {
		const html = renderToStaticMarkup(
			formRenderer.render(DesignSystemStepFlowForm)
		);

		expect(html).toContain('data-slot="form-steps"');
		expect(html).toContain('Profile');
		expect(html).toContain('Contact');
		expect(html).toContain('First name');
		expect(html).not.toContain('Last name');
		expect(html).not.toContain('Submit');
	});

	it('toggles FormSpec-rendered password visibility through design-system controls', () => {
		const container = document.createElement('div');
		document.body.append(container);
		const root = createRoot(container);

		act(() => {
			root.render(
				formRenderer.render(DesignSystemPasswordVisibilityForm, {
					defaultValues: { currentPassword: 'secret-value' },
				})
			);
		});

		const input = container.querySelector('input[name="currentPassword"]');
		const button = container.querySelector('button');

		expect(input?.getAttribute('type')).toBe('password');
		expect(button?.getAttribute('aria-label')).toBe('Show password');
		expect(button?.getAttribute('aria-pressed')).toBe('false');

		click(button);

		expect(input?.getAttribute('type')).toBe('text');
		expect(button?.getAttribute('aria-label')).toBe('Hide password');
		expect(button?.getAttribute('aria-pressed')).toBe('true');

		click(button);

		expect(input?.getAttribute('type')).toBe('password');

		act(() => {
			root.unmount();
		});
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
					'Current password': { value: 'Mot de passe actuel' },
					'Enter current password': { value: 'Saisir le mot de passe actuel' },
					'Show password': { value: 'Afficher le mot de passe' },
					'Hide password': { value: 'Masquer le mot de passe' },
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
		expect(html).toContain('Mot de passe actuel');
		expect(html).toContain('Saisir le mot de passe actuel');
		expect(html).toContain('Afficher le mot de passe');
		expect(html).toContain('reviewer-listbox');
	});
});
