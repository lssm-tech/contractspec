import * as React from 'react';
import { AlertCircle, Sparkles, Save } from 'lucide-react';
import { useStudioFeatureFlag } from '../../../hooks/studio';
import { ContractSpecFeatureFlags } from '@lssm/lib.progressive-delivery';
import { FeatureGateNotice } from '../../shared/FeatureGateNotice';
import { registerSpecEditorMonacoTypes } from './monaco-spec-types';
import { SpecPreview, type SpecPreviewProps } from './SpecPreview';

export interface SpecEditorProps {
  projectId: string;
  name?: string;
  type?: 'CAPABILITY' | 'DATAVIEW' | 'WORKFLOW' | 'POLICY' | 'COMPONENT';
  content: string;
  metadata?: Record<string, unknown>;
  validationErrors?: string[];
  previewArtifacts?: SpecPreviewProps['artifacts'];
  onChange?: (content: string) => void;
  onTypeChange?: (type: SpecEditorProps['type']) => void;
  onValidate?: () => Promise<void> | void;
  onSave?: () => Promise<void> | void;
  onPreview?: () => Promise<void> | void;
  isSaving?: boolean;
  isValidating?: boolean;
}

type SpecType = NonNullable<SpecEditorProps['type']>;

interface MonacoEditorProps {
  height?: string | number;
  defaultLanguage?: string;
  theme?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  options?: Record<string, unknown>;
}

const SPEC_TYPES: SpecType[] = [
  'CAPABILITY',
  'DATAVIEW',
  'WORKFLOW',
  'POLICY',
  'COMPONENT',
];

const SPEC_TEMPLATES: Record<SpecType, string> = {
  CAPABILITY: `import { defineCapability, StabilityEnum, schemaModel } from '@lssm/lib.contracts';

export const FieldDispatchCapability = defineCapability({
  meta: {
    key: 'ops.dispatch.field',
    version: 1,
    kind: 'command',
    title: 'Route field crews',
    description: 'Assign the best crew to an incoming work order',
    domain: 'operations',
    owners: ['team.ops'],
    tags: ['dispatch', 'ops'],
    stability: StabilityEnum.Beta,
  },
  provides: {
    operation: 'dispatchFieldCrew',
  },
  io: {
    input: schemaModel({
      kind: 'object',
      fields: {
        workOrderId: { type: 'string' },
        requestedSlot: { type: 'datetime' },
      },
    }),
    output: schemaModel({
      kind: 'object',
      fields: {
        crewId: { type: 'string' },
        slot: { type: 'datetime' },
      },
    }),
  },
  policy: {
    auth: { roles: ['ops.dispatcher'] },
  },
});
`,
  WORKFLOW: `import { defineWorkflow, StabilityEnum } from '@lssm/lib.contracts';

export const IntakeWorkflow = defineWorkflow({
  meta: {
    key: 'ops.intake.workflow',
    version: 1,
    kind: 'workflow',
    title: 'Lead intake',
    description: 'Qualify, approve, and schedule new leads',
    domain: 'operations',
    owners: ['team.ops'],
    tags: ['workflow'],
    stability: StabilityEnum.Experimental,
  },
  steps: {
    collectDetails: { action: 'leads.collectDetails' },
    qualifying: { action: 'leads.qualify' },
    schedule: { action: 'dispatch.createSlot' },
  },
  transitions: {
    collectDetails: ['qualifying'],
    qualifying: ['schedule'],
  },
});
`,
  POLICY: `import { definePolicy } from '@lssm/lib.contracts';

export const DispatchPolicy = definePolicy({
  meta: {
    key: 'ops.dispatch.policy',
    version: 1,
    kind: 'policy',
    title: 'Dispatch guardrails',
    domain: 'operations',
    owners: ['team.security'],
    tags: ['policy'],
  },
  rules: {
    allowDispatchers: {
      effect: 'allow',
      when: {
        rolesInclude: 'ops.dispatcher',
      },
    },
    denyWhenMaintenance: {
      effect: 'deny',
      when: {
        featureFlagDisabled: 'dispatching_enabled',
      },
    },
  },
});
`,
  DATAVIEW: `import { defineDataView } from '@lssm/lib.contracts';

export const CrewScheduleView = defineDataView({
  meta: {
    key: 'ops.crews.schedule',
    version: 1,
    kind: 'dataview',
    title: 'Crew schedule board',
    domain: 'operations',
    owners: ['team.ops'],
    tags: ['dataview'],
  },
  view: {
    kind: 'table',
    fields: [
      { key: 'crewName', label: 'Crew' },
      { key: 'slot', label: 'Next slot' },
      { key: 'status', label: 'Status' },
    ],
  },
  source: {
    primary: 'dispatch.listCrewSlots',
  },
});
`,
  COMPONENT: `import { defineComponentSpec } from '@lssm/lib.contracts';

export const CrewBoardComponent = defineComponentSpec({
  meta: {
    key: 'ops.crews.board',
    version: 1,
    kind: 'component',
    title: 'Crew board',
    description: 'Visual board of crew availability',
    domain: 'operations',
    owners: ['team.design'],
    tags: ['component'],
  },
  props: {
    crews: {
      type: 'array',
      of: {
        type: 'object',
        fields: {
          id: { type: 'string' },
          name: { type: 'string' },
          status: { type: 'string' },
        },
      },
    },
  },
  states: {
    empty: { message: 'No crews scheduled yet' },
  },
});
`,
};

type MonacoEditorModule = typeof import('@monaco-editor/react');

