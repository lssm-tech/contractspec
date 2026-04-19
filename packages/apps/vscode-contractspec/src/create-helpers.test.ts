import { describe, expect, it } from 'bun:test';
import {
	buildDefaultCreatePath,
	getCreateQuickPickItems,
} from './commands/create-helpers';

describe('VS Code create helpers', () => {
	it('includes the widened authoring targets in the quick pick', () => {
		const items = getCreateQuickPickItems();

		expect(items.some((item) => item.value === 'capability')).toBe(true);
		expect(items.some((item) => item.value === 'job')).toBe(true);
		expect(items.some((item) => item.value === 'translation')).toBe(true);
		expect(items.some((item) => item.value === 'harness-scenario')).toBe(true);
	});

	it('builds canonical default output paths', () => {
		expect(
			buildDefaultCreatePath(
				'/repo',
				'./src',
				'translation',
				{ key: 'app.messages', locale: 'en-US' },
				{ translations: 'translations' }
			)
		).toBe('/repo/src/translations/app-messages.en-US.translation.ts');

		expect(
			buildDefaultCreatePath('/repo', './src', 'example', { key: 'demo' }, {})
		).toBe('/repo/src/example.ts');
	});
});
