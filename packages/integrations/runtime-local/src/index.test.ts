import { describe, expect, it } from 'bun:test';
import {
	createLocalRuntimeTargetPayload,
	LOCAL_RUNTIME_INTEGRATION_PACKAGE,
} from './index';

describe('runtime-local integration', () => {
	it('creates the expected local runtime target payload', () => {
		const payload = createLocalRuntimeTargetPayload();

		expect(payload).toMatchObject({
			type: 'local_daemon',
			runtimeMode: 'local',
			displayName: 'Local Builder Runtime',
			networkPolicy: 'tenant-local',
			dataLocality: 'local',
			secretHandlingMode: 'local',
			supportsPreview: true,
			supportsExport: true,
			supportsMobileInspection: true,
			supportsLocalExecution: true,
		});
		expect(LOCAL_RUNTIME_INTEGRATION_PACKAGE).toBe(
			'@contractspec/integration.runtime.local'
		);
	});
});
