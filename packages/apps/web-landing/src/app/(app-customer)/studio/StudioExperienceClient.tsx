'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Boxes,
  FileText,
  GraduationCap,
  LayoutGrid,
  PlugZap,
  Rocket,
  Sparkles,
} from 'lucide-react';

import {
  type DeploymentHistoryItem,
  DeploymentPanel,
} from '@lssm/bundle.contractspec-studio/presentation/components/studio/molecules/DeploymentPanel';
import {
  SpecEditor,
  type SpecEditorProps,
} from '@lssm/bundle.contractspec-studio/presentation/components/studio/organisms/SpecEditor';
import type { SpecPreviewArtifacts } from '@lssm/bundle.contractspec-studio/presentation/components/studio/organisms/SpecPreview';
import { StudioProjectCard } from '@lssm/bundle.contractspec-studio/presentation/components/studio/molecules/StudioProjectCard';
import type { CanvasState } from '@lssm/bundle.contractspec-studio/modules/visual-builder';
import { StudioCanvas } from '@lssm/bundle.contractspec-studio/presentation/components/studio/organisms/StudioCanvas';
import { StudioProjectList } from '@lssm/bundle.contractspec-studio/presentation/components/studio/organisms/StudioProjectList';
import { useAuthContext } from '@lssm/bundle.contractspec-studio/presentation/providers/auth';
import {
  useStudioProjects,
  useStudioWorkspaces,
} from '@lssm/bundle.contractspec-studio/presentation/hooks/studio';
import { useDeployStudioProject } from '@lssm/bundle.contractspec-studio/presentation/hooks/studio/mutations/useDeployProject';
import {
  WorkspaceProjectShellLayout,
  IntegrationMarketplace,
  EvolutionDashboard,
  FloatingAssistant,
  LearningCoach,
  recordLearningEvent,
} from '@lssm/bundle.contractspec-studio/presentation/components';

const SAMPLE_PROJECTS = [
  {
    id: 'proj-ops',
    workspaceId: 'ws-demo',
    name: 'Ops Playbook',
    description: 'Dispatching, approvals, intent scans.',
    tier: 'PROFESSIONAL',
    deploymentMode: 'DEDICATED',
    specCount: 18,
    overlayCount: 6,
    lastDeploymentAt: new Date().toISOString(),
  },
  {
    id: 'proj-coliving',
    workspaceId: 'ws-demo',
    name: 'Coliving Studio',
    description: 'Residents, subsidies, and lifecycle rituals.',
    tier: 'ENTERPRISE',
    deploymentMode: 'DEDICATED',
    specCount: 24,
    overlayCount: 9,
    lastDeploymentAt: new Date(Date.now() - 86400000).toISOString(),
  },
] as const;

const SAMPLE_CANVAS: CanvasState = {
  id: 'canvas-demo',
  projectId: 'proj-ops',
  versions: [],
  nodes: [
    {
      id: 'hero',
      type: 'HeroSection',
      props: {
        title: 'Field dispatch',
        subtitle: 'Quote → Deposit → Job → Invoice',
      },
      children: [
        {
          id: 'cta',
          type: 'Button',
          props: { label: 'Book a crew', variant: 'primary' },
        },
      ],
    },
    {
      id: 'timeline',
      type: 'Timeline',
      props: { steps: 4 },
    },
  ],
  updatedAt: new Date().toISOString(),
};

const SAMPLE_SPEC = `contractSpec("ops.dispatch.v1", {
  goal: "Coordinate leads to crews with guardrails",
  transport: {
    gql: { field: "dispatchLead" }
  },
  io: {
    input: {
      leadId: "string",
      requestedSlot: "ISO8601",
      constraints: "array"
    },
    output: {
      jobId: "string",
      slot: "ISO8601",
      approvals: "array"
    }
  }
});`;

