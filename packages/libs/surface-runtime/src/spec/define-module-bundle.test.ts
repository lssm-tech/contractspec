import { describe, expect, it } from 'bun:test';
import { defineModuleBundle } from './define-module-bundle';

describe('defineModuleBundle', () => {
	it('accepts valid bundle spec', () => {
		const spec = defineModuleBundle({
			meta: {
				key: 'test.bundle',
				version: '0.1.0',
				title: 'Test Bundle',
			},
			routes: [
				{
					routeId: 'test-route',
					path: '/test/:id',
					defaultSurface: 'main',
				},
			],
			surfaces: {
				main: {
					surfaceId: 'main',
					kind: 'workbench',
					title: 'Main',
					slots: [
						{
							slotId: 'primary',
							role: 'primary',
							accepts: [],
							cardinality: 'one',
						},
					],
					layouts: [
						{
							layoutId: 'default',
							root: { type: 'slot', slotId: 'primary' },
						},
					],
					data: [],
					verification: {
						dimensions: {
							guidance: 'Hints available',
							density: 'Standard layout',
							dataDepth: 'Standard depth',
							control: 'Standard controls',
							media: 'Text-first',
							pace: 'Balanced pace',
							narrative: 'Top-down flow',
						},
					},
				},
			},
		});
		expect(spec.meta.key).toBe('test.bundle');
	});

	it('throws when meta is incomplete', () => {
		expect(() =>
			defineModuleBundle({
				meta: { key: 'x', version: '0.1.0' } as never,
				routes: [],
				surfaces: {},
			} as never)
		).toThrow();
	});

	it('throws when surfaces lack verification', () => {
		expect(() =>
			defineModuleBundle({
				meta: { key: 'x', version: '0.1.0', title: 'X' },
				routes: [{ routeId: 'r', path: '/', defaultSurface: 's' }],
				surfaces: {
					s: {
						surfaceId: 's',
						kind: 'workbench',
						title: 'S',
						slots: [],
						layouts: [{ layoutId: 'l', root: { type: 'slot', slotId: 'p' } }],
						data: [],
						verification: { dimensions: {} } as never,
					},
				},
			} as never)
		).toThrow();
	});

	it('throws when verification dimension description is too short', () => {
		expect(() =>
			defineModuleBundle({
				meta: { key: 'x', version: '0.1.0', title: 'X' },
				routes: [{ routeId: 'r', path: '/', defaultSurface: 's' }],
				surfaces: {
					s: {
						surfaceId: 's',
						kind: 'workbench',
						title: 'S',
						slots: [],
						layouts: [{ layoutId: 'l', root: { type: 'slot', slotId: 'p' } }],
						data: [],
						verification: {
							dimensions: {
								guidance: 'N/A',
								density: 'Standard layout',
								dataDepth: 'Standard depth',
								control: 'Standard controls',
								media: 'Text-first',
								pace: 'Balanced',
								narrative: 'Top-down',
							},
						},
					},
				},
			} as never)
		).toThrow(/at least 10 characters/);
	});

	it('throws when layout references undeclared slot', () => {
		expect(() =>
			defineModuleBundle({
				meta: { key: 'x', version: '0.1.0', title: 'X' },
				routes: [{ routeId: 'r', path: '/', defaultSurface: 's' }],
				surfaces: {
					s: {
						surfaceId: 's',
						kind: 'workbench',
						title: 'S',
						slots: [
							{
								slotId: 'primary',
								role: 'primary',
								accepts: [],
								cardinality: 'one',
							},
						],
						layouts: [
							{
								layoutId: 'l',
								root: { type: 'slot', slotId: 'undeclared-slot' },
							},
						],
						data: [],
						verification: {
							dimensions: {
								guidance: 'Hints available for users',
								density: 'Standard layout options',
								dataDepth: 'Standard depth control',
								control: 'Standard controls',
								media: 'Text-first display',
								pace: 'Balanced pace',
								narrative: 'Top-down narrative',
							},
						},
					},
				},
			})
		).toThrow(/undeclared slot/);
	});

	it('accepts pm-workbench-style bundle with requires, actions, and layouts', () => {
		const spec = defineModuleBundle({
			meta: {
				key: 'pm.workbench',
				version: '0.1.0',
				title: 'PM Workbench',
				description: 'AI-native PM workbench',
				stability: 'experimental',
			},
			requires: [
				{ key: 'ai-chat', version: '1.0.0' },
				{ key: 'metering', version: '1.0.0' },
			],
			routes: [
				{
					routeId: 'pm-issue',
					path: '/operate/pm/issues/:issueId',
					defaultSurface: 'issue-workbench',
				},
			],
			surfaces: {
				'issue-workbench': {
					surfaceId: 'issue-workbench',
					kind: 'workbench',
					title: 'Issue Workbench',
					slots: [
						{
							slotId: 'primary',
							role: 'primary',
							accepts: ['entity-section', 'table', 'rich-doc'],
							cardinality: 'many',
							mutableByAi: true,
							mutableByUser: true,
						},
						{
							slotId: 'secondary',
							role: 'secondary',
							accepts: ['entity-section', 'table', 'timeline'],
							cardinality: 'many',
							mutableByAi: true,
							mutableByUser: true,
						},
					],
					layouts: [
						{
							layoutId: 'balanced-three-pane',
							root: {
								type: 'panel-group',
								direction: 'horizontal',
								persistKey: 'pm.issue.balanced',
								children: [
									{ type: 'slot', slotId: 'primary' },
									{
										type: 'panel-group',
										direction: 'vertical',
										children: [{ type: 'slot', slotId: 'secondary' }],
									},
								],
							},
						},
					],
					data: [
						{
							recipeId: 'issue-core',
							source: { kind: 'entity', entityType: 'pm.issue' },
							requestedDepth: 'detailed',
							hydrateInto: 'issue',
						},
					],
					actions: [
						{
							actionId: 'update-status',
							title: 'Update status',
							operationKey: 'pm.issue.updateStatus',
							placement: 'header',
						},
					],
					ai: {
						assistantSlotId: 'assistant',
						allowLayoutPatches: true,
						allowSlotInsertion: true,
						allowedSlots: ['assistant', 'inspector'],
						allowedNodeKinds: ['assistant-panel', 'entity-section', 'table'],
						plannerId: 'default',
						allowedPatchOps: ['insert-node', 'remove-node'],
						plannerPrompt: 'Help user with PM tasks',
					},
					verification: {
						dimensions: {
							guidance: 'Can reveal walkthrough notes.',
							density: 'Can select compact or dense layouts.',
							dataDepth: 'Controls issue relation hydration.',
							control: 'Shows advanced commands when allowed.',
							media: 'Supports text-first and visual modes.',
							pace: 'Maps to motion tokens and transitions.',
							narrative: 'Can order summary before evidence.',
						},
					},
				},
			},
		});
		expect(spec.meta.key).toBe('pm.workbench');
		expect(spec.requires).toHaveLength(2);
		expect(spec.surfaces['issue-workbench']?.actions).toHaveLength(1);
	});
});
