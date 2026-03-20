import type {
	TemplateCategory,
	TemplateComplexity,
	TemplateDefinition,
	TemplateFilter,
	TemplateId,
} from '@contractspec/lib.example-shared-ui';
import { listExamples } from '../registry';

const PRESENTATIONS_BY_TEMPLATE: Record<string, string[]> = {
	'saas-boilerplate': [
		'saas-boilerplate.dashboard',
		'saas-boilerplate.project.list',
		'saas-boilerplate.billing.settings',
	],
	'crm-pipeline': ['crm-pipeline.dashboard', 'crm-pipeline.deal.pipeline'],
	'agent-console': [
		'agent-console.dashboard',
		'agent-console.agent.viewList',
		'agent-console.run.list',
		'agent-console.tool.list',
	],
	'workflow-system': [
		'workflow-system.dashboard',
		'workflow-system.definition.list',
		'workflow-system.instance.detail',
	],
	marketplace: [
		'marketplace.dashboard',
		'marketplace.product.catalog',
		'marketplace.order.list',
	],
	'integration-hub': [
		'integration-hub.dashboard',
		'integration-hub.connection.list',
		'integration-hub.sync.config',
	],
	'analytics-dashboard': [
		'analytics-dashboard.dashboard',
		'analytics-dashboard.list',
		'analytics-dashboard.query.builder',
	],
	'visualization-showcase': ['visualization-showcase.gallery'],
	'learning-journey-studio-onboarding': [
		'learning.journey.track_list',
		'learning.journey.track_detail',
		'learning.journey.progress_widget',
	],
	'learning-journey-platform-tour': [
		'learning.journey.track_list',
		'learning.journey.track_detail',
		'learning.journey.progress_widget',
	],
	'learning-journey-crm-onboarding': [
		'learning.journey.track_list',
		'learning.journey.track_detail',
		'learning.journey.progress_widget',
	],
	'learning-journey-duo-drills': [
		'learning.journey.track_list',
		'learning.journey.track_detail',
		'learning.journey.progress_widget',
	],
	'learning-journey-ambient-coach': [
		'learning.journey.track_list',
		'learning.journey.track_detail',
		'learning.journey.progress_widget',
	],
	'learning-journey-quest-challenges': [
		'learning.journey.track_list',
		'learning.journey.track_detail',
		'learning.journey.progress_widget',
	],
};

const GENERATED_TEMPLATE_REGISTRY: TemplateDefinition[] = listExamples()
	.filter((example) => example.meta.key !== 'agent-console')
	.map((example): TemplateDefinition => {
		const tags = [...(example.meta.tags ?? [])];
		const category: TemplateCategory =
			tags.some((tag) => tag.toLowerCase() === 'ai') ||
			tags.some((tag) => tag.toLowerCase() === 'assistant')
				? 'ai'
				: 'business';

		return {
			id: example.meta.key,
			name: example.meta.title ?? example.meta.key,
			description: example.meta.description ?? '',
			category,
			complexity: 'beginner',
			icon: '📦',
			features: [],
			tags,
			schema: { models: [], contracts: [] },
			components: { list: 'ExampleList', detail: 'ExampleDetail' },
			preview: {
				demoUrl: `/sandbox?template=${encodeURIComponent(example.meta.key)}`,
			},
			package: example.entrypoints.packageName,
			presentations: PRESENTATIONS_BY_TEMPLATE[example.meta.key] ?? [],
			renderTargets: ['react', 'markdown'],
		};
	});

