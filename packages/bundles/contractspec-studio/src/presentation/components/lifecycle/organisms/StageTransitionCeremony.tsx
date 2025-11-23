import * as React from 'react';
import { Sparkles, PartyPopper, CalendarDays } from 'lucide-react';

export interface StageTransitionCeremonyProps {
  fromStage: string;
  toStage: string;
  milestonesUnlocked?: string[];
  nextActions?: string[];
  onCelebrate?: () => void;
}

export function StageTransitionCeremony({
  fromStage,
  toStage,
  milestonesUnlocked = [],
  nextActions = [],
  onCelebrate,
}: StageTransitionCeremonyProps) {
  return (
    <div className="border-border overflow-hidden rounded-2xl border bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-emerald-500/10 p-6 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-wide text-violet-500 uppercase">
            Stage transition
          </p>
          <p className="text-foreground text-2xl font-bold">
            {fromStage} → {toStage}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            Ritualize the change with team moments, updates, and next steps.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary inline-flex items-center gap-2"
          onClick={onCelebrate}
        >
          <PartyPopper className="h-4 w-4" />
          Celebrate
        </button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="bg-background/60 rounded-xl border border-white/20 p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
            <Sparkles className="h-4 w-4" />
            Milestones unlocked
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {milestonesUnlocked.length ? (
              milestonesUnlocked.map((milestone) => (
                <li
                  key={milestone}
                  className="rounded-lg bg-emerald-500/5 px-3 py-2 text-emerald-600"
                >
                  {milestone}
                </li>
              ))
            ) : (
              <li className="text-muted-foreground border-border rounded-lg border border-dashed px-3 py-2">
                No milestones recorded yet.
              </li>
            )}
          </ul>
        </section>
        <section className="bg-background/60 rounded-xl border border-white/20 p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
            <CalendarDays className="h-4 w-4" />
            Next actions
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {nextActions.length ? (
              nextActions.map((action) => (
                <li
                  key={action}
                  className="rounded-lg bg-violet-500/5 px-3 py-2 text-violet-600"
                >
                  {action}
                </li>
              ))
            ) : (
              <li className="text-muted-foreground border-border rounded-lg border border-dashed px-3 py-2">
                Define the post-ceremony commitments.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}


