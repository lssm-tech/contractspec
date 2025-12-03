import * as React from 'react';

const stages = [
  'EXPLORATION',
  'PROBLEM_SOLUTION_FIT',
  'MVP_EARLY_TRACTION',
  'PRODUCT_MARKET_FIT',
  'GROWTH_SCALE_UP',
  'EXPANSION_PLATFORM',
  'MATURITY_OPTIMIZATION',
] as const;

const labels: Record<(typeof stages)[number], string> = {
  EXPLORATION: 'Exploration',
  PROBLEM_SOLUTION_FIT: 'Problem / Solution fit',
  MVP_EARLY_TRACTION: 'MVP & early traction',
  PRODUCT_MARKET_FIT: 'Product / Market fit',
  GROWTH_SCALE_UP: 'Growth & scale-up',
  EXPANSION_PLATFORM: 'Expansion platform',
  MATURITY_OPTIMIZATION: 'Maturity & optimization',
};

export interface LifecycleJourneyProps {
  currentStage: (typeof stages)[number];
  completedStages?: (typeof stages)[number][];
}

export function LifecycleJourney({
  currentStage,
  completedStages = [],
}: LifecycleJourneyProps) {
  const activeIndex = stages.indexOf(currentStage);
  return (
    <div className="border-border bg-card space-y-4 rounded-2xl border p-4">
      <header>
        <p className="text-sm font-semibold tracking-wide uppercase">
          Lifecycle journey
        </p>
        <p className="text-muted-foreground text-sm">
          Track the ceremony from exploration to maturity across seven stages.
        </p>
      </header>
      <div className="hidden md:grid md:grid-cols-7 md:gap-3">
        {stages.map((stage, index) => {
          const isCompleted =
            completedStages.includes(stage) || index < activeIndex;
          const isActive = index === activeIndex;
          return (
            <div key={stage} className="text-center">
              <div
                className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : isCompleted
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                      : 'border-border text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
              <p className="mt-2 text-xs font-semibold">{labels[stage]}</p>
            </div>
          );
        })}
      </div>
      <div className="space-y-3 md:hidden">
        {stages.map((stage, index) => {
          const isCompleted =
            completedStages.includes(stage) || index < activeIndex;
          const isActive = index === activeIndex;
          return (
            <div
              key={stage}
              className={`rounded-xl border p-3 ${
                isActive
                  ? 'border-primary/50 bg-primary/5'
                  : isCompleted
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm">{index + 1}.</span>
                <div>
                  <p className="text-sm font-semibold">{labels[stage]}</p>
                  {isActive && (
                    <p className="text-muted-foreground text-xs">
                      Current ceremony
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


