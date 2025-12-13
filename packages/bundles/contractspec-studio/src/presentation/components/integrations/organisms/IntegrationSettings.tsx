import * as React from 'react';
import { ShieldCheck, Key, TestTube2 } from 'lucide-react';
import { Button, Input, Textarea } from '@lssm/lib.design-system';
import { Checkbox } from '@lssm/lib.ui-kit-web/ui/checkbox';
import { Label } from '@lssm/lib.ui-kit-web/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lssm/lib.ui-kit-web/ui/select';

export interface IntegrationSettingsForm {
  apiKey: string;
  secret?: string;
  ownershipMode?: 'managed' | 'byok';
  secretProvider?: 'env' | 'gcp';
  secretRef?: string;
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
    ownershipMode: initialValues?.ownershipMode ?? 'managed',
    secretProvider: initialValues?.secretProvider ?? 'env',
    secretRef: initialValues?.secretRef ?? '',
    config: initialValues?.config ?? '{\n  "region": "eu-west-1"\n}',
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = event.target;
    const { name, value, type } = target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="border-border bg-card space-y-4 rounded-2xl border p-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-wide uppercase">
            {provider} credentials
          </p>
          <p className="text-muted-foreground text-sm">
            Store encrypted keys with BYOK and run safe connection tests.
          </p>
        </div>
        <ShieldCheck className="text-muted-foreground h-5 w-5" />
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ownershipMode">Ownership</Label>
          <Select
            value={values.ownershipMode ?? 'managed'}
            onValueChange={(next) =>
              setValues((prev) => ({
                ...prev,
                ownershipMode: next as IntegrationSettingsForm['ownershipMode'],
              }))
            }
          >
            <SelectTrigger id="ownershipMode" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="managed">Managed (store encrypted)</SelectItem>
              <SelectItem value="byok">BYOK (store secret reference)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1 text-sm">
          <Label htmlFor="apiKey" className="font-semibold">
            API key
          </Label>
          <div className="relative">
            <Key className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              name="apiKey"
              id="apiKey"
              className="w-full py-2 pr-3 pl-9"
              value={values.apiKey}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="space-y-1 text-sm">
          <Label htmlFor="secret" className="font-semibold">
            Secret
          </Label>
          <Input
            type="password"
            id="secret"
            name="secret"
            className="w-full px-3 py-2"
            value={values.secret}
            onChange={handleChange}
          />
        </div>
      </div>

      {values.ownershipMode === 'byok' ? (
        <div className="space-y-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <p className="text-sm font-semibold">BYOK secret reference</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="secretProvider">Secret provider</Label>
              <Select
                value={values.secretProvider ?? 'env'}
                onValueChange={(next) =>
                  setValues((prev) => ({
                    ...prev,
                    secretProvider:
                      next as IntegrationSettingsForm['secretProvider'],
                  }))
                }
              >
                <SelectTrigger id="secretProvider" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="env">Environment</SelectItem>
                  <SelectItem value="gcp">GCP Secret Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secretRef">Secret reference</Label>
              <Input
                id="secretRef"
                name="secretRef"
                placeholder={
                  values.secretProvider === 'gcp'
                    ? 'gcp://projects/.../secrets/...'
                    : 'env://MY_TOKEN_ENV_VAR'
                }
                value={values.secretRef ?? ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm">
          <Checkbox checked onCheckedChange={() => {}} aria-label="Managed" />
          <div>
            <p className="font-semibold">Managed encryption enabled</p>
            <p className="text-muted-foreground">
              Secrets are encrypted server-side for this tenant.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-1 text-sm">
        <Label htmlFor="config" className="font-semibold">
          Configuration (JSON)
        </Label>
        <Textarea
          id="config"
          name="config"
          className="min-h-[140px] w-full font-mono text-sm"
          value={values.config}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="ghost"
          onPress={() => onTestConnection?.(values)}
          disabled={isTesting}
        >
          <TestTube2 className="h-4 w-4" />
          Test connection
        </Button>
        <Button
          variant="default"
          onPress={() => onSave?.(values)}
          disabled={isSaving}
        >
          Save settings
        </Button>
      </div>
    </div>
  );
}