export function SpecEditor({
  projectId,
  type = 'CAPABILITY',
  content,
  metadata,
  validationErrors,
  previewArtifacts,
  onChange,
  onTypeChange,
  onValidate,
  onSave,
  onPreview,
  isSaving,
  isValidating,
}: SpecEditorProps) {
  const [localContent, setLocalContent] = React.useState(content);
  const autoEvolutionEnabled = useStudioFeatureFlag(
    ContractSpecFeatureFlags.STUDIO_AUTO_EVOLUTION
  );
  const [MonacoEditor, setMonacoEditor] =
    React.useState<React.ComponentType<MonacoEditorProps> | null>(null);
  const hasRegisteredTypes = React.useRef(false);

  React.useEffect(() => {
    let mounted = true;

    import('@monaco-editor/react')
      .then(async (mod: MonacoEditorModule) => {
        if (!mounted) return;
        setMonacoEditor(() => mod.default);

        if (!hasRegisteredTypes.current && mod.loader) {
          try {
            const monaco = await mod.loader.init();
            if (mounted && monaco) {
              registerSpecEditorMonacoTypes(
                monaco as unknown as Parameters<
                  typeof registerSpecEditorMonacoTypes
                >[0]
              );
              hasRegisteredTypes.current = true;
            }
          } catch (error) {
            console.error('Failed to initialize Monaco editor', error);
          }
        }
      })
      .catch(() => {
        setMonacoEditor(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (content && content.trim().length > 0) {
      setLocalContent(content);
      return;
    }
    const template = SPEC_TEMPLATES[type];
    setLocalContent(template);
    onChange?.(template);
  }, [content, type, onChange]);

  const handleChange = (value: string) => {
    setLocalContent(value);
    onChange?.(value);
  };

  const handleTypeSelect = (nextType: SpecType) => {
    onTypeChange?.(nextType);
    const template = SPEC_TEMPLATES[nextType];
    setLocalContent(template);
    onChange?.(template);
  };

  return (
    <div className="border-border bg-card space-y-4 rounded-2xl border p-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-lg font-semibold">Spec editor</p>
          <p className="text-muted-foreground text-sm">
            Edit capability, workflow, policy, or component specs with inline
            validation.
          </p>
        </div>
        <div className="inline-flex gap-2">
          <select
            className="border-border bg-background rounded-md border px-3 py-2 text-sm"
            value={type}
            onChange={(event) =>
              handleTypeSelect(event.target.value as SpecType)
            }
          >
            {SPEC_TYPES.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0) + item.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn-ghost inline-flex items-center gap-2 text-sm"
            onClick={() => onValidate?.()}
            disabled={isValidating}
          >
            <Sparkles className="h-4 w-4" />
            Validate
          </button>
          <button
            type="button"
            className="btn-primary inline-flex items-center gap-2 text-sm"
            onClick={() => onSave?.()}
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />
            Save spec
          </button>
        </div>
      </header>
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-2">
          <label className="text-muted-foreground text-xs tracking-wide uppercase">
            Spec content
          </label>
          <div className="border-border bg-background/70 relative h-[360px] overflow-hidden rounded-xl border">
            {MonacoEditor ? (
              <MonacoEditor
                height="360px"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={localContent}
                onChange={(value) => handleChange(value ?? '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                }}
              />
            ) : (
              <textarea
                className="h-full w-full bg-transparent p-4 font-mono text-sm leading-relaxed"
                value={localContent}
                onChange={(event) => handleChange(event.target.value)}
                spellCheck={false}
              />
            )}
          </div>
        </div>
        <div className="space-y-4">
          <section className="border-border bg-background rounded-xl border p-4">
            <h3 className="text-sm font-semibold tracking-wide uppercase">
              Metadata
            </h3>
            <pre className="text-muted-foreground bg-muted/40 mt-2 max-h-64 overflow-auto rounded-lg p-3 text-xs">
              {JSON.stringify(metadata ?? { version: '1.0.0' }, null, 2)}
            </pre>
          </section>
          <section className="border-border bg-background rounded-xl border p-4">
            <h3 className="text-sm font-semibold tracking-wide uppercase">
              Validation
            </h3>
            {validationErrors?.length ? (
              <ul className="mt-2 space-y-2">
                {validationErrors.map((error) => (
                  <li
                    key={error}
                    className="bg-destructive/10 text-destructive flex items-start gap-2 rounded-lg p-2 text-xs"
                  >
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5" />
                    {error}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground mt-2 text-xs">
                No validation issues detected.
              </p>
            )}
            <button
              type="button"
              className="btn-ghost mt-4 inline-flex w-full items-center justify-center gap-2 text-sm"
              onClick={() => onPreview?.()}
            >
              Preview spec
            </button>
            {previewArtifacts ? (
              <div className="mt-3">
                <SpecPreview
                  projectId={projectId}
                  type={type}
                  artifacts={previewArtifacts}
                  validationErrors={validationErrors}
                />
              </div>
            ) : null}
          </section>
          <section className="border-border bg-background/60 rounded-xl border border-dashed p-4">
            <h3 className="text-sm font-semibold tracking-wide uppercase">
              Auto-evolution suggestions
            </h3>
            {autoEvolutionEnabled ? (
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Approved signals appear here with inline rationale so editors
                  can apply the change or dismiss it with one tap.
                </p>
                <ul className="space-y-2">
                  <li className="bg-muted/40 rounded-lg p-3">
                    <p className="font-medium">
                      Promote onboarding tour to primary CTA
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Spike in drop-offs during setup. Suggested change
                      increases completion by 18% in simulation.
                    </p>
                  </li>
                </ul>
              </div>
            ) : (
              <FeatureGateNotice
                title="Auto-evolution is gated"
                description="Turn on STUDIO_AUTO_EVOLUTION to stream suggestions from the evolution engine directly into the editor."
                actionLabel="Request access"
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
