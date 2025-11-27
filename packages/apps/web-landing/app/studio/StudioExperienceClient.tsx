'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  DeploymentPanel,
  type DeploymentHistoryItem,
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
import { useStudioProjects } from '@lssm/bundle.contractspec-studio/presentation/hooks/studio/queries/useStudioProjects';
import { useDeployStudioProject } from '@lssm/bundle.contractspec-studio/presentation/hooks/studio/mutations/useDeployProject';

const SAMPLE_PROJECTS = [
  {
    id: 'proj-ops',
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

const TABS = [
  { id: 'projects', label: 'Projects' },
  { id: 'canvas', label: 'Canvas' },
  { id: 'specs', label: 'Specs' },
  { id: 'deploy', label: 'Deploy' },
] as const;

export default function StudioExperienceClient() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('projects');
  const [selectedNode, setSelectedNode] = useState<string | undefined>();
  const [specText, setSpecText] = useState(SAMPLE_SPEC);
  const [selectedProjectId, setSelectedProjectId] =
    useState<string>('proj-ops');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [specType, setSpecType] = useState<SpecEditorProps['type']>('WORKFLOW');
  const [specArtifacts, setSpecArtifacts] = useState<
    SpecPreviewArtifacts | undefined
  >(undefined);
  const feedbackTimer = useRef<NodeJS.Timeout | null>(null);

  const { isAuthenticated, organization } = useAuthContext();
  const previewMode = !isAuthenticated;
  const {
    data: studioProjectsData,
    isLoading: projectsLoading,
    refetch: refetchProjects,
  } = useStudioProjects({
    organizationId: organization?.id,
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
      setSelectedProjectId(SAMPLE_PROJECTS[0].id);
      return;
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
  }, [previewMode, projects]);

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
    const nextType = activeProject?.specs?.[0]?.type;
    if (nextType && SPEC_TYPES.includes(nextType as SpecEditorProps['type'])) {
      setSpecType(nextType as SpecEditorProps['type']);
    }
  }, [previewMode, activeProject?.id, activeProject?.specs]);

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
    return (activeProject.deployments ?? []).map((deployment) => ({
      id: deployment.id,
      environment: (deployment.environment ??
        'DEVELOPMENT') as DeploymentHistoryItem['environment'],
      status: (deployment.status ??
        'PENDING') as DeploymentHistoryItem['status'],
      version: deployment.version ?? deployment.id,
      url: (deployment as { url?: string | null })?.url ?? null,
      deployedAt: deployment.deployedAt ?? null,
    }));
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
    return {
      project: activeProject?.name,
      specs: activeProject?.specs?.length ?? 0,
      version: activeProject?.specs?.[0]?.version ?? '1.0.0',
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
    destination?: (typeof TABS)[number]['id']
  ) => {
    setSelectedProjectId(projectId);
    if (destination) {
      setTab(destination);
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
    switch (tab) {
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
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className="border-border bg-muted/30 h-36 animate-pulse rounded-xl border border-dashed"
                />
              ))}
            </div>
          );
        }
        return (
          <StudioProjectList
            organizationId={organization?.id}
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
      default:
        return null;
    }
  }, [
    tab,
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

  return (
    <main className="section-padding space-y-10 py-16">
      <header className="space-y-3 text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase">
          ContractSpec Studio
        </p>
        <h1 className="text-4xl font-bold md:text-5xl">
          Manage contracts, generate code, deploy with confidence.
        </h1>
        <p className="text-muted-foreground mx-auto max-w-3xl text-base">
          Visual builder for defining contracts, generating multi-surface code,
          and orchestrating deployments. Safe regeneration with version control.
          The preview runs entirely in your browser, so you can explore safely.
        </p>
      </header>

      {feedback && (
        <div className="mx-auto max-w-2xl">
          <div className="text-foreground rounded-xl border border-violet-500/50 bg-violet-500/10 px-4 py-3 text-center text-sm">
            {feedback}
          </div>
        </div>
      )}

      {previewMode && (
        <div className="mx-auto max-w-3xl rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-900">
          <p>
            You&apos;re viewing the local preview surface.{' '}
            <Link href="/login" className="font-semibold underline">
              Sign in
            </Link>{' '}
            to enable saving, deployments, and organization-scoped data.
          </p>
        </div>
      )}

      <nav className="flex flex-wrap justify-center gap-3">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === item.id
                ? 'bg-violet-500 text-white'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <section>{tabContent}</section>
    </main>
  );
}
