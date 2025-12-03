import { Check, Circle, Trash2 } from 'lucide-react';

import { type Task } from './types';

export interface TaskItemProps {
  task: Task;
  onToggle?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const badgeColor =
    task.priority === 'URGENT'
      ? 'text-red-200 bg-red-500/10 border-red-500/40'
      : task.priority === 'HIGH'
        ? 'text-amber-200 bg-amber-500/10 border-amber-500/40'
        : task.priority === 'LOW'
          ? 'text-emerald-200 bg-emerald-500/10 border-emerald-500/40'
          : 'text-violet-200 bg-violet-500/10 border-violet-500/40';

  return (
    <div className="border-border/70 bg-card/60 hover:border-border flex items-start gap-4 rounded-2xl border p-4 transition">
      <button
        type="button"
        className="border-border text-muted-foreground hover:bg-muted/40 rounded-full border p-2"
        aria-pressed={task.completed}
        onClick={() => onToggle?.(task)}
      >
        {task.completed ? (
          <Check className="h-4 w-4 text-emerald-400" />
        ) : (
          <Circle className="h-4 w-4" />
        )}
      </button>

      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={`font-medium ${
              task.completed
                ? 'text-muted-foreground line-through'
                : 'text-foreground'
            }`}
          >
            {task.title}
          </p>
          <span
            className={`rounded-full border px-2 py-0.5 text-xs ${badgeColor}`}
          >
            {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
          </span>
          {task.category ? (
            <span className="bg-muted/40 text-muted-foreground rounded-full px-2 py-0.5 text-xs">
              {task.category.name}
            </span>
          ) : null}
          {task.dueDate ? (
            <span className="text-muted-foreground text-xs">
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          ) : null}
        </div>

        {task.description ? (
          <p className="text-muted-foreground text-sm">{task.description}</p>
        ) : null}

        {task.tags.length ? (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="bg-muted/40 text-muted-foreground rounded-full px-2 py-0.5 text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        className="text-muted-foreground hover:text-destructive"
        aria-label={`Delete ${task.title}`}
        onClick={() => onDelete?.(task)}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}


