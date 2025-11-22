import * as React from 'react';
import { ShieldCheck, Key, TestTube2 } from 'lucide-react';

export interface IntegrationSettingsForm {
  apiKey: string;
  secret?: string;
  byok?: boolean;
  config?: string;
}

export interface IntegrationSettingsProps {
  provider: string;
  initialValues?: IntegrationSettingsForm;
  onTestConnection?: (values: IntegrationSettingsForm) => Promise<void> | void;
  onSave?: (values: IntegrationSettingsForm) => Promise<void> | void;
  isSaving?: boolean;
  isTesting?: boolean;
}

export function IntegrationSettings({
  provider,
  initialValues,
  onTestConnection,
  onSave,
  isSaving,
  isTesting,
}: IntegrationSettingsProps) {
  const [values, setValues] = React.useState<IntegrationSettingsForm>({
    apiKey: initialValues?.apiKey ?? '',
    secret: initialValues?.secret ?? '',
    byok: initialValues?.byok ?? true,
    config: initialValues?.config ?? '{\n  "region": "eu-west-1"\n}',
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = event.target;
    const { name, value, type } = target;
    const nextValue =
      type === 'checkbox' && target instanceof HTMLInputElement
        ? target.checked
        : value;
    setValues((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  return (
    <form
      className="space-y-4 rounded-2xl border border-border bg-card p-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSave?.(values);
      }}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide">
            {provider} credentials
          </p>
          <p className="text-muted-foreground text-sm">
            Store encrypted keys with BYOK and run safe connection tests.
          </p>
        </div>
        <ShieldCheck className="text-muted-foreground h-5 w-5" />
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-semibold">API key</span>
          <div className="relative">
            <Key className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              name="apiKey"
              className="border-border w-full rounded-md border bg-background pl-9 pr-3 py-2"
              value={values.apiKey}
              onChange={handleChange}
              required
            />
          </div>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold">Secret</span>
          <input
            type="password"
            name="secret"
            className="border-border w-full rounded-md border bg-background px-3 py-2"
            value={values.secret}
            onChange={handleChange}
          />
        </label>
      </div>
      <label className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-sm">
        <input
          type="checkbox"
          name="byok"
          checked={values.byok}
          onChange={handleChange}
          className="h-4 w-4 rounded border-border"
        />
        <div>
          <p className="font-semibold">Store secrets via BYOK</p>
          <p className="text-muted-foreground">
            Keys are encrypted with tenant-specific material.
          </p>
        </div>
      </label>
      <label className="space-y-1 text-sm">
        <span className="font-semibold">Configuration (JSON)</span>
        <textarea
          name="config"
          className="border-border font-mono min-h-[140px] w-full rounded-xl border bg-background/70 p-3 text-sm"
          value={values.config}
          onChange={handleChange}
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn-ghost inline-flex items-center gap-2"
          onClick={() => onTestConnection?.(values)}
          disabled={isTesting}
        >
          <TestTube2 className="h-4 w-4" />
          Test connection
        </button>
        <button
          type="submit"
          className="btn-primary inline-flex items-center gap-2"
          disabled={isSaving}
        >
          Save settings
        </button>
      </div>
    </form>
  );
}

