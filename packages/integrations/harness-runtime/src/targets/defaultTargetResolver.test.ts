import { describe, expect, it } from 'bun:test';
import { DefaultHarnessTargetResolver } from './defaultTargetResolver';

describe('DefaultHarnessTargetResolver', () => {
	it('prefers preview and task targets over shared by default', async () => {
		const resolver = new DefaultHarnessTargetResolver({
			previewBaseUrl: 'https://preview.example.test',
			sharedBaseUrl: 'https://shared.example.test',
		});

		const target = await resolver.resolve({});
		expect(target.kind).toBe('preview');
		expect(target.allowlistedDomains).toEqual(['preview.example.test']);
	});
});
