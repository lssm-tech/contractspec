import { describe, expect, it } from 'bun:test';
import {
	legacyNotificationsSchemaContribution,
	notificationEntities,
	notificationsSchemaContribution,
} from './index';

describe('notification schema contribution identities', () => {
	it('uses the library package as the canonical schema contribution id', () => {
		expect(notificationsSchemaContribution.moduleId).toBe(
			'@contractspec/lib.notification'
		);
		expect(notificationsSchemaContribution.entities).toBe(notificationEntities);
	});

	it('exports the legacy module schema contribution id for compatibility', () => {
		expect(legacyNotificationsSchemaContribution.moduleId).toBe(
			'@contractspec/module.notifications'
		);
		expect(legacyNotificationsSchemaContribution.entities).toBe(
			notificationEntities
		);
	});
});
