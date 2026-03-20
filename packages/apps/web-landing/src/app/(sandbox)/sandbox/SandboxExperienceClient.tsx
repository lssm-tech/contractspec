'use client';

import { WorkspaceProjectShellLayout } from '@contractspec/bundle.library/components/shell';
import { TemplateId } from '@contractspec/lib.example-shared-ui';
import { listExamples, listTemplates } from '@contractspec/module.examples';
import {
	FileText,
	GraduationCap,
	LayoutGrid,
	Play,
	Sparkles,
	TerminalSquare,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
	buildSandboxHref,
	resolveSandboxTemplateId,
} from './sandbox-config';

// Studio dependencies removed for public split
// import {
//   FloatingAssistant,
//   LearningCoach,
//   recordLearningEvent,
// } from '@contractspec/bundle.studio/presentation';

export type ExampleSandboxMode =
	| 'playground'
	| 'specs'
	| 'builder'
	| 'markdown'
	| 'evolution';

const TemplateShell = dynamic(
	() =>
		import('@contractspec/lib.example-shared-ui').then((m) => m.TemplateShell),
	{ ssr: false }
);

const MarkdownView = dynamic(
	() =>
		import('@contractspec/lib.example-shared-ui').then((m) => m.MarkdownView),
	{ ssr: false }
);

// const BuilderPanel = dynamic(
//   () => import('@contractspec/bundle.library').then((m) => m.BuilderPanel),
//   { ssr: false }
// );

const SpecEditorPanel = dynamic(
	() =>
		import('@contractspec/lib.example-shared-ui').then(
			(m) => m.SpecEditorPanel
		),
	{ ssr: false }
);

const EvolutionDashboard = dynamic(
	() =>
		import('@contractspec/lib.example-shared-ui').then(
			(m) => m.EvolutionDashboard
		),
	{ ssr: false }
);

const TodosTaskList = dynamic(
	() =>
		import(
			'@contractspec/bundle.library/components/templates/todos/TaskList'
		).then((m) => m.TaskList),
	{ ssr: false }
);

const MessagingWorkspace = dynamic(
	() =>
		import(
			'@contractspec/bundle.library/components/templates/messaging/MessagingWorkspace'
		).then((m) => m.MessagingWorkspace),
	{ ssr: false }
);

const RecipesExperience = dynamic(
	() =>
		import(
			'@contractspec/bundle.library/components/templates/recipes/RecipeList'
		).then((m) => m.RecipeList),
	{ ssr: false }
);

const SaasDashboard = dynamic(
	() =>
		import('@contractspec/example.saas-boilerplate').then(
			(m) => m.SaasDashboard
		),
	{ ssr: false }
);

const CrmDashboard = dynamic(
	() =>
		import('@contractspec/example.crm-pipeline').then((m) => m.CrmDashboard),
	{ ssr: false }
);

const DataGridShowcase = dynamic(
	() =>
		import('../../../../../../examples/data-grid-showcase/src/ui').then(
			(m) => m.DataGridShowcase
		),
	{ ssr: false }
);

const VisualizationShowcase = dynamic(
	() =>
		import('../../../../../../examples/visualization-showcase/src/ui').then(
			(m) => m.VisualizationShowcase
		),
	{ ssr: false }
);

const AgentDashboard = dynamic(
	() =>
		import('@contractspec/example.agent-console/ui').then(
			(m) => m.AgentDashboard
		),
	{ ssr: false }
);

const WorkflowDashboard = dynamic(
	() =>
		import('@contractspec/example.workflow-system/ui').then(
			(m) => m.WorkflowDashboard
		),
	{ ssr: false }
);

const MarketplaceDashboard = dynamic(
	() =>
		import('@contractspec/example.marketplace/ui').then(
			(m) => m.MarketplaceDashboard
		),
	{ ssr: false }
);

const IntegrationDashboard = dynamic(
	() =>
		import('@contractspec/example.integration-hub/ui').then(
			(m) => m.IntegrationDashboard
		),
	{ ssr: false }
);

