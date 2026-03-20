import { describe, expect, it } from 'bun:test';
import type { BundleContext, ResolvedField } from '../spec/types';
import {
	applyEntityFieldOverlays,
	fromOverlayRenderableField,
	mergeOverlayResultIntoFields,
	toOverlayRenderable,
	toOverlayRenderableField,
	toOverlayScopeContext,
	toOverlayTargetRef,
} from './overlay-alignment';

describe('overlay-alignment', () => {
	const ctx: BundleContext = {
		tenantId: 't1',
		workspaceId: 'w1',
		actorId: 'u1',
		route: '/operate/pm/issues/123',
		params: {},
		query: {},
		device: 'desktop',
		preferences: {
			guidance: 'hints',
			density: 'standard',
			dataDepth: 'standard',
			control: 'standard',
			media: 'text',
			pace: 'balanced',
			narrative: 'top-down',
		},
		capabilities: [],
		featureFlags: ['ff1'],
	};

	it('toOverlayScopeContext maps context to scope', () => {
		const scope = toOverlayScopeContext(ctx);
		expect(scope.tenantId).toBe('t1');
		expect(scope.userId).toBe('u1');
		expect(scope.device).toBe('desktop');
		expect(scope.tags).toEqual(['ff1']);
	});

	it('toOverlayTargetRef maps target to ref', () => {
		const ref = toOverlayTargetRef(ctx, {
			bundleKey: 'pm',
			surfaceId: 'issue-detail',
			routeId: 'issue-detail',
		});
		expect(ref.bundleKey).toBe('pm');
		expect(ref.surfaceId).toBe('issue-detail');
		expect(ref.presentation).toBe('issue-detail');
	});

	it('toOverlayRenderableField maps ResolvedField', () => {
		const field: ResolvedField = {
			fieldId: 'title',
			fieldKind: 'text',
			title: 'Title',
			visible: true,
			editable: true,
			required: true,
		};
		const overlay = toOverlayRenderableField(field);
		expect(overlay.key).toBe('title');
		expect(overlay.label).toBe('Title');
		expect(overlay.visible).toBe(true);
		expect(overlay.required).toBe(true);
	});

	it('fromOverlayRenderableField maps back', () => {
		const partial = fromOverlayRenderableField({
			key: 'status',
			label: 'Status',
			visible: false,
			required: false,
		});
		expect(partial.fieldId).toBe('status');
		expect(partial.title).toBe('Status');
		expect(partial.visible).toBe(false);
	});

	it('applyEntityFieldOverlays returns fields unchanged when no overlays', () => {
		const fields: ResolvedField[] = [
			{
				fieldId: 'a',
				fieldKind: 'text',
				title: 'A',
				visible: true,
				editable: true,
				required: false,
			},
		];
		const result = applyEntityFieldOverlays(fields, []);
		expect(result).toEqual(fields);
	});

	it('applyEntityFieldOverlays applies hideField overlay', () => {
		const fields: ResolvedField[] = [
			{
				fieldId: 'a',
				fieldKind: 'text',
				title: 'A',
				visible: true,
				editable: true,
				required: false,
			},
			{
				fieldId: 'b',
				fieldKind: 'text',
				title: 'B',
				visible: true,
				editable: true,
				required: false,
			},
		];
		const overlays = [
			{
				overlayId: 'ov1',
				version: '1',
				appliesTo: { tenantId: 't1' },
				modifications: [{ type: 'hideField' as const, field: 'a' }],
				signature: {
					algorithm: 'ed25519' as const,
					signature: 'fake',
					publicKey: 'fake',
				},
			},
		];
		const result = applyEntityFieldOverlays(fields, overlays);
		expect(result).toHaveLength(1);
		expect(result[0]?.fieldId).toBe('b');
	});

	it('toOverlayRenderable and mergeOverlayResultIntoFields roundtrip', () => {
		const fields: ResolvedField[] = [
			{
				fieldId: 'x',
				fieldKind: 'text',
				title: 'X',
				visible: true,
				editable: true,
				required: false,
			},
		];
		const target = toOverlayRenderable(fields);
		expect(target.fields).toHaveLength(1);
		expect(target.fields[0]?.key).toBe('x');
		const merged = mergeOverlayResultIntoFields(fields, target);
		expect(merged).toHaveLength(1);
		expect(merged[0]?.fieldId).toBe('x');
	});
});
