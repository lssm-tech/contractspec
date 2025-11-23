import * as React from 'react';
import { Award, Filter } from 'lucide-react';

export type MilestoneStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'SKIPPED';

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: MilestoneStatus;
  startedAt?: string;
  completedAt?: string;
}

const statusStyles: Record<MilestoneStatus, string> = {
  NOT_STARTED: 'bg-gray-500/10 text-gray-500 border-gray-500/30',
  IN_PROGRESS: 'bg-amber-500/10 text-amber-500 border-amber-500/40',
  COMPLETED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/40',
  SKIPPED: 'bg-red-500/10 text-red-500 border-red-500/30',
};

export interface MilestoneTrackerProps {
  milestones: Milestone[];
}

export function MilestoneTracker({ milestones }: MilestoneTrackerProps) {
  const [category, setCategory] = React.useState<string>('all');
  const categories = React.useMemo(
    () => Array.from(new Set(milestones.map((item) => item.category))),
    [milestones]
  );
  const filtered =
    category === 'all'
      ? milestones
      : milestones.filter((item) => item.category === category);

  return (
    <div className="border-border bg-card space-y-4 rounded-2xl border p-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-wide uppercase">
            Milestone tracker
          </p>
          <p className="text-muted-foreground text-sm">
            Celebrate ceremonial progress with visible checkpoints.
          </p>
        </div>
        <div className="inline-flex items-center gap-2">
          <Filter className="text-muted-foreground h-4 w-4" />
          <select
            className="border-border bg-background rounded-md border px-3 py-2 text-sm"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {filtered.length ? (
          filtered.map((milestone) => (
            <div
              key={milestone.id}
              className="border-border bg-background rounded-xl border p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold">{milestone.title}</p>
                <span
                  className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold tracking-wide uppercase ${statusStyles[milestone.status]}`}
                >
                  {milestone.status.replace('_', ' ').toLowerCase()}
                </span>
              </div>
              {milestone.description && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {milestone.description}
                </p>
              )}
              <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {milestone.category}
                </span>
                {milestone.startedAt && (
                  <span>
                    Started {new Date(milestone.startedAt).toLocaleDateString()}
                  </span>
                )}
                {milestone.completedAt && (
                  <span>
                    Completed{' '}
                    {new Date(milestone.completedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground border-border rounded-xl border border-dashed p-6 text-center text-sm md:col-span-2">
            No milestones for this category yet.
          </div>
        )}
      </div>
    </div>
  );
}