const AnalyticsDashboard = dynamic(
	() =>
		import('@contractspec/example.analytics-dashboard').then(
			(m) => m.AnalyticsDashboard
		),
	{ ssr: false }
);

const AiChatAssistantDashboard = dynamic(
	() =>
		import('@contractspec/example.ai-chat-assistant').then(
			(m) => m.AiChatAssistantDashboard
		),
	{ ssr: false }
);

const PolicySafeKnowledgeAssistantDashboard = dynamic(
	() =>
		import('@contractspec/example.policy-safe-knowledge-assistant').then(
			(m) => m.PolicySafeKnowledgeAssistantDashboard
		),
	{ ssr: false }
);

type Mode = ExampleSandboxMode | 'learning';

// Studio components mocked/removed
const SpecEditorAdapter = (_props: unknown) => (
	<div>Spec Editor Unavailable in Public Demo</div>
);
// const StudioCanvasAdapter = (_props: unknown) => (
//   <div>Builder Unavailable in Public Demo</div>
// );

const CORE_MODES: readonly Mode[] = [
	'playground',
	'specs',
	'builder',
	'markdown',
	'evolution',
	'learning',
] as const;

const MODULES: {
	id: Mode;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
}[] = [
	{ id: 'playground', label: 'Playground', icon: Play },
	{ id: 'specs', label: 'Specs', icon: FileText },
	{ id: 'builder', label: 'Builder', icon: LayoutGrid },
	{ id: 'markdown', label: 'Markdown', icon: TerminalSquare },
	{ id: 'evolution', label: 'Evolution', icon: Sparkles },
	{ id: 'learning', label: 'Learning', icon: GraduationCap },
];

