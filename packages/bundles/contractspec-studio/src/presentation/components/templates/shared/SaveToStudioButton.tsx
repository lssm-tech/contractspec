'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useTemplateRuntime } from '../../../../templates/runtime';

export interface SaveToStudioButtonProps {
  organizationId?: string;
  projectName?: string;
  endpoint?: string;
  token?: string;
}

export function SaveToStudioButton({
  organizationId = 'demo-org',
  projectName,
  endpoint,
  token,
}: SaveToStudioButtonProps) {
  const { installer, templateId, template } = useTemplateRuntime();
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle'
  );
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setStatus('saving');
    setError(null);
    try {
      await installer.saveToStudio({
        templateId,
        projectName: projectName ?? `${template.name} demo`,
        organizationId,
        endpoint,
        token,
      });
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        className="btn-primary inline-flex items-center gap-2 text-sm"
        onClick={handleSave}
        disabled={status === 'saving'}
      >
        <Sparkles className="h-4 w-4" />
        {status === 'saving' ? 'Publishing…' : 'Save to Studio'}
      </button>
      {status === 'error' && error ? (
        <p className="text-destructive text-xs">{error}</p>
      ) : null}
      {status === 'saved' ? (
        <p className="text-xs text-emerald-400">Template sent to Studio.</p>
      ) : null}
    </div>
  );
}
