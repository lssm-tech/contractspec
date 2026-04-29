import { describe, expect, it } from 'bun:test';
import { generatePwaAppManifestSpec } from './advanced-contracts.template';

describe('generatePwaAppManifestSpec', () => {
	it('generates a valid PWA app manifest scaffold', () => {
		const code = generatePwaAppManifestSpec({
			key: 'portal.web',
			version: '1.2.3',
			description: 'Customer portal frontend.',
			owners: ['platform.core'],
			tags: ['pwa'],
			stability: 'beta',
		});

		expect(code).toContain(
			"import { definePwaAppManifest } from '@contractspec/lib.contracts-spec/pwa';"
		);
		expect(code).toContain('definePwaAppManifest({');
		expect(code).toContain("key: 'portal.web'");
		expect(code).toContain("appId: 'portal.web'");
		expect(code).toContain("currentRelease: '1.2.3'");
		expect(code).toContain("minSupportedVersion: '1.2.3'");
	});
});
