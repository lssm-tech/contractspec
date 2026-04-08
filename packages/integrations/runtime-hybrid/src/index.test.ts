import { describe, expect, it } from 'bun:test';
import {
	createHybridRuntimeTargetPayload,
	HYBRID_RUNTIME_INTEGRATION_PACKAGE,
} from './index';

describe('runtime-hybrid integration', () => {
	it('creates the expected hybrid runtime target payload', () => {
		const payload = createHybridRuntimeTargetPayload();

		expect(payload).toMatchObject({
			type: 'hybrid_bridge',
			runtimeMode: 'hybrid',
			displayName: 'Hybrid Builder Runtime',
			networkPolicy: 'hybrid-bridge',
			dataLocality: 'mixed',
			secretHandlingMode: 'mixed',
			supportsPreview: true,
			supportsExport: true,
			supportsMobileInspection: true,
			supportsLocalExecution: true,
		});
		expect(HYBRID_RUNTIME_INTEGRATION_PACKAGE).toBe(
			'@contractspec/integration.runtime.hybrid'
		);
	});
});
