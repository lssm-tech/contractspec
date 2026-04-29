import { describe, expect, it } from 'bun:test';
import { notificationsSchemaContribution } from '@contractspec/module.notifications/entities';
import { NotificationsFeature } from '@contractspec/module.notifications/notifications.feature';

const expectedSubpaths = [
	'@contractspec/module.notifications',
	'@contractspec/module.notifications/channels',
	'@contractspec/module.notifications/channels/base',
	'@contractspec/module.notifications/channels/provider-channels',
	'@contractspec/module.notifications/channels/types',
	'@contractspec/module.notifications/contracts',
	'@contractspec/module.notifications/entities',
	'@contractspec/module.notifications/i18n',
	'@contractspec/module.notifications/i18n/catalogs',
	'@contractspec/module.notifications/i18n/catalogs/en',
	'@contractspec/module.notifications/i18n/catalogs/es',
	'@contractspec/module.notifications/i18n/catalogs/fr',
	'@contractspec/module.notifications/i18n/keys',
	'@contractspec/module.notifications/i18n/locale',
	'@contractspec/module.notifications/i18n/messages',
	'@contractspec/module.notifications/notifications.capability',
	'@contractspec/module.notifications/notifications.feature',
	'@contractspec/module.notifications/templates',
] as const;

describe('module.notifications compatibility shim', () => {
	it('preserves legacy schema and feature identities', () => {
		expect(notificationsSchemaContribution.moduleId).toBe(
			'@contractspec/module.notifications'
		);
		expect(NotificationsFeature.meta.key).toBe('modules.notifications');
	});

	it('keeps every legacy export subpath importable', async () => {
		for (const subpath of expectedSubpaths) {
			await expect(import(subpath)).resolves.toBeDefined();
		}
	});
});
