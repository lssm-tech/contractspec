import * as React from 'react';
import { Lock } from 'lucide-react';

export interface FeatureGateNoticeProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function FeatureGateNotice({
  title,
  description,
  actionLabel,
  onAction,
}: FeatureGateNoticeProps) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted/40">
        <Lock className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      {actionLabel ? (
        <button
          type="button"
          className="btn-primary mt-4 inline-flex items-center justify-center"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}




