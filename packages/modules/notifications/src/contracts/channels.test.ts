import { describe, expect, it } from 'bun:test';
import { NotificationEntity } from '../entities';
import {
	ListNotificationsOutputModel,
	SendNotificationInputModel,
} from './index';

describe('notification channel contract alignment', () => {
	it('exposes sms, telegram, and whatsapp in send input schemas', () => {
		const channelsField = SendNotificationInputModel.config.fields.channels;
		const values = readEnumValues(channelsField?.type);
		expect(values).toContain('SMS');
		expect(values).toContain('TELEGRAM');
		expect(values).toContain('WHATSAPP');
	});

	it('keeps list output channels aligned with send input schemas', () => {
		const channelsField =
			ListNotificationsOutputModel.config.fields.notifications.type.config
				.fields.channels;
		const values = readEnumValues(channelsField?.type);
		expect(values).toContain('SMS');
		expect(values).toContain('TELEGRAM');
		expect(values).toContain('WHATSAPP');
	});

	it('keeps entity enums aligned with contract schemas', () => {
		const entityEnum = NotificationEntity.enums?.find(
			(entry) => entry.name === 'NotificationChannel'
		);
		expect(entityEnum?.values).toContain('SMS');
		expect(entityEnum?.values).toContain('TELEGRAM');
		expect(entityEnum?.values).toContain('WHATSAPP');
	});
});

function readEnumValues(value: unknown): string[] {
	if (!value || typeof value !== 'object') return [];
	const record = value as { values?: string[] };
	return Array.isArray(record.values) ? record.values : [];
}
