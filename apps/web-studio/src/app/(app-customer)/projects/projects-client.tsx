'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Input } from '@contractspec/lib.design-system';
import { Card } from '@contractspec/lib.ui-kit-web/ui/card';
import { ConfirmDialog } from '@contractspec/lib.ui-kit-web/ui/confirm-dialog';
import { Label } from '@contractspec/lib.ui-kit-web/ui/label';
import { Checkbox } from '@contractspec/lib.ui-kit-web/ui/checkbox';
import {
  useCreateStudioProject,
  useDeleteStudioProject,
  useStudioProjects,
  useMyTeams,
  StudioLearningEventNames,
  useStudioLearningEventRecorder,
} from '@contractspec/bundle.studio/presentation/hooks/studio';
import {
  ProjectTierEnum,
  DeploymentModeEnum,
} from '@contractspec/lib.gql-client-studio';

export default function StudioProjectsClient() {
  const { data, isLoading, refetch } = useStudioProjects({ enabled: true });
  const projects = data?.myStudioProjects ?? [];
  const { data: teamsData, isLoading: teamsLoading } = useMyTeams({
    enabled: true,
  });
  const teams = teamsData?.myTeams ?? [];

  const createProject = useCreateStudioProject();
  const deleteProject = useDeleteStudioProject();
  const { recordAsync: recordLearningEvent } = useStudioLearningEventRecorder();

  const [newName, setNewName] = React.useState('');
  const [newDescription, setNewDescription] = React.useState('');
  const [selectedTeamIds, setSelectedTeamIds] = React.useState<string[]>([]);

  const [deleteDialog, setDeleteDialog] = React.useState<{
    open: boolean;
    projectId?: string;
    projectName?: string;
  }>({ open: false });

  if (teamsLoading) {
    return (
      <main className="section-padding py-10">
        <Card className="p-6">
          <p className="text-muted-foreground text-sm">Loading teams…</p>
        </Card>
      </main>
    );
  }

  return (
    <main className="section-padding py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="space-y-1">
          <p className="text-sm font-semibold">Studio projects</p>
          <p className="text-muted-foreground text-sm">
            Create a project, then open its modules under{' '}
            <code className="text-xs">/studio/&lt;project-slug&gt;/*</code>.
          </p>
        </header>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">Organization</p>
            <Button
              variant="ghost"
              onPress={() => {
                void refetch();
              }}
            >
              Refresh
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            Projects live directly under your organization. Access is refined by
            teams.
          </p>
        </Card>

        <Card className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Create project</p>
              <Input
                placeholder="Project name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                aria-label="Project name"
              />
              <Input
                placeholder="Description (optional)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                aria-label="Project description"
              />
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">
                  Share with teams (optional)
                </Label>
                {teams.length ? (
                  <div className="space-y-2">
                    {teams.map((team) => {
                      const checked = selectedTeamIds.includes(team.id ?? '');
                      return (
                        <div key={team.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(value) => {
                              const next = Boolean(value);
                              const teamId = team.id ?? '';
                              if (!teamId) return;
                              setSelectedTeamIds((prev) =>
                                next
                                  ? [...prev, teamId]
                                  : prev.filter((id) => id !== teamId)
                              );
                            }}
                          />
                          <span className="text-sm">{team.name}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-xs">
                    No teams found in this organization.
                  </p>
                )}
                <p className="text-muted-foreground text-xs">
                  If you select no teams, the project is org-wide (all members).
                </p>
              </div>
              <Button
                loading={createProject.isPending}
                onPress={async () => {
                  const name = newName.trim();
                  if (!name) return;
                  const description = newDescription.trim() || undefined;
                  const result = await createProject.mutateAsync({
                    name,
                    description: description ?? '',
                    teamIds: selectedTeamIds.length
                      ? selectedTeamIds
                      : undefined,
                    tier: ProjectTierEnum.Starter,
                    deploymentMode: DeploymentModeEnum.Shared,
                    byokEnabled: false,
                    evolutionEnabled: true,
                  });
                  if (!result) return;
                  setNewName('');
                  setNewDescription('');
                  setSelectedTeamIds([]);
                  await refetch();
                  const slug = result.slug;
                  try {
                    await recordLearningEvent({
                      projectId: result.id,
                      name: StudioLearningEventNames.TEMPLATE_INSTANTIATED,
                      payload: {
                        templateId: 'starter',
                        projectSlug: slug,
                      },
                    });
                  } catch {
                    // Best-effort: onboarding tracking should never block project creation UX.
                  }
                  window.location.href = `/studio/${slug}/canvas`;
                }}
              >
                Create & open
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">Projects</p>
              {isLoading ? (
                <p className="text-muted-foreground text-sm">Loading…</p>
              ) : projects.length ? (
                <div className="space-y-2">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="border-border flex items-center justify-between gap-3 rounded-md border p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="text-muted-foreground truncate text-xs">
                          /studio/{p.slug}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/studio/${p.slug}/canvas`}>Open</Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onPress={() =>
                            setDeleteDialog({
                              open: true,
                              projectId: p.id,
                              projectName: p.name,
                            })
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No projects yet.
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        title="Delete project?"
        description={`This will hide the project and all its modules. You can add restore later. (${deleteDialog.projectName ?? ''})`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={async () => {
          if (!deleteDialog.projectId) return;
          await deleteProject.mutateAsync({ id: deleteDialog.projectId });
          setDeleteDialog({ open: false });
          await refetch();
        }}
      />
    </main>
  );
}
