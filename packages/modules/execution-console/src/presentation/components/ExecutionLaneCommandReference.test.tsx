import { describe, expect, it } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { ExecutionLaneCommandReference } from './ExecutionLaneCommandReference';

describe('ExecutionLaneCommandReference', () => {
	it('renders the typed lane command semantics', () => {
		const html = renderToStaticMarkup(<ExecutionLaneCommandReference />);

		expect(html).toContain('Lane Commands');
		expect(html).toContain('/clarify');
		expect(html).toContain('/plan --consensus');
		expect(html).toContain('/complete');
		expect(html).toContain('/team');
		expect(html).toContain('plan.consensus');
	});
});
