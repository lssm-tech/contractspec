'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  Boxes,
  FileText,
  GraduationCap,
  LayoutGrid,
  PlugZap,
  Rocket,
  Sparkles,
} from 'lucide-react';
import { Card } from '@lssm/lib.ui-kit-web/ui/card';
import {
  WorkspaceProjectShellLayout,
  FloatingAssistant,
} from '@lssm/bundle.contractspec-studio/presentation/components';
import { STUDIO_APP_HEADER_OFFSET_PX } from '@lssm/bundle.contractspec-studio/presentation/components';
import {
  useStudioProjectBySlug,
  useStudioProjects,
  StudioLearningEventNames,
  useStudioLearningEventRecorder,
} from '@lssm/bundle.contractspec-studio/presentation/hooks/studio';
import { SelectedProjectProvider } from './SelectedProjectContext';

const MODULES = [
  { id: 'canvas', label: 'Canvas', icon: LayoutGrid },
  { id: 'specs', label: 'Specs', icon: FileText },
  { id: 'deploy', label: 'Deploy', icon: Rocket },
  { id: 'integrations', label: 'Integrations', icon: PlugZap },
  { id: 'evolution', label: 'Evolution', icon: Sparkles },
  { id: 'learning', label: 'Learning', icon: GraduationCap },
  { id: 'projects', label: 'Projects', icon: Boxes },
] as const;

function getActiveModule(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  const maybe = parts[2]; // /studio/:slug/:module
  return (
    MODULES.find((m) => m.id === maybe)?.id ??
    (parts.length >= 3 ? (maybe as string) : 'canvas')
  );
}

export default function StudioProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ projectSlug: string }>();
  const projectSlug = params.projectSlug;

  const { data, isLoading, error } = useStudioProjectBySlug(projectSlug);
  const resolved = data?.studioProjectBySlug;

  React.useEffect(() => {
    if (!resolved) return;
    if (resolved.wasRedirect) {
      const nextPath = pathname.replace(
        `/studio/${projectSlug}`,
        `/studio/${resolved.canonicalSlug}`
      );
      router.replace(nextPath);
    }
  }, [resolved, pathname, projectSlug, router]);

  const project = resolved?.project;

  const { data: projectsData } = useStudioProjects({ enabled: true });
  const projects = projectsData?.myStudioProjects ?? [];

  const activeModuleId = getActiveModule(pathname);
  const { recordFireAndForget } = useStudioLearningEventRecorder();

  if (isLoading) {
    return (
      <main className="section-padding py-10">
        <Card className="p-6">
          <p className="text-muted-foreground text-sm">Loading project…</p>
        </Card>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="section-padding py-10">
        <Card className="p-6">
          <p className="text-sm font-semibold">Project not found</p>
          <p className="text-muted-foreground mt-1 text-sm">
            The project may have been deleted or you may not have access.
          </p>
          <div className="mt-3">
            <Link className="text-sm underline" href="/studio/projects">
              Back to projects
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <SelectedProjectProvider
      project={{
        id: project.id,
        slug: project.slug,
        name: project.name,
        description: project.description,
      }}
    >
      <WorkspaceProjectShellLayout
        title={project.name}
        subtitle={project.description ?? undefined}
        stickyHeaderOffsetPx={STUDIO_APP_HEADER_OFFSET_PX}
        projectSelect={{
          label: 'Project',
          value: project.slug,
          options: projects.map((p) => ({ value: p.slug, label: p.name })),
          onChange: (nextSlug) => router.push(`/studio/${nextSlug}/canvas`),
        }}
        environmentSelect={{
          label: 'Environment',
          value: 'DEVELOPMENT',
          options: [
            { value: 'DEVELOPMENT', label: 'Development' },
            { value: 'STAGING', label: 'Staging' },
            { value: 'PRODUCTION', label: 'Production' },
          ],
          onChange: () => void 0,
        }}
        modules={MODULES.map((m) => ({
          id: m.id,
          label: m.label,
          icon: <m.icon className="h-4 w-4" />,
        }))}
        activeModuleId={activeModuleId}
        onModuleChange={(moduleId) => {
          if (moduleId === 'projects') {
            router.push('/studio/projects');
            return;
          }
          recordFireAndForget({
            projectId: project.id,
            name: StudioLearningEventNames.MODULE_NAVIGATED,
            payload: { moduleId },
          });
          router.push(`/studio/${project.slug}/${moduleId}`);
        }}
        headerRight={
          <div className="flex items-center gap-3">
            <Link className="text-sm underline" href="/studio/learning">
              Learning
            </Link>
            <span className="text-muted-foreground text-xs">
              Access: org + teams
            </span>
          </div>
        }
        assistant={
          <FloatingAssistant
            context={{
              mode: 'studio',
              lifecycleEnabled: true,
              templateId: 'todos-app',
            }}
          />
        }
      >
        {children}
      </WorkspaceProjectShellLayout>
    </SelectedProjectProvider>
  );
}
