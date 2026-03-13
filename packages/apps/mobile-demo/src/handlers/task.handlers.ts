import { installOp, type HandlerCtx } from '@contractspec/lib.contracts-spec';
import { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import {
  TaskListQuery,
  TaskCreateCommand,
  TaskUpdateStatusCommand,
} from '@/contracts';
import { loadTasksFromStorage, saveTasksToStorage } from './task.storage';
import type { Task } from './task.types';

export type { Task } from './task.types';

const store: Task[] = [];
let nextId = 1;
let hasLoadedFromStorage = false;

/** Resets in-memory store for tests. Do not use in production. */
export function resetTaskStoreForTesting(): void {
  store.length = 0;
  nextId = 1;
  hasLoadedFromStorage = false;
}

function generateId(): string {
  return `task-${nextId++}`;
}

function ensureLoaded(): Promise<void> {
  if (hasLoadedFromStorage) return Promise.resolve();
  return loadTasksFromStorage().then((loaded) => {
    store.length = 0;
    store.push(...loaded);
    const maxNum = loaded.reduce((max, t) => {
      const m = t.id.match(/^task-(\d+)$/);
      return m ? Math.max(max, parseInt(m[1] ?? '0', 10)) : max;
    }, 0);
    nextId = maxNum + 1;
    hasLoadedFromStorage = true;
  });
}

export function createTaskRegistry(): OperationSpecRegistry {
  const reg = new OperationSpecRegistry();

  installOp(reg, TaskListQuery, async (_input, _ctx: HandlerCtx) => {
    await ensureLoaded();
    return { tasks: [...store] } as unknown as {
      tasks: Record<string, unknown>[];
    };
  });

  installOp(
    reg,
    TaskCreateCommand,
    async (input: { title: string }, _ctx: HandlerCtx) => {
      await ensureLoaded();
      const title = String(input.title).trim();
      if (!title || title.length > 500) {
        throw new Error('Title must be 1–500 characters');
      }
      const task: Task = {
        id: generateId(),
        title,
        done: false,
      };
      store.push(task);
      await saveTasksToStorage(store);
      return task;
    }
  );

  installOp(
    reg,
    TaskUpdateStatusCommand,
    async (input: { id: string; done: boolean }, _ctx: HandlerCtx) => {
      await ensureLoaded();
      const task = store.find((t) => t.id === input.id);
      if (!task) {
        throw new Error(`Task not found: ${input.id}`);
      }
      task.done = input.done;
      await saveTasksToStorage(store);
      return task;
    }
  );

  return reg;
}

export const taskRegistry = createTaskRegistry();
