import { describe, expect, it } from 'bun:test';
import { MOCK_RUNS } from '../shared';
import type { Run } from '../ui/hooks/useRunList';
import { createAgentVisualizationItems } from './selectors';

describe('agent visualization selectors', () => {
	it('creates the expected visualization items', () => {
		const items = createAgentVisualizationItems(MOCK_RUNS as unknown as Run[]);
		expect(items).toHaveLength(3);
		expect(items[0]?.title).toBe('Run Status Breakdown');
	});
});
