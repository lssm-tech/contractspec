import { describe, expect, it } from 'bun:test';
import { Select } from '@contractspec/lib.design-system/controls';
import { FormDialog } from '@contractspec/lib.design-system/forms';
import { HStack } from '@contractspec/lib.design-system/layout';
import {
	defaultTokens,
	themeSpecToTailwindPreset,
} from '@contractspec/lib.design-system/theme';

describe('design-system public subpaths', () => {
	it('exports focused controls, forms, layout, and theme surfaces', () => {
		expect(typeof Select).toBe('function');
		expect(typeof FormDialog).toBe('function');
		expect(typeof HStack).toBe('function');
		expect(
			themeSpecToTailwindPreset(defaultTokens).theme.extend.colors
		).toBeDefined();
	});
});