const SAMPLE_DEPLOYMENTS: DeploymentHistoryItem[] = [
  {
    id: 'dep-1',
    environment: 'DEVELOPMENT',
    status: 'DEPLOYED',
    version: '2025.03.01-dev',
    url: 'https://dev.ops.contractspec.run',
    deployedAt: new Date().toISOString(),
  },
  {
    id: 'dep-2',
    environment: 'STAGING',
    status: 'DEPLOYED',
    version: '2025.02.27-stg',
    url: 'https://staging.ops.contractspec.run',
    deployedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const MODULES = [
  { id: 'projects', label: 'Projects', icon: Boxes },
  { id: 'canvas', label: 'Canvas', icon: LayoutGrid },
  { id: 'specs', label: 'Specs', icon: FileText },
  { id: 'deploy', label: 'Deploy', icon: Rocket },
  { id: 'integrations', label: 'Integrations', icon: PlugZap },
  { id: 'evolution', label: 'Evolution', icon: Sparkles },
  { id: 'learning', label: 'Learning', icon: GraduationCap },
] as const;

export default function StudioExperienceClient() {
  const [moduleId, setModuleId] =
    useState<(typeof MODULES)[number]['id']>('projects');
  const [selectedWorkspaceId, setSelectedWorkspaceId] =
    useState<string>('ws-demo');
  const [selectedNode, setSelectedNode] = useState<string | undefined>();
  const [specText, setSpecText] = useState(SAMPLE_SPEC);
  const [selectedProjectId, setSelectedProjectId] =
    useState<string>('proj-ops');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [specType, setSpecType] = useState<SpecEditorProps['type']>('WORKFLOW');
  const [specArtifacts, setSpecArtifacts] = useState<
    SpecPreviewArtifacts | undefined
  >(undefined);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isAuthenticated, organization } = useAuthContext();
  const previewMode = !isAuthenticated;
  const { data: studioWorkspacesData } = useStudioWorkspaces({
    enabled: isAuthenticated,
  });
  const workspaces = studioWorkspacesData?.myStudioWorkspaces ?? [];
  const {
    data: studioProjectsData,
    isLoading: projectsLoading,
    refetch: refetchProjects,
  } = useStudioProjects({
    workspaceId: selectedWorkspaceId,
    enabled: isAuthenticated,
  });
  const deployProjectMutation = useDeployStudioProject();
  const projects = studioProjectsData?.myStudioProjects ?? [];

  const pushFeedback = (message: string, duration = 3000) => {
    setFeedback(message);
    if (feedbackTimer.current) {
      clearTimeout(feedbackTimer.current);
    }
    feedbackTimer.current = setTimeout(() => {
      setFeedback(null);
      feedbackTimer.current = null;
    }, duration);
  };

  const handleSampleAction = (action: string, projectId: string) => {
    pushFeedback(`${action} action triggered for project ${projectId}.`);
  };

  useEffect(() => {
    if (previewMode) {
      setSelectedWorkspaceId('ws-demo');
      setSelectedProjectId(SAMPLE_PROJECTS[0].id);
      return;
    }
    if (workspaces.length) {
      setSelectedWorkspaceId((current) => current || workspaces[0]!.id);
    }
    if (!projects.length) {
      return;
    }
    setSelectedProjectId((current) => {
      if (current && projects.some((project) => project.id === current)) {
        return current;
      }
      return projects[0].id;
    });
  }, [previewMode, projects, workspaces]);

  const activeProject = useMemo(() => {
    if (previewMode) {
      return (
        SAMPLE_PROJECTS.find((project) => project.id === selectedProjectId) ??
        SAMPLE_PROJECTS[0]
      );
    }
    return (
      projects.find((project) => project.id === selectedProjectId) ??
      projects[0]
    );
  }, [previewMode, projects, selectedProjectId]);

  useEffect(() => {
    if (previewMode) {
      setSpecType('WORKFLOW');
      return;
    }
    if (
      activeProject &&
      'specs' in activeProject &&
      activeProject.specs &&
      activeProject.specs.length > 0
    ) {
      const nextType = activeProject.specs[0]?.type;
      const validTypes: SpecEditorProps['type'][] = [
        'CAPABILITY',
        'DATAVIEW',
        'WORKFLOW',
        'POLICY',
        'COMPONENT',
      ];
      if (
        nextType &&
        validTypes.includes(nextType as SpecEditorProps['type'])
      ) {
        setSpecType(nextType as SpecEditorProps['type']);
      }
    }
  }, [previewMode, activeProject]);

  useEffect(() => {
    setSpecArtifacts(undefined);
    if (previewMode) {
      setSpecText(SAMPLE_SPEC);
      return;
    }
    setSpecText('');
  }, [previewMode, selectedProjectId]);

  const deploymentHistory = useMemo<DeploymentHistoryItem[]>(() => {
    if (previewMode) {
      return SAMPLE_DEPLOYMENTS;
    }
    if (!activeProject || !('deployments' in activeProject)) {
      return [];
    }
    return (activeProject.deployments ?? []).map((deployment) => {
      const deploymentWithVersion = deployment as {
        id: string;
        environment?: string;
        status?: string;
        version?: string;
        url?: string | null;
        deployedAt?: string | null;
      };
      return {
        id: deployment.id,
        environment: (deployment.environment ??
          'DEVELOPMENT') as DeploymentHistoryItem['environment'],
        status: (deployment.status ??
          'PENDING') as DeploymentHistoryItem['status'],
        version:
          deploymentWithVersion.version &&
          typeof deploymentWithVersion.version === 'string'
            ? deploymentWithVersion.version
            : deployment.id,
        url: deploymentWithVersion.url ?? null,
        deployedAt: deploymentWithVersion.deployedAt ?? null,
      };
    });
  }, [previewMode, activeProject]);

  const canvasState = useMemo<CanvasState>(() => {
    return {
      ...SAMPLE_CANVAS,
      projectId: activeProject?.id ?? SAMPLE_CANVAS.projectId,
      updatedAt: new Date().toISOString(),
    };
  }, [activeProject?.id]);

  const specMetadata = useMemo(() => {
    if (previewMode) {
      return { owner: 'ops.core', version: '1.0.0' };
    }
    const specsCount =
      activeProject && 'specs' in activeProject && activeProject.specs
        ? activeProject.specs.length
        : 0;
    const version =
      activeProject &&
      'specs' in activeProject &&
      activeProject.specs &&
      activeProject.specs.length > 0 &&
      'version' in activeProject.specs[0] &&
      activeProject.specs[0].version
        ? activeProject.specs[0].version
        : '1.0.0';
    return {
      project: activeProject?.name,
      specs: specsCount,
      version,
    };
  }, [previewMode, activeProject]);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) {
        clearTimeout(feedbackTimer.current);
      }
    };
  }, []);

  const handleProjectNavigation = (
    projectId: string,
    destination?: (typeof MODULES)[number]['id']
  ) => {
    setSelectedProjectId(projectId);
    if (destination) {
      setModuleId(destination);
    }
  };

  const handleProjectArchive = (projectId: string) => {
    pushFeedback(`Archive requested for project ${projectId}.`);
  };

  const handleDeploy = async (
    environment: DeploymentHistoryItem['environment']
  ) => {
    if (previewMode || !activeProject?.id) {
      pushFeedback('Sign in to deploy via Studio.');
      return;
    }
    try {
      await deployProjectMutation.mutateAsync({
        projectId: activeProject.id,
        environment,
      });
      pushFeedback(
        `Deployment to ${environment.toLowerCase()} queued successfully.`
      );
      await refetchProjects();
    } catch (error) {
      pushFeedback(
        error instanceof Error ? error.message : 'Failed to deploy project.'
      );
    }
  };

  const handleRollback = (deploymentId: string) => {
    if (previewMode) {
      pushFeedback('Sign in to rollback deployments.');
      return Promise.resolve();
    }
    pushFeedback(`Rollback requested for deployment ${deploymentId}.`);
    return Promise.resolve();
  };

  const handleSpecSave = () => {
    if (previewMode) {
      pushFeedback('Sign in to save specs to Studio.');
      return Promise.resolve();
    }
    pushFeedback('Spec saved successfully!');
    return Promise.resolve();
  };

  const handleSpecValidate = () => {
    if (previewMode) {
      pushFeedback('Sign in to run validations.');
      return Promise.resolve();
    }
    pushFeedback('Spec validated successfully!');
    return Promise.resolve();
  };

  const handleSpecPreview = () => {
    setSpecArtifacts({
      schema: specText,
      validation: specText.includes('TODO')
        ? ['Remove TODO placeholders before deploying.']
        : undefined,
    });
    pushFeedback('Preview generated.');
    return Promise.resolve();
  };

  const handleCanvasDraft = () => {
    if (previewMode) {
      pushFeedback('Sign in to save canvas drafts.');
      return Promise.resolve();
    }
    pushFeedback('Canvas draft saved.');
    return Promise.resolve();
  };

  const handleCanvasDeploy = () => {
    if (previewMode) {
      pushFeedback('Sign in to deploy canvas changes.');
      return Promise.resolve();
    }
    pushFeedback('Canvas deployed.');
    return Promise.resolve();
  };

  const handleCanvasUndo = () => {
    if (previewMode) {
      pushFeedback('Sign in to use undo history.');
      return Promise.resolve();
    }
    pushFeedback('Canvas reverted to previous version.');
    return Promise.resolve();
  };

  const tabContent = useMemo(() => {
    switch (moduleId) {
      case 'projects': {
        if (previewMode) {
          return (
            <div className="grid gap-4 md:grid-cols-2">
              {SAMPLE_PROJECTS.map((project) => (
                <StudioProjectCard
                  key={project.id}
                  project={project}
                  onDeploy={(id) => handleSampleAction('Deploy', id)}
                  onEdit={(id) => {
                    handleSampleAction('Edit', id);
                    handleProjectNavigation(id, 'specs');
                  }}
                  onArchive={(id) => handleSampleAction('Archive', id)}
                />
              ))}
            </div>
          );
        }
        if (projectsLoading) {
          return (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="border-border bg-muted/30 h-36 animate-pulse rounded-xl border border-dashed"
                />
              ))}
            </div>
          );
        }
        return (
          <StudioProjectList
            workspaceId={selectedWorkspaceId}
            onDeploy={(projectId) =>
              handleProjectNavigation(projectId, 'deploy')
            }
            onEdit={(projectId) => handleProjectNavigation(projectId, 'specs')}
            onArchive={handleProjectArchive}
            emptyState={
              <div className="space-y-2">
                <p className="text-lg font-semibold">No Studio projects yet</p>
                <p className="text-muted-foreground text-sm">
                  Start by installing a template from the sandbox or create a
                  new project via the API.
                </p>
              </div>
            }
          />
        );
      }
      case 'canvas':
        return (
          <StudioCanvas
            state={canvasState}
            selectedNodeId={selectedNode}
            onSelectNode={(nodeId) => {
              setSelectedNode(nodeId);
              pushFeedback(`Selected node: ${nodeId}`, 2000);
            }}
            onSaveDraft={handleCanvasDraft}
            onDeploy={handleCanvasDeploy}
            onUndo={handleCanvasUndo}
          />
        );
      case 'specs':
        return (
          <SpecEditor
            projectId={activeProject?.id ?? SAMPLE_CANVAS.projectId}
            type={specType}
            content={specText}
            metadata={specMetadata}
            onChange={setSpecText}
            onTypeChange={(nextType) => nextType && setSpecType(nextType)}
            onValidate={handleSpecValidate}
            onSave={handleSpecSave}
            onPreview={handleSpecPreview}
            previewArtifacts={specArtifacts}
          />
        );
      case 'deploy':
        return (
          <DeploymentPanel
            projectId={activeProject?.id ?? SAMPLE_CANVAS.projectId}
            deployments={deploymentHistory}
            onDeploy={handleDeploy}
            onRollback={handleRollback}
            isDeploying={deployProjectMutation.isPending}
          />
        );
      case 'integrations':
        return (
          <IntegrationMarketplace
            integrations={[
              {
                id: 'int-github',
                provider: 'GITHUB',
                name: 'GitHub (Repo linking)',
                category: 'storage',
                enabled: true,
                status: 'connected',
              },
              {
                id: 'int-notion',
                provider: 'NOTION',
                name: 'Notion (Knowledge)',
                category: 'knowledge',
                enabled: false,
                status: 'disconnected',
              },
            ]}
            onToggle={() => pushFeedback('Connect/disconnect is coming next.')}
            onConfigure={() => pushFeedback('Settings UI is coming next.')}
          />
        );
      case 'evolution':
        return <EvolutionDashboard templateId="todos-app" onLog={() => void 0} />;
      case 'learning':
        return (
          <div className="space-y-4">
            <LearningCoach
              mode="studio"
              onNavigateModule={(next: string) =>
                setModuleId(next as (typeof MODULES)[number]['id'])
              }
            />
          </div>
        );
      default:
        return null;
    }
  }, [
    moduleId,
    previewMode,
    projectsLoading,
    organization?.id,
    selectedNode,
    canvasState,
    activeProject?.id,
    deploymentHistory,
    specText,
    specMetadata,
    specType,
    specArtifacts,
    deployProjectMutation.isPending,
  ]);

  const handleModuleChange = (next: string) => {
    recordLearningEvent({
      name: `studio.module.opened:${next}`,
      ts: Date.now(),
    });
    setModuleId(next as (typeof MODULES)[number]['id']);
  };

  return (
    <WorkspaceProjectShellLayout
      title="ContractSpec Studio"
      subtitle={
        previewMode
          ? 'Preview mode (no auth, no persistence)'
          : organization?.name ?? 'Studio'
      }
      workspaceSelect={{
        label: 'Workspace',
        value: previewMode
          ? 'ws-demo'
          : selectedWorkspaceId || workspaces[0]?.id || '',
        options: previewMode
          ? [{ value: 'ws-demo', label: 'Demo workspace' }]
          : workspaces.map((ws) => ({ value: ws.id, label: ws.name })),
        onChange: (value: string) => {
          recordLearningEvent({
            name: 'studio.workspace.selected',
            ts: Date.now(),
            payload: { workspaceId: value },
          });
          setSelectedWorkspaceId(value);
        },
        placeholder: 'Select workspace',
      }}
      projectSelect={{
        label: 'Project',
        value: selectedProjectId,
        options: (previewMode ? SAMPLE_PROJECTS : projects).map((p) => ({
          value: p.id,
          label: p.name,
        })),
        onChange: (value: string) => {
          recordLearningEvent({
            name: 'studio.project.selected',
            ts: Date.now(),
            payload: { projectId: value },
          });
          setSelectedProjectId(value);
        },
        placeholder: 'Select project',
      }}
      environmentSelect={{
        label: 'Environment',
        value: 'DEVELOPMENT',
        options: [
          { value: 'DEVELOPMENT', label: 'Development' },
          { value: 'STAGING', label: 'Staging' },
          { value: 'PRODUCTION', label: 'Production' },
        ],
        onChange: () => {
          pushFeedback('Environment picker will be wired into modules next.');
        },
      }}
      modules={MODULES.map((m) => ({
        id: m.id,
        label: m.label,
        icon: <m.icon className="h-4 w-4" />,
      }))}
      activeModuleId={moduleId}
      onModuleChange={handleModuleChange}
      headerRight={
        previewMode ? (
          <Link href="/login" className="text-sm font-semibold underline">
            Sign in
          </Link>
        ) : (
          <Link href="/studio/features" className="text-sm underline">
            Studio features
          </Link>
        )
      }
      assistant={
        <FloatingAssistant
          context={{
            mode: 'studio',
            lifecycleEnabled: !previewMode,
            templateId: 'todos-app',
          }}
        />
      }
    >
      {feedback ? (
        <div className="text-foreground mb-4 rounded-xl border border-violet-500/50 bg-violet-500/10 px-4 py-3 text-sm">
          {feedback}
        </div>
      ) : null}
      {tabContent}
    </WorkspaceProjectShellLayout>
  );
}
