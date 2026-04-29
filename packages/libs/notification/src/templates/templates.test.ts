import { describe, expect, it } from 'bun:test';
import {
	defineTemplate,
	renderNotificationTemplate,
	WelcomeTemplate,
} from './index';

describe('renderNotificationTemplate', () => {
	it('uses localized content for regional locale variants', () => {
		const result = renderNotificationTemplate(
			WelcomeTemplate,
			'inApp',
			{
				name: 'Alice',
				appName: 'ContractSpec',
				actionUrl: 'https://example.com',
			},
			'fr-CA'
		);

		expect(result?.title).toContain('Bienvenue');
		expect(result?.actionUrl).toBe('https://example.com');
	});

	it('merges partial locale channel overrides with default channel content', () => {
		const template = defineTemplate({
			id: 'partial-locale',
			name: 'Partial Locale',
			channels: {
				inApp: {
					title: 'Default title',
					body: 'Default body',
					actionUrl: '{{actionUrl}}',
				},
			},
			localeChannels: {
				fr: {
					inApp: {
						body: 'Bonjour {{name}}',
					},
				},
			},
		});

		const result = renderNotificationTemplate(
			template,
			'inApp',
			{
				name: 'Alice',
				actionUrl: 'https://example.com/bonjour',
			},
			'fr'
		);

		expect(result).toEqual({
			title: 'Default title',
			body: 'Bonjour Alice',
			actionUrl: 'https://example.com/bonjour',
		});
	});
});