export const TEMPLATE_REGISTRY: TemplateDefinition[] = [
	{
		id: 'todos-app',
		name: 'To-dos List App',
		description:
			'CRUD flows, filtering, priorities, and ceremonies for handing off work across crews.',
		category: 'productivity',
		complexity: 'beginner',
		icon: '✅',
		features: ['CRUD tasks', 'Filters', 'Categories', 'Search', 'Priorities'],
		tags: ['tasks', 'ops', 'starter'],
		schema: {
			models: ['Task', 'TaskCategory'],
			contracts: ['template.todos.crud'],
		},
		components: {
			list: 'TaskList',
			detail: 'TaskDetailPanel',
			form: 'TaskForm',
		},
		preview: {
			demoUrl: '/sandbox?template=todos-app',
		},
		docs: {
			quickstart: '/docs/templates/todos-app',
		},
	},
	{
		id: 'messaging-app',
		name: 'Messaging Application',
		description:
			'Conversation roster, optimistic sending, typing indicators, and delivery telemetry.',
		category: 'communication',
		complexity: 'intermediate',
		icon: '💬',
		features: [
			'Conversations',
			'Real-time feed',
			'Typing indicators',
			'Read receipts',
		],
		tags: ['messaging', 'realtime', 'ws'],
		schema: {
			models: ['Conversation', 'ConversationParticipant', 'Message'],
			contracts: ['template.messaging.core'],
		},
		components: {
			list: 'ConversationList',
			detail: 'MessageThread',
			form: 'MessageComposer',
		},
		preview: {
			demoUrl: '/sandbox?template=messaging-app',
		},
		docs: {
			quickstart: '/docs/templates/messaging-app',
		},
	},
	{
		id: 'recipe-app-i18n',
		name: 'Recipe App (i18n)',
		description:
			'Localized browsing experience with bilingual content, categories, and favorites.',
		category: 'content',
		complexity: 'intermediate',
		icon: '🍲',
		features: ['i18n', 'Favorites', 'Categories', 'Search', 'RTL-ready'],
		tags: ['content', 'i18n', 'localization'],
		schema: {
			models: [
				'RecipeCategory',
				'Recipe',
				'RecipeIngredient',
				'RecipeInstruction',
			],
			contracts: ['template.recipes.browse'],
		},
		components: {
			list: 'RecipeList',
			detail: 'RecipeDetail',
			form: 'RecipeForm',
		},
		preview: {
			demoUrl: '/sandbox?template=recipe-app-i18n',
		},
		docs: {
			quickstart: '/docs/templates/recipe-app-i18n',
		},
	},
	{
		id: 'agent-console',
		name: 'Agent Console',
		description:
			'Deterministic autonomous-agent walkthrough with seeded agents, tool registry, runs, metrics, and replayable proof.',
		category: 'ai',
		complexity: 'intermediate',
		icon: '🤖',
		features: [
			'Seeded autonomous agents',
			'Tool registry',
			'Run execution history',
			'Metrics',
			'Markdown and React views',
		],
		tags: ['ai', 'agents', 'autonomous', 'meetup', 'sandbox'],
		schema: {
			models: ['Agent', 'Tool', 'Run'],
			contracts: [
				'agent-console.agent.list',
				'agent-console.agent.create',
				'agent-console.run.execute',
			],
		},
		components: {
			list: 'AgentListView',
			detail: 'RunListView',
			form: 'CreateAgentModal',
		},
		preview: {
			demoUrl: '/sandbox?template=agent-console',
		},
		package: '@contractspec/example.agent-console',
		presentations: PRESENTATIONS_BY_TEMPLATE['agent-console'] ?? [],
		renderTargets: ['react', 'markdown'],
	},
	...GENERATED_TEMPLATE_REGISTRY,
];

export function listTemplates(filter?: TemplateFilter): TemplateDefinition[] {
	if (!filter) return TEMPLATE_REGISTRY;
	return TEMPLATE_REGISTRY.filter((template) => {
		if (filter.category && template.category !== filter.category) {
			return false;
		}
		if (filter.complexity && template.complexity !== filter.complexity) {
			return false;
		}
		if (
			filter.tag &&
			!template.tags.some(
				(tag: string) => tag.toLowerCase() === filter.tag?.toLowerCase()
			)
		) {
			return false;
		}
		return true;
	});
}

export function getTemplate(id: TemplateId): TemplateDefinition | undefined {
	return TEMPLATE_REGISTRY.find((template) => template.id === id);
}

/**
 * Get templates that use a specific cross-cutting module
 */
export function getTemplatesByModule(
	modulePackage: string
): TemplateDefinition[] {
	return TEMPLATE_REGISTRY.filter((template) =>
		template.usesModules?.includes(modulePackage)
	);
}

/**
 * Get all templates with external packages (clonable via Git)
 */
export function getClonableTemplates(): TemplateDefinition[] {
	return TEMPLATE_REGISTRY.filter((template) => !!template.package);
}
