import { describe, expect, it } from 'bun:test';
import { Tabs } from '@contractspec/lib.design-system';
import { Select } from '@contractspec/lib.design-system/controls';
import { FormDialog } from '@contractspec/lib.design-system/forms';
import { HStack } from '@contractspec/lib.design-system/layout';
import { List, ListItem } from '@contractspec/lib.design-system/list';
import {
	defaultTokens,
	themeSpecToTailwindPreset,
} from '@contractspec/lib.design-system/theme';
import { H1, P, Text } from '@contractspec/lib.design-system/typography';

describe('design-system public subpaths', () => {
	it('exports focused controls, forms, layout, list, typography, and theme surfaces', () => {
		expect(typeof Tabs).toBe('function');
		expect(typeof Select).toBe('function');
		expect(typeof FormDialog).toBe('function');
		expect(typeof HStack).toBe('function');
		expect(typeof List).toBe('function');
		expect(typeof ListItem).toBe('function');
		expect(typeof Text).toBe('function');
		expect(typeof H1).toBe('function');
		expect(typeof P).toBe('function');
		expect(
			themeSpecToTailwindPreset(defaultTokens).theme.extend.colors
		).toBeDefined();
	});
});
