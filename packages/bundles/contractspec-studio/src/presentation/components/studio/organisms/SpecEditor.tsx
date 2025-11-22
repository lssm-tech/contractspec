import * as React from 'react';
import { AlertCircle, Sparkles, Save } from 'lucide-react';
import { useStudioFeatureFlag } from '../../../hooks/studio';
import { ContractSpecFeatureFlags } from '@lssm/lib.progressive-delivery/feature-flags';
import { FeatureGateNotice } from '../../shared/FeatureGateNotice';

export interface SpecEditorProps {
  projectId: string;
  name?: string;
  type?: 'CAPABILITY' | 'DATAVIEW' | 'WORKFLOW' | 'POLICY' | 'COMPONENT';
  content: string;
  metadata?: Record<string, unknown>;
  validationErrors?: string[];
  onChange?: (content: string) => void;
  onTypeChange?: (type: SpecEditorProps['type']) => void;
  onValidate?: () => Promise<void> | void;
  onSave?: () => Promise<void> | void;
  onPreview?: () => Promise<void> | void;
  isSaving?: boolean;
  isValidating?: boolean;
}

const SPEC_TYPES: SpecEditorProps['type'][] = [
  'CAPABILITY',
  'DATAVIEW',
  'WORKFLOW',
  'POLICY',
  'COMPONENT',
];

export function SpecEditor({
  type = 'CAPABILITY',
  content,
  metadata,
  validationErrors,
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

  React.useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleChange = (value: string) => {
    setLocalContent(value);
    onChange?.(value);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
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
            className="border-border rounded-md border bg-background px-3 py-2 text-sm"
            value={type}
            onChange={(event) =>
              onTypeChange?.(event.target.value as SpecEditorProps['type'])
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
          <label className="text-xs uppercase tracking-wide text-muted-foreground">
            Spec content
          </label>
          <textarea
            className="border-border font-mono text-sm leading-relaxed h-[360px] w-full rounded-xl border bg-background/70 p-4"
            value={localContent}
            onChange={(event) => handleChange(event.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="space-y-4">
          <section className="rounded-xl border border-border bg-background p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              Metadata
            </h3>
            <pre className="text-muted-foreground mt-2 max-h-64 overflow-auto rounded-lg bg-muted/40 p-3 text-xs">
              {JSON.stringify(metadata ?? { version: '1.0.0' }, null, 2)}
            </pre>
          </section>
          <section className="rounded-xl border border-border bg-background p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              Validation
            </h3>
            {validationErrors?.length ? (
              <ul className="mt-2 space-y-2">
                {validationErrors.map((error) => (
                  <li
                    key={error}
                    className="flex items-start gap-2 rounded-lg bg-destructive/10 p-2 text-xs text-destructive"
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
          </section>
          <section className="rounded-xl border border-dashed border-border bg-background/60 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              Auto-evolution suggestions
            </h3>
            {autoEvolutionEnabled ? (
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Approved signals appear here with inline rationale so editors
                  can apply the change or dismiss it with one tap.
                </p>
                <ul className="space-y-2">
                  <li className="rounded-lg bg-muted/40 p-3">
                    <p className="font-medium">
                      Promote onboarding tour to primary CTA
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Spike in drop-offs during setup. Suggested change increases
                      completion by 18% in simulation.
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

