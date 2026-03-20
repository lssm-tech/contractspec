import { describe, expect, it } from 'bun:test';
import { createWidgetRegistry } from './widget-registry';

describe('createWidgetRegistry', () => {
	it('registers and retrieves widget', () => {
		const reg = createWidgetRegistry();
		reg.register({
			widgetKey: 'metric-card',
			title: 'Metric Card',
			nodeKind: 'custom-widget',
			render: 'MetricCardRenderer',
			trust: 'core',
		});
		expect(reg.has('metric-card')).toBe(true);
		expect(reg.get('metric-card')?.title).toBe('Metric Card');
	});

	it('rejects ephemeral-ai trust', () => {
		const reg = createWidgetRegistry();
		expect(() =>
			reg.register({
				widgetKey: 'bad',
				title: 'Bad',
				nodeKind: 'custom-widget',
				render: 'x',
				trust: 'ephemeral-ai' as 'core',
			})
		).toThrow(/ephemeral-ai/);
	});

	it('rejects non-custom-widget nodeKind', () => {
		const reg = createWidgetRegistry();
		expect(() =>
			reg.register({
				widgetKey: 'bad',
				title: 'Bad',
				nodeKind: 'data-view' as 'custom-widget',
				render: 'x',
				trust: 'core',
			})
		).toThrow(/custom-widget/);
	});

	it('listByTrust filters by trust', () => {
		const reg = createWidgetRegistry();
		reg.register({
			widgetKey: 'a',
			title: 'A',
			nodeKind: 'custom-widget',
			render: 'x',
			trust: 'core',
		});
		reg.register({
			widgetKey: 'b',
			title: 'B',
			nodeKind: 'custom-widget',
			render: 'y',
			trust: 'workspace',
		});
		const core = reg.listByTrust('core');
		expect(core).toHaveLength(1);
		expect(core[0]?.widgetKey).toBe('a');
	});
});
