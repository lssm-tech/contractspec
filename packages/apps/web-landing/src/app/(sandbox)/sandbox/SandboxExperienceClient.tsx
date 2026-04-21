'use client';

import { WorkspaceProjectShellLayout } from '@contractspec/bundle.library/components/shell';
import type { TemplateId } from '@contractspec/lib.example-shared-ui';
import { listExamples } from '@contractspec/module.examples/catalog';
import {
	ExampleWebPreview,
	listTemplates,
	TemplateRuntimeProvider,
} from '@contractspec/module.examples/runtime';
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
import { buildSandboxHref, resolveSandboxTemplateId } from './sandbox-config';
import { hasRichSandboxPreview } from './sandbox-preview';

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

const SANDBOX_PROJECT_ID = 'sandbox';

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
	const templateById = useMemo(
		() =>
			new Map(templates.map((template) => [template.id, template] as const)),
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
		const template = templateById.get(templateId);
		return example?.meta.title ?? template?.name ?? templateId;
	}, [exampleById, templateById, templateId]);

	const playground = useMemo(() => {
		switch (templateId) {
			case 'todos-app':
				return (
					<TemplateShell
						title={displayName}
						description="Local runtime (in-browser) preview."
						showSaveAction={false}
					>
						<TodosTaskList />
					</TemplateShell>
				);
			case 'messaging-app':
				return (
					<TemplateShell
						title={displayName}
						description="Local runtime (in-browser) preview."
						showSaveAction={false}
					>
						<MessagingWorkspace />
					</TemplateShell>
				);
			case 'recipe-app-i18n':
				return (
					<TemplateShell
						title={displayName}
						description="Local runtime (in-browser) preview."
						showSaveAction={false}
					>
						<RecipesExperience />
					</TemplateShell>
				);
			default:
				return (
					<ExampleWebPreview exampleKey={templateId} title={displayName} />
				);
		}
	}, [displayName, templateId]);

	const main = useMemo(() => {
		switch (mode) {
			case 'playground':
				return playground;
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
	}, [mode, templateId, playground]);

	const moduleOptions = MODULES.filter((m) => allowedModes.includes(m.id));
	const shouldInitializeRuntime =
		mode !== 'playground' || hasRichSandboxPreview(templateId);

	return (
		<WorkspaceProjectShellLayout
			title="ContractSpec Sandbox"
			subtitle="Unlogged local preview (no auth, no analytics)"
			workspaceSelect={{
				label: 'Workspace',
				value: SANDBOX_PROJECT_ID,
				options: [{ value: SANDBOX_PROJECT_ID, label: 'Sandbox' }],
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
			{shouldInitializeRuntime ? (
				<TemplateRuntimeProvider
					templateId={templateId}
					projectId={SANDBOX_PROJECT_ID}
				>
					{main}
				</TemplateRuntimeProvider>
			) : (
				main
			)}
		</WorkspaceProjectShellLayout>
	);
}