export default function SandboxExperienceClient() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const templates = useMemo(() => listTemplates(), []);
	const examples = useMemo(() => listExamples(), []);
	const exampleById = useMemo(
		() => new Map(examples.map((e) => [e.meta.key, e] as const)),
		[examples]
	);
	const templateIds = useMemo(
		() => new Set(templates.map((template) => template.id)),
		[templates]
	);
	const templateOptions = useMemo(
		() =>
			[...templates].sort((left, right) => {
				if (left.id === 'agent-console') return -1;
				if (right.id === 'agent-console') return 1;
				return left.name.localeCompare(right.name);
			}),
		[templates]
	);
	const templateFromUrl = resolveSandboxTemplateId(
		searchParams.get('template'),
		templateIds
	);

	const [templateId, setTemplateId] = useState<TemplateId>(templateFromUrl);
	const [mode, setMode] = useState<Mode>('playground');

	const getAllowedModes = (nextTemplateId: TemplateId): readonly Mode[] => {
		const example = exampleById.get(nextTemplateId);
		const exampleModes = example ? example.surfaces.sandbox.modes : CORE_MODES;
		return Array.from(new Set([...exampleModes, 'learning'] as const));
	};

	const allowedModes: readonly Mode[] = useMemo(() => {
		return getAllowedModes(templateId);
	}, [exampleById, templateId]);

	useEffect(() => {
		setTemplateId(templateFromUrl);
	}, [templateFromUrl]);

	useEffect(() => {
		if (allowedModes.includes(mode)) {
			return;
		}
		setMode(allowedModes[0] ?? 'playground');
	}, [allowedModes, mode]);

	useEffect(() => {
		if (templateId === templateFromUrl) {
			return;
		}
		const params = new URLSearchParams(searchParams.toString());
		if (templateId === 'agent-console') {
			params.delete('template');
		} else {
			params.set('template', templateId);
		}
		const query = params.toString();
		const href = query ? `${pathname}?${query}` : buildSandboxHref(templateId);
		router.replace(href, { scroll: false });
	}, [pathname, router, searchParams, templateFromUrl, templateId]);

	const displayName = useMemo(() => {
		const example = exampleById.get(templateId);
		return example?.meta.title ?? templateId;
	}, [exampleById, templateId]);

	const playground = useMemo(() => {
		switch (templateId) {
			case 'todos-app':
				return <TodosTaskList />;
			case 'messaging-app':
				return <MessagingWorkspace />;
			case 'recipe-app-i18n':
				return <RecipesExperience />;
			case 'saas-boilerplate':
				return <SaasDashboard />;
			case 'crm-pipeline':
				return <CrmDashboard />;
			case 'data-grid-showcase':
				return <DataGridShowcase />;
			case 'visualization-showcase':
				return <VisualizationShowcase />;
			case 'agent-console':
				return <AgentDashboard />;
			case 'workflow-system':
				return <WorkflowDashboard />;
			case 'marketplace':
				return <MarketplaceDashboard />;
			case 'integration-hub':
				return <IntegrationDashboard />;
			case 'analytics-dashboard':
				return <AnalyticsDashboard />;
			case 'ai-chat-assistant':
				return <AiChatAssistantDashboard />;
			case 'policy-safe-knowledge-assistant':
				return <PolicySafeKnowledgeAssistantDashboard />;
			default:
				return <MarkdownView templateId={templateId} />;
		}
	}, [templateId]);

	const main = useMemo(() => {
		switch (mode) {
			case 'playground':
				return (
					<TemplateShell
						title={displayName}
						description="Local runtime (in-browser) preview."
						// projectId="sandbox"
						showSaveAction={false}
					>
						{playground}
					</TemplateShell>
				);
			case 'specs':
				return (
					<SpecEditorPanel
						templateId={templateId}
						onLog={() => void 0}
						SpecEditor={SpecEditorAdapter}
					/>
				);
			// case 'builder':
			//   return (
			//     <BuilderPanel
			//       templateId={templateId}
			//       onLog={() => void 0}
			//       StudioCanvas={StudioCanvasAdapter}
			//     />
			//   );
			case 'markdown':
				return <MarkdownView templateId={templateId} />;
			case 'evolution':
				return (
					<EvolutionDashboard templateId={templateId} onLog={() => void 0} />
				);
			case 'learning':
				return (
					<div className="space-y-4">
						{/* Learning Coach removed for public version */}
						<div className="rounded border bg-gray-50 p-4 text-gray-500">
							Learning Coach unavailable in public demo.
						</div>
					</div>
				);
			default:
				return <MarkdownView templateId={templateId} />;
		}
	}, [mode, templateId, displayName, playground]);

	const moduleOptions = MODULES.filter((m) => allowedModes.includes(m.id));

	return (
		<WorkspaceProjectShellLayout
			title="ContractSpec Sandbox"
			subtitle="Unlogged local preview (no auth, no analytics)"
			workspaceSelect={{
				label: 'Workspace',
				value: 'sandbox',
				options: [{ value: 'sandbox', label: 'Sandbox' }],
				onChange: () => void 0,
			}}
			projectSelect={{
				label: 'Template',
				value: templateId,
				options: templateOptions.map((t) => ({ value: t.id, label: t.name })),
				onChange: (value: string) => {
					const nextTemplateId = resolveSandboxTemplateId(value, templateIds);
					setTemplateId(nextTemplateId);
					const nextModes = getAllowedModes(nextTemplateId);
					if (!nextModes.includes(mode)) {
						setMode(nextModes[0] ?? 'playground');
					}
				},
			}}
			environmentSelect={{
				label: 'Environment',
				value: 'local',
				options: [{ value: 'local', label: 'Local (in-browser)' }],
				onChange: () => void 0,
			}}
			modules={moduleOptions.map((m) => ({
				id: m.id,
				label: m.label,
				icon: <m.icon className="h-4 w-4" />,
			}))}
			activeModuleId={mode}
			onModuleChange={(next: string) => {
				// recordLearningEvent removed
				setMode(next as Mode);
			}}
			// assistant removed
		>
			{main}
		</WorkspaceProjectShellLayout>
	);
}
