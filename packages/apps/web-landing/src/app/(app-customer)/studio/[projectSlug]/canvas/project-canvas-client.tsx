'use client';

import * as React from 'react';
import { Button } from '@lssm/lib.design-system';
import { Card } from '@lssm/lib.ui-kit-web/ui/card';
import { Badge } from '@lssm/lib.ui-kit-web/ui/badge';
import { StudioCanvas } from '@lssm/bundle.contractspec-studio/presentation/components/studio/organisms/StudioCanvas';
import type { ComponentNode } from '@lssm/bundle.contractspec-studio/modules/visual-builder';
import {
  useCanvasVersions,
  useDeployCanvasVersion,
  useSaveCanvasDraft,
  useStudioCanvas,
  useUndoCanvasVersion,
} from '@lssm/bundle.contractspec-studio/presentation/hooks/studio';
import { useSelectedProject } from '../SelectedProjectContext';

export default function ProjectCanvasClient() {
  const project = useSelectedProject();
  const { data, isLoading, refetch } = useStudioCanvas(project.id);
  const canvas = data?.studioCanvas;

  const [nodes, setNodes] = React.useState<ComponentNode[]>([]);
  React.useEffect(() => {
    setNodes((canvas?.nodes ?? []) as ComponentNode[]);
  }, [canvas?.nodes]);

  const saveDraft = useSaveCanvasDraft();
  const deployVersion = useDeployCanvasVersion();
  const undoVersion = useUndoCanvasVersion();

  const canvasId = canvas?.id ?? '';
  const { data: versionsData, refetch: refetchVersions } = useCanvasVersions(
    canvasId,
    { enabled: Boolean(canvasId) }
  );
  const versions = versionsData?.canvasVersions ?? [];

  if (isLoading || !canvas) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-sm">Loading canvas…</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">Canvas</p>
          <p className="text-muted-foreground text-sm">
            Persisted to Studio DB via overlays and canvas versions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            loading={saveDraft.isPending}
            onPress={async () => {
              await saveDraft.mutateAsync({
                canvasId,
                nodes,
                label: `Draft (${new Date().toLocaleString()})`,
              });
              await refetch();
              await refetchVersions();
            }}
          >
            Save draft
          </Button>
          <Button
            variant="ghost"
            loading={undoVersion.isPending}
            onPress={async () => {
              await undoVersion.mutateAsync({ canvasId });
              await refetch();
              await refetchVersions();
            }}
          >
            Undo
          </Button>
        </div>
      </div>

      <StudioCanvas
        state={canvas}
        onNodesChange={(next) => setNodes(next)}
      />

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Versions</p>
          <Button variant="ghost" size="sm" onPress={() => void refetchVersions()}>
            Refresh
          </Button>
        </div>
        <div className="mt-3 space-y-2">
          {versions.length ? (
            versions.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{v.label}</p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(v.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={v.status === 'deployed' ? 'default' : 'secondary'}>
                    {v.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    loading={deployVersion.isPending}
                    onPress={async () => {
                      await deployVersion.mutateAsync({
                        canvasId,
                        versionId: v.id,
                      });
                      await refetch();
                      await refetchVersions();
                    }}
                  >
                    Deploy
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No versions yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}



