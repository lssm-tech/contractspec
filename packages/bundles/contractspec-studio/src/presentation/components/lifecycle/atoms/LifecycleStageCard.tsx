import * as React from 'react';
import { Activity } from 'lucide-react';

export interface LifecycleStageCardProps {
  stage:
    | 'EXPLORATION'
    | 'PROBLEM_SOLUTION_FIT'
    | 'MVP_EARLY_TRACTION'
    | 'PRODUCT_MARKET_FIT'
    | 'GROWTH_SCALE_UP'
    | 'EXPANSION_PLATFORM'
    | 'MATURITY_OPTIMIZATION';
  confidence: number;
  axes: {
    product?: string;
    company?: string;
    capital?: string;
  };
  description?: string;
  updatedAt?: string;
}

const stageLabel: Record<LifecycleStageCardProps['stage'], string> = {
  EXPLORATION: 'Exploration',
  PROBLEM_SOLUTION_FIT: 'Problem / Solution fit',
  MVP_EARLY_TRACTION: 'MVP & early traction',
  PRODUCT_MARKET_FIT: 'Product / Market fit',
  GROWTH_SCALE_UP: 'Growth & scale-up',
  EXPANSION_PLATFORM: 'Expansion platform',
  MATURITY_OPTIMIZATION: 'Maturity & optimization',
};

const stageTone: Record<
  LifecycleStageCardProps['stage'],
  { ring: string; accent: string }
> = {
  EXPLORATION: { ring: 'border-sky-500/40', accent: 'bg-sky-500/10' },
  PROBLEM_SOLUTION_FIT: {
    ring: 'border-cyan-500/40',
    accent: 'bg-cyan-500/10',
  },
  MVP_EARLY_TRACTION: {
    ring: 'border-emerald-500/40',
    accent: 'bg-emerald-500/10',
  },
  PRODUCT_MARKET_FIT: {
    ring: 'border-lime-500/40',
    accent: 'bg-lime-500/10',
  },
  GROWTH_SCALE_UP: {
    ring: 'border-amber-500/40',
    accent: 'bg-amber-500/10',
  },
  EXPANSION_PLATFORM: {
    ring: 'border-orange-500/40',
    accent: 'bg-orange-500/10',
  },
  MATURITY_OPTIMIZATION: {
    ring: 'border-violet-500/40',
    accent: 'bg-violet-500/10',
  },
};

export function LifecycleStageCard({
  stage,
  confidence,
  axes,
  description,
  updatedAt,
}: LifecycleStageCardProps) {
  return (
    <div
      className={`bg-card rounded-2xl border p-4 shadow-sm ${stageTone[stage].ring} ${stageTone[stage].accent}`}
    >
      <header className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm tracking-wide uppercase">
            Current stage
          </p>
          <p className="text-xl font-semibold">{stageLabel[stage]}</p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
            Confidence
          </p>
          <p className="text-2xl font-bold">{Math.round(confidence * 100)}%</p>
        </div>
      </header>
      {description && (
        <p className="text-muted-foreground mt-3 text-sm">{description}</p>
      )}
      <dl className="border-border bg-background/60 mt-4 grid gap-3 rounded-xl border p-4 text-sm md:grid-cols-3">
        <div>
          <dt className="text-muted-foreground text-xs tracking-wide uppercase">
            Product phase
          </dt>
          <dd className="font-semibold">{axes.product ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs tracking-wide uppercase">
            Company phase
          </dt>
          <dd className="font-semibold">{axes.company ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs tracking-wide uppercase">
            Capital phase
          </dt>
          <dd className="font-semibold">{axes.capital ?? '—'}</dd>
        </div>
      </dl>
      <footer className="text-muted-foreground mt-3 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1">
          <Activity className="h-3 w-3" />
          Lifecycle advisory
        </span>
        {updatedAt && (
          <span>Updated {new Date(updatedAt).toLocaleDateString()}</span>
        )}
      </footer>
    </div>
  );
}







