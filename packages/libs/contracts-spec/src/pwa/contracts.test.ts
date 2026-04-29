import { describe, expect, it } from 'bun:test';
import { CapabilityRegistry } from '../capabilities';
import { EventRegistry } from '../events';
import { OperationSpecRegistry } from '../operations';
import {
	comparePwaVersions,
	definePwaAppManifest,
	getLatestPwaRelease,
	PwaAppManifestRegistry,
	PwaUpdateManagementFeature,
	registerPwaCapabilities,
	registerPwaEvents,
	registerPwaOperations,
} from './index';

describe('pwa update contracts', () => {
	it('registers PWA update operation, events, and capability', () => {
		const operations = registerPwaOperations(new OperationSpecRegistry());
		const events = registerPwaEvents(new EventRegistry());
		const capabilities = registerPwaCapabilities(new CapabilityRegistry());

		expect(operations.get('pwa.update.check', '1.0.0')).toBeDefined();
		expect(events.get('pwa.update.prompted', '1.0.0')).toBeDefined();
		expect(events.get('pwa.update.applied', '1.0.0')).toBeDefined();
		expect(events.get('pwa.update.deferred', '1.0.0')).toBeDefined();
		expect(capabilities.get('pwa.update-management', '1.0.0')).toBeDefined();
		expect(PwaUpdateManagementFeature.operations).toContainEqual({
			key: 'pwa.update.check',
			version: '1.0.0',
		});
	});

	it('resolves the latest release using semantic version ordering', () => {
		const manifest = definePwaAppManifest({
			meta: {
				key: 'customer.portal',
				appId: 'portal',
				version: '1.0.0',
				description: 'Customer portal PWA.',
				owners: ['platform.web'],
				tags: ['pwa'],
				stability: 'beta',
			},
			currentRelease: '1.2.0',
			defaultUpdatePolicy: { mode: 'optional' },
			releases: [{ version: '1.9.0' }, { version: '1.10.0' }],
		});
		const registry = new PwaAppManifestRegistry().register(manifest);

		expect(registry.get('customer.portal', '1.0.0')).toBe(manifest);
		expect(getLatestPwaRelease(manifest)?.version).toBe('1.10.0');
		expect(comparePwaVersions('1.10.0', '1.9.0')).toBeGreaterThan(0);
	});
});
