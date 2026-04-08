import { describe, expect, it } from 'bun:test';
import {
	createManagedRuntimeTargetPayload,
	MANAGED_RUNTIME_INTEGRATION_PACKAGE,
} from './index';

describe('runtime-managed integration', () => {
	it('creates the expected managed runtime target payload', () => {
		const payload = createManagedRuntimeTargetPayload();

		expect(payload).toMatchObject({
			type: 'managed_workspace',
			runtimeMode: 'managed',
			displayName: 'Managed Builder Runtime',
			networkPolicy: 'managed-default',
			dataLocality: 'managed',
			secretHandlingMode: 'managed',
			supportsPreview: true,
			supportsExport: true,
			supportsMobileInspection: true,
			supportsLocalExecution: false,
		});
		expect(MANAGED_RUNTIME_INTEGRATION_PACKAGE).toBe(
			'@contractspec/integration.runtime.managed'
		);
	});
});
