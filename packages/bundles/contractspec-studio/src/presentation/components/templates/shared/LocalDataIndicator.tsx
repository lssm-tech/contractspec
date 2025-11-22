import { RefreshCw, Shield } from 'lucide-react';
import { useState } from 'react';

import { useTemplateRuntime } from '../../../../templates/runtime';

export function LocalDataIndicator() {
  const { projectId, templateId, template, installer } = useTemplateRuntime();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await installer.install(templateId, { projectId });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="border-border bg-muted/40 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
      <Shield className="h-3.5 w-3.5 text-violet-400" />
      <span>
        Local runtime ·{' '}
        <span className="text-foreground font-semibold">{template.name}</span>
      </span>
      <button
        type="button"
        className="border-border text-muted-foreground hover:text-foreground inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold"
        onClick={handleReset}
        disabled={isResetting}
      >
        <RefreshCw className="h-3 w-3" />
        {isResetting ? 'Resetting…' : 'Reset data'}
      </button>
    </div>
  );
}
