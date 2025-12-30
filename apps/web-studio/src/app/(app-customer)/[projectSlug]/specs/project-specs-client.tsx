'use client';

import * as React from 'react';
import { Button, Input } from '@contractspec/lib.design-system';
import { Card } from '@contractspec/lib.ui-kit-web/ui/card';
import {
  SpecEditor,
  type SpecEditorProps,
} from '@contractspec/bundle.studio/presentation/components/studio/organisms/SpecEditor';
import {
  PROJECT_SPECS_QUERY,
  StudioLearningEventNames,
  useCreateStudioSpec,
  useStudioLearningEventRecorder,
  useUpdateStudioSpec,
} from '@contractspec/bundle.studio/presentation/hooks/studio';
import { useSelectedProject } from '../SelectedProjectContext';
import { SpecTypeEnum } from '@contractspec/lib.gql-client-studio';
import { useGraphQL } from '@contractspec/bundle.studio/presentation/libs/gql-client';

function toStringContent(value: unknown) {
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default function ProjectSpecsClient() {
  const project = useSelectedProject();
  const { data, isLoading, refetch } = useGraphQL(PROJECT_SPECS_QUERY, {
    projectId: project.id,
  });
  const specs = data?.projectSpecs ?? [];

  const [selectedSpecId, setSelectedSpecId] = React.useState<string>('');
  React.useEffect(() => {
    const first = specs[0];
    if (!selectedSpecId && first?.id) setSelectedSpecId(first.id);
  }, [selectedSpecId, specs]);

  const selected = specs.find((s) => s.id === selectedSpecId) ?? null;
  const [draft, setDraft] = React.useState('');
  const [specType, setSpecType] =
    React.useState<SpecEditorProps['type']>('WORKFLOW');

  // Sync draft with selected content immediately when selected spec changes
  // bypassing the useEffect delay which causes SpecEditor to flash/reset to template
  const [prevSelectedId, setPrevSelectedId] = React.useState<string | null>(
    null
  );
  if (selected?.id !== prevSelectedId) {
    setPrevSelectedId(selected?.id ?? null);
    if (selected) {
      setDraft(toStringContent(selected.content));
      setSpecType(selected.type as SpecEditorProps['type']);
    } else {
      setDraft('');
    }
  }

  const createSpec = useCreateStudioSpec();
  const updateSpec = useUpdateStudioSpec();
  const { recordFireAndForget: recordLearningEvent } =
    useStudioLearningEventRecorder();

  const [newSpecName, setNewSpecName] = React.useState('main');

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-sm">Loading specs…</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Specs</p>
          <p className="text-muted-foreground text-sm">
            Stored in DB (`StudioSpec`). Edit + save regenerably.
          </p>
        </div>
        <Button variant="ghost" onPress={() => void refetch()}>
          Refresh
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-[220px] flex-1">
            <Input
              aria-label="New spec name"
              placeholder="New spec name"
              value={newSpecName}
              onChange={(e) => setNewSpecName(e.target.value)}
            />
          </div>
          <Button
            loading={createSpec.isPending}
            onPress={async () => {
              const name = newSpecName.trim() || 'main';
              await createSpec.mutateAsync({
                projectId: project.id,
                type: SpecTypeEnum.Workflow,
                name,
                version: '1.0.0',
                content: draft || '',
                metadata: {},
              });
              await refetch();
              recordLearningEvent({
                projectId: project.id,
                name: StudioLearningEventNames.SPEC_CHANGED,
                payload: {
                  action: 'create',
                  specName: name,
                  specType: 'WORKFLOW',
                },
              });
            }}
          >
            Create spec
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="p-4">
          <p className="text-sm font-semibold">Spec list</p>
          <div className="mt-3 space-y-2">
            {specs.length ? (
              specs.map((s) => (
                <Button
                  key={s.id}
                  variant={s.id === selectedSpecId ? 'default' : 'outline'}
                  className="h-auto w-full justify-start px-3 py-2 text-left"
                  onPress={() => setSelectedSpecId(s.id ?? '')}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{s.name}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {s.type} · v{s.version}
                    </p>
                  </div>
                </Button>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No specs yet.</p>
            )}
          </div>
        </Card>

        {selected ? (
          <SpecEditor
            key={selected.id}
            projectId={project.id}
            type={specType}
            content={draft}
            onChange={setDraft}
            onTypeChange={(next) => next && setSpecType(next)}
            onSave={async () => {
              if (!selected?.id) return;
              await updateSpec.mutateAsync({
                id: selected.id,
                content: draft,
                name: selected.name ?? 'Untitled',
                version: selected.version ?? '0.0.1',
                metadata: selected.metadata ?? {},
              });
              await refetch();
              recordLearningEvent({
                projectId: project.id,
                name: StudioLearningEventNames.SPEC_CHANGED,
                payload: {
                  action: 'update',
                  specId: selected.id,
                  specType,
                },
              });
            }}
          />
        ) : (
          <Card className="p-6">
            <p className="text-muted-foreground text-sm">Select a spec.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
