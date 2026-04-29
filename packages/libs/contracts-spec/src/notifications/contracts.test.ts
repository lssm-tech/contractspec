import { describe, expect, it } from 'bun:test';

import {
	DeleteNotificationContract as RootDeleteNotificationContract,
	NotificationsFeature as RootNotificationsFeature,
} from '@contractspec/lib.contracts-spec';
import {
	NotificationContracts as SubpathNotificationContracts,
	NotificationsFeature as SubpathNotificationsFeature,
} from '@contractspec/lib.contracts-spec/notifications';
import { SendNotificationContract as ContractsSubpathSendNotificationContract } from '@contractspec/lib.contracts-spec/notifications/contracts';
import { NotificationsCapability as CapabilitySubpathNotificationsCapability } from '@contractspec/lib.contracts-spec/notifications/notifications.capability';
import { NotificationsFeature as FeatureSubpathNotificationsFeature } from '@contractspec/lib.contracts-spec/notifications/notifications.feature';
import {
	DeleteNotificationContract,
	DeleteNotificationInputModel,
	DeleteNotificationOutputModel,
	ListNotificationsInputModel,
	ListNotificationsOutputModel,
	MarkAllNotificationsReadOutputModel,
	MarkNotificationReadInputModel,
	NotificationContracts,
	NotificationModel,
	NotificationPreferenceModel,
	SendNotificationInputModel,
	UpdatePreferencesInputModel,
} from './contracts';
import { NotificationsCapability } from './notifications.capability';
import { NotificationsFeature } from './notifications.feature';

const expectedOperationKeys = [
	'notifications.send',
	'notifications.list',
	'notifications.markRead',
	'notifications.markAllRead',
	'notifications.preferences.get',
	'notifications.preferences.update',
	'notifications.delete',
];

describe('notification contracts', () => {
	it('preserves notification operation keys and versions', () => {
		expect(NotificationContracts.map((contract) => contract.meta.key)).toEqual(
			expectedOperationKeys
		);
		expect(
			NotificationContracts.map((contract) => contract.meta.version)
		).toEqual(expectedOperationKeys.map(() => '1.0.0'));
	});

	it('preserves public notification model names', () => {
		expect([
			NotificationModel.config.name,
			NotificationPreferenceModel.config.name,
			SendNotificationInputModel.config.name,
			ListNotificationsInputModel.config.name,
			ListNotificationsOutputModel.config.name,
			MarkNotificationReadInputModel.config.name,
			MarkAllNotificationsReadOutputModel.config.name,
			UpdatePreferencesInputModel.config.name,
			DeleteNotificationInputModel.config.name,
			DeleteNotificationOutputModel.config.name,
		]).toEqual([
			'Notification',
			'NotificationPreference',
			'SendNotificationInput',
			'ListNotificationsInput',
			'ListNotificationsOutput',
			'MarkNotificationReadInput',
			'MarkAllNotificationsReadOutput',
			'UpdateNotificationPreferencesInput',
			'DeleteNotificationInput',
			'DeleteNotificationOutput',
		]);
	});

	it('uses the canonical library feature identity and operation refs', () => {
		expect(NotificationsFeature.meta.key).toBe('libs.notifications');
		expect(
			NotificationsFeature.operations?.map((operation) => operation.key)
		).toEqual(expectedOperationKeys);
	});

	it('links the notifications capability to the same operation keys', () => {
		expect(
			NotificationsCapability.provides?.map((surface) => surface.key)
		).toEqual(expectedOperationKeys);
	});

	it('resolves notification root and subpath exports', () => {
		expect(RootDeleteNotificationContract).toBe(DeleteNotificationContract);
		expect(RootNotificationsFeature).toBe(NotificationsFeature);
		expect(SubpathNotificationContracts).toBe(NotificationContracts);
		expect(SubpathNotificationsFeature).toBe(NotificationsFeature);
		expect(ContractsSubpathSendNotificationContract).toBe(
			NotificationContracts[0]
		);
		expect(FeatureSubpathNotificationsFeature).toBe(NotificationsFeature);
		expect(CapabilitySubpathNotificationsCapability).toBe(
			NotificationsCapability
		);
	});
});
