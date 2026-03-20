import { defineModuleBundle } from '@contractspec/lib.surface-runtime/spec';

export const PmWorkbenchBundle = defineModuleBundle({
	meta: {
		key: 'pm.workbench',
		version: '0.1.0',
		title: 'PM Workbench',
		description:
			'AI-native PM workbench for relation-rich issues and saved views',
		owners: ['team-pm-platform'],
		tags: ['pm', 'issues', 'workbench', 'ai-native'],
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

	entities: {
		entityTypes: {
			'pm.issue': {
				entityType: 'pm.issue',
				defaultSurfaceId: 'issue-workbench',
				detailBlueprints: ['balanced-three-pane', 'dense-ops-mode'],
				supportedViews: [
					'minimal-summary',
					'balanced-detail',
					'dense-workbench',
				],
				sectionsFromSchema: true,
				fieldsFromSchema: true,
				relationPanels: ['relations', 'meeting-evidence', 'decision-trail'],
			},
		},
		fieldKinds: {
			text: { fieldKind: 'text', viewer: 'text-viewer', editor: 'text-editor' },
			number: {
				fieldKind: 'number',
				viewer: 'number-viewer',
				editor: 'number-editor',
			},
			date: { fieldKind: 'date', viewer: 'date-viewer', editor: 'date-editor' },
			select: {
				fieldKind: 'select',
				viewer: 'select-viewer',
				editor: 'select-editor',
			},
		},
		sectionKinds: {
			overview: { sectionKind: 'overview', renderer: 'section-overview' },
			details: { sectionKind: 'details', renderer: 'section-details' },
			relations: { sectionKind: 'relations', renderer: 'section-relations' },
			activity: { sectionKind: 'activity', renderer: 'section-activity' },
		},
		viewKinds: {
			'minimal-summary': {
				viewKind: 'minimal-summary',
				renderer: 'view-minimal',
			},
			'balanced-detail': {
				viewKind: 'balanced-detail',
				renderer: 'view-balanced',
				defaultLayoutId: 'balanced-three-pane',
			},
			'dense-workbench': {
				viewKind: 'dense-workbench',
				renderer: 'view-dense',
				defaultLayoutId: 'dense-ops-mode',
			},
		},
	},

	surfaces: {
		'issue-workbench': {
			surfaceId: 'issue-workbench',
			kind: 'workbench',
			title: 'Issue Workbench',
			slots: [
				{
					slotId: 'header',
					role: 'header',
					accepts: ['action-bar'],
					cardinality: 'many',
				},
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
				{
					slotId: 'assistant',
					role: 'assistant',
					accepts: ['assistant-panel', 'chat-thread'],
					cardinality: 'many',
					mutableByAi: true,
					mutableByUser: true,
				},
				{
					slotId: 'inspector',
					role: 'inspector',
					accepts: ['entity-field', 'relation-graph', 'custom-widget'],
					cardinality: 'many',
					mutableByAi: true,
					mutableByUser: true,
				},
			],

			layouts: [
				{
					layoutId: 'balanced-three-pane',
					title: 'Balanced 3-pane',
					root: {
						type: 'panel-group',
						direction: 'horizontal',
						persistKey: 'pm.issue.balanced-three-pane',
						children: [
							{ type: 'slot', slotId: 'primary' },
							{
								type: 'panel-group',
								direction: 'vertical',
								persistKey: 'pm.issue.right-stack',
								children: [
									{ type: 'slot', slotId: 'secondary' },
									{ type: 'slot', slotId: 'assistant' },
								],
							},
							{ type: 'slot', slotId: 'inspector' },
						],
					},
				},
				{
					layoutId: 'dense-ops-mode',
					title: 'Dense Ops Mode',
					when: (ctx) => ctx.preferences.density === 'dense',
					root: {
						type: 'panel-group',
						direction: 'horizontal',
						persistKey: 'pm.issue.dense-ops-mode',
						children: [
							{ type: 'slot', slotId: 'primary' },
							{ type: 'slot', slotId: 'secondary' },
							{ type: 'slot', slotId: 'assistant' },
							{ type: 'slot', slotId: 'inspector' },
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
				{
					recipeId: 'issue-relations',
					source: { kind: 'data-view', key: 'pm.issue.relations' },
					requestedDepth: 'detailed',
					hydrateInto: 'relations',
				},
				{
					recipeId: 'issue-activity',
					source: { kind: 'data-view', key: 'pm.issue.activity' },
					requestedDepth: 'standard',
					hydrateInto: 'activity',
				},
			],

			actions: [
				{
					actionId: 'update-status',
					title: 'Update status',
					operationKey: 'pm.issue.updateStatus',
					placement: 'header',
				},
				{
					actionId: 'create-sub-issue',
					title: 'Create sub-issue',
					operationKey: 'pm.issue.createSubIssue',
					placement: 'context',
				},
			],

			ai: {
				assistantSlotId: 'assistant',
				allowLayoutPatches: true,
				allowSlotInsertion: true,
				allowedSlots: ['assistant', 'inspector', 'secondary'],
				allowedNodeKinds: [
					'assistant-panel',
					'chat-thread',
					'entity-section',
					'table',
					'timeline',
					'relation-graph',
					'custom-widget',
				],
			},

			verification: {
				dimensions: {
					guidance:
						'Can reveal walkthrough notes, field help, and AI explanations.',
					density: 'Can select compact, balanced, or dense multi-pane layouts.',
					dataDepth:
						'Controls issue relation hydration, activity size, and inspector depth.',
					control:
						'Shows advanced commands and raw config tabs only when allowed.',
					media:
						'Supports text-first detail, visual graph, and hybrid assistant modes.',
					pace: 'Maps to motion tokens and confirmation behavior.',
					narrative:
						'Can order issue summary before or after evidence/activity sections.',
				},
			},
		},
	},
});
